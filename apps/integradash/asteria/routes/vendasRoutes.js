const express = require("express");
const oracledb = require("oracledb");
const dbConfig = require("../dbConfig");

const router = express.Router();

// POST - inserir venda na tabela VENDAS
router.post("/vendas", async (req, res) => {
  const { sale_date, sale_barcode, sale_barcode_type } = req.body;

  if (!sale_date || !sale_barcode || !sale_barcode_type) {
    return res.status(400).json({
      error: "Campos obrigatórios: sale_date, sale_barcode, sale_barcode_type"
    });
  }

  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    // Consulta a tabela PRODUTOS pelo código de barras
    const produtoResult = await connection.execute(
      `SELECT NOME_PRODUTO, PRECO, CATEGORIA, FORNECEDOR
       FROM PRODUTOS
       WHERE CODIGO_BARRAS = :barcode`,
      [sale_barcode]
    );

    if (produtoResult.rows.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado na tabela PRODUTOS" });
    }
 
    const [nome_produto, preco, categoria, fornecedor] = produtoResult.rows[0];

    // Insere na tabela VENDAS
    const sql = `
      INSERT INTO VENDAS (
        ID_VAREJO, NOME_PRODUTO, CODIGO_DE_BARRAS, PRECO, CATEGORIA, FORNECEDOR,
        SALE_DATE, SALE_BARCODE_TYPE
      ) VALUES (
        :id_varejo, :nome_produto, :codigo_barras, :preco, :categoria, :fornecedor,
        TO_DATE(:sale_date, 'YYYY-MM-DD HH24:MI:SS'), :sale_barcode_type
      )
    `;

    await connection.execute(
      sql,
      {
        id_varejo: 1,
        nome_produto,
        codigo_barras: sale_barcode,
        preco,
        categoria,
        fornecedor,
        sale_date,
        sale_barcode_type
      },
      { autoCommit: true }
    );

    return res.status(201).json({ message: "Venda registrada com sucesso" });
  } catch (err) {
    console.error("Erro no POST /vendas:", err);
    return res.status(500).json({ error: "Erro ao inserir venda" });
  } finally {
    if (connection) await connection.close();
  }
});

// GET - listar vendas da tabela VENDAS
router.get("/vendas", async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(`
      SELECT ID_VAREJO, NOME_PRODUTO, CODIGO_DE_BARRAS, PRECO, CATEGORIA, FORNECEDOR,
             SALE_DATE, SALE_BARCODE_TYPE
      FROM VENDAS
      ORDER BY SALE_DATE DESC
    `);

    const vendas = result.rows.map(row => ({
      id_varejo: row[0],
      nome_produto: row[1],
      codigo_barras: row[2],
      preco: row[3],
      categoria: row[4],
      fornecedor: row[5],
      sale_date: row[6],
      sale_barcode_type: row[7],
    }));

    return res.json(vendas);
  } catch (err) {
    console.error("Erro no GET /vendas:", err);
    return res.status(500).json({ error: "Erro ao buscar vendas" });
  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;
