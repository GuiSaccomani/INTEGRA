const axios = require("axios");

const oracledb = require("oracledb");
const dbConfig = require("../dbConfig");

exports.fetchExternalData = async () => {
  try {
    const response = await axios.get("https://jsonplaceholder.typicode.com/todos/1");
    return response.data;
  } catch (error) {
    throw new Error("Erro ao buscar dados externos");
  }
};

exports.saveData = async (name, value) => {
  let connection;
 
  try {
    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `INSERT INTO DATA_TABLE (NAME, VALUE) VALUES (:name, :value) RETURNING ID INTO :id`,
      {
        name,
        value,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );

    return { id: result.outBinds.id[0], name, value };
  } catch (err) {
    throw new Error("Erro ao salvar dados no banco: " + err.message);
  } finally {
    if (connection) await connection.close();
  }
};