const oracledb = require("oracledb");
const dbConfig1 = require("../config/dbConfig1");
const dbConfig2 = require("../config/dbConfig2");

async function syncSales() {
  let sourceConn, targetConn;

  try {
    sourceConn = await oracledb.getConnection(dbConfig1);
    targetConn = await oracledb.getConnection(dbConfig2);

    console.log("🔄 Buscando registros do banco 1...");

    const result = await sourceConn.execute(`
      SELECT SALE_ID, SALE_TIMESTAMP, SALE_BARCODE, SALE_BARCODE_TYPE
      FROM SALES
    `);

    const rows = result.rows || [];
    console.log(`Encontrados ${rows.length} registros.`);

    for (const row of rows) {
      const [SALE_ID, SALE_TIMESTAMP, SALE_BARCODE, SALE_BARCODE_TYPE] = row;

      await targetConn.execute(
        `
        MERGE INTO SALES t
        USING (SELECT :SALE_ID AS SALE_ID FROM dual) s
        ON (t.SALE_ID = s.SALE_ID)
        WHEN MATCHED THEN
          UPDATE SET
            t.SALE_TIMESTAMP = :SALE_TIMESTAMP,
            t.SALE_BARCODE = :SALE_BARCODE,
            t.SALE_BARCODE_TYPE = :SALE_BARCODE_TYPE
        WHEN NOT MATCHED THEN
          INSERT (SALE_ID, SALE_TIMESTAMP, SALE_BARCODE, SALE_BARCODE_TYPE)
          VALUES (:SALE_ID, :SALE_TIMESTAMP, :SALE_BARCODE, :SALE_BARCODE_TYPE)
        `,
        {
          SALE_ID,
          SALE_TIMESTAMP,
          SALE_BARCODE,
          SALE_BARCODE_TYPE
        },
        { autoCommit: false }
      );
    }

    await targetConn.commit();
    console.log("✅ Sincronização concluída com sucesso!");
  } catch (err) {
    console.error("❌ Erro na sincronização:", err);
  } finally {
    if (sourceConn) await sourceConn.close();
    if (targetConn) await targetConn.close();
  }
}

module.exports = { syncSales };
