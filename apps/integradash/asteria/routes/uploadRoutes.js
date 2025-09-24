const express = require("express");
const multer = require("multer");
const fs = require("fs");
const csv = require("csv-parser");
const oracledb = require("oracledb");
const dbConfig = require("../dbConfig");

const router = express.Router();

// Configuração do multer (upload para pasta /uploads)
const upload = multer({ dest: "uploads/" });

// Rota para upload de CSV de produtos
router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Nenhum arquivo enviado" });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    const produtos = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        produtos.push(row);
      })
      .on("end", async () => {
        try {
          for (const p of produtos) {
            await connection.execute(
              `INSERT INTO PRODUTOS (
                NOME_PRODUTO, CODIGO_BARRAS, PRECO, CATEGORIA, FORNECEDOR
              ) VALUES (:1, :2, :3, :4, :5)`,
              [
                p.nomeProduto,
                p.codigoBarras,
                parseFloat(p.preco),
                p.categoria,
                p.fornecedor // já deve vir sem caracteres especiais no CSV
              ],
              { autoCommit: false }
            );
          }

          await connection.commit();
          fs.unlinkSync(req.file.path); // remove arquivo após processar
          res.json({ message: "Importação de produtos concluída com sucesso" });
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: "Erro ao importar produtos do CSV" });
        } finally {
          await connection.close();
        }
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao processar arquivo" });
  }
});

// GET - Listar produtos
router.get("/produtos", async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(`
      SELECT NOME_PRODUTO, CODIGO_BARRAS, PRECO, CATEGORIA, FORNECEDOR
      FROM PRODUTOS
      ORDER BY NOME_PRODUTO
    `);

    const produtos = result.rows.map(row => ({
      nomeProduto: row[0],
      codigoBarras: row[1],
      preco: row[2],
      categoria: row[3],
      fornecedor: row[4]
    }));

    res.json(produtos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar produtos" });
  } finally {
    if (connection) await connection.close();
  }
}); 

module.exports = router;
