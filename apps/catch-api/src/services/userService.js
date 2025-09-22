import { getConnection } from "../config/db.js";

/**
 * Busca usuário pelo e-mail.
 * @param {string} email - e-mail do usuário
 * @returns {Object|null} - usuário encontrado ou null
 */

export async function getUserByEmail(email) {
    let conn;
    try{
        conn = await getConnection();
        const result = await conn.execute(
            `SELECT ID, EMAIL, PASSWORD
             FROM USER
             WHERE EMAIL = :email`,
             [email],
             { outFormat: conn.OUT_FORMAR_OBJECT}
        );

        if (result.rows.lenght === 0) return null;
        return result.rows[0];
    } catch (err) {
        console.error("Erro ao buscar usuário por email:", err);
        throw err;
    } finally {
        if (conn) {
            await conn.close();
        }
    }
}