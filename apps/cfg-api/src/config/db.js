import oracledb from "oracledb";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

const dbConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}/${process.env.ORACLE_SERVICE}`
};

export async function getConnection() {
  try {
    const conn = await oracledb.getConnection(dbConfig);
    console.log("Conectado ao Oracle");
    return conn;
  } catch (err) {
    console.error("Erro ao conectar ao Oracle:", err);
    throw err;
  }
}
