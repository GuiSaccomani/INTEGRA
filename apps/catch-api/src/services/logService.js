import { getConnection } from "../config/db.js";
import {v4 as uuidv4} from "uuid";

/**
 * Salvar linha na tabela logs.
 * @param {string} type - tipo do log (ERROR, INFO, etc.)
 * @param {string} content - mensagem do log
 */

export async function saveLog(type, content) {
  let conn;
  try {
    const logId = uuidv4();
    const logTimeStamp = new Date();
    conn = await getConnection();
    await conn.execute(
      `INSERT INTO logs (log_id, log_type, log_content, log_timestamp)
       VALUES (:id, :type, :content, :timestamp)`,
      { id: logId, type, content, timestamp: logTimeStamp },
      { autoCommit: true }
    );
  } catch (err) {
    console.error("Falha ao salvar log no banco:", err);
  } finally {
    if (conn) await conn.close();
  }
}

/**
 * Retornar os logs do banco, ordenados do mais recente para o mais antigo.
 * @param {number} limit - quantidade máxima de logs a retornar
 */

export async function getLogs(limit = 100) {
    let conn;
    try{
        conn = await getConnection();
        const result = await conn.execute(
            `SELECT log_type, log_content
            FROM logs
            ORDER BY log_timestamp DESC
            FETCH FIRST :limit ROWS ONLY`,
            { limit }
        );
        return result.rows;
    } catch (err) {
        console.error("Erro ao buscar logs:", err);
        throw err;
    } finally {
        if (conn) await conn.close();
    }
}