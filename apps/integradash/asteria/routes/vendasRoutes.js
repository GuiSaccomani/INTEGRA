const express = require("express");
const oracledb = require("oracledb");
const dbConfig = require("../dbConfig");

const router = express.Router();

// GET - listar vendas cruzando SALES com PRODUTOS
router.get("/vendas", async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const sql = `
      SELECT 
        p.NOME_PRODUTO,
        p.PRECO,
        p.CATEGORIA,
        p.FORNECEDOR,
        s.SALE_ID,
        s.SALE_TIMESTAMP,
        s.SALE_BARCODE,
        s.SALE_BARCODE_TYPE
      FROM INTEGRA.SALES s
      LEFT JOIN PRODUTOS p
        ON s.SALE_BARCODE = p.CODIGO_BARRAS
      ORDER BY s.SALE_TIMESTAMP DESC
    `;

    const result = await connection.execute(sql);

    const vendas = result.rows.map(row => ({
      nome_produto: row[0],
      preco: row[1],
      categoria: row[2],
      fornecedor: row[3],
      sale_id: row[4],
      sale_timestamp: row[5],
      sale_barcode: row[6],
      sale_barcode_type: row[7]
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
