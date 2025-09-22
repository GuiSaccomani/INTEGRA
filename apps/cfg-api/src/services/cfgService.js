import { getConnection } from "../config/db.js";
import { saveLog } from "./logService.js";

export async function getCfg() {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute("SELECT * FROM cfg");
    return result.rows;
  } catch (err) {
    console.error("Erro ao buscar dados de cfg:", err);
    throw err;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

/**
 * Atualiza configurações da tabela cfg e registra logs de alterações.
 * @param {Object} newCfg - objeto com novas configurações enviadas pelo frontend
 */
export async function updateCfg(newCfg) {
  let conn;
  try {
    conn = await getConnection();

    // pegar os valores antigos
    const result = await conn.execute("SELECT * FROM cfg");
    const oldCfg = result.rows[0];

    // montar cláusulas SET
    const setClauses = [];
    const bindParams = {};
    for (const key in newCfg) {
      setClauses.push(`${key} = :${key}`);
      bindParams[key] = newCfg[key];
    }

    if (setClauses.length > 0) {
      const sql = `UPDATE cfg SET ${setClauses.join(", ")}`;
      await conn.execute(sql, bindParams, { autoCommit: true });

      const changes = [];
      for (const key in newCfg) {
        if (oldCfg[key] !== undefined && oldCfg[key] !== newCfg[key]) {
          changes.push(`${key}: ${oldCfg[key]} -> ${newCfg[key]}`);
        }
      }

      if (changes.length > 0) {
        const logContent = `Configurações alteradas: ${changes.join(", ")}`;
        await saveLog("CFG", logContent);
      }
    }

    return { updated: setClauses.length };
  } catch (err) {
    console.error("Erro ao atualizar cfg:", err);
    await saveLog("ERROR", `Erro ao atualizar cfg: ${err.message}`);
    throw err;
  } finally {
    if (conn) await conn.close();
  }
}
