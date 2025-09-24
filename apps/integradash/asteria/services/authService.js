const oracledb = require("oracledb");
const dbConfig = require("../dbConfig");

// Função de login que retorna apenas token
exports.login = async (usuario, senha) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT 1 FROM USUARIOS WHERE NAME = :usuario AND PASSWORD_HASH = :senha`,
      [usuario, senha]
    );

    if (result.rows.length === 0) {
      return null; // Credenciais inválidas
    }
 
    // Simulação de token
    return `token-${Date.now()}`;
  } catch (err) {
    throw new Error("Erro ao autenticar: " + err.message);
  } finally {
    if (connection) await connection.close();
  }
};
 