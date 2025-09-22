import { getConnection } from "../config/db.js";
import oracledb from "oracledb";

export async function getUserByEmail(email) {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT USER_ID, USER_EMAIL, USER_PASSWORD
       FROM USERS
       WHERE USER_EMAIL = :email`,
      [email],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) return null;
    return result.rows[0];
  } catch (err) {
    console.error("Erro ao buscar usuário por email:", err);
    throw err;
  } finally {
    if (conn) await conn.close();
  }
}
