// config/dbConfig.js
const oracledb = require("oracledb");

const dbConfig = {
  user: "INTEGRA2",        // ex: "system"
  password: "1111",      // ex: "oracle"
  connectString: "localhost:1521/XEPDB1" // ex: "host:porta/SID ou SERVICE_NAME"
};

module.exports = dbConfig;
 