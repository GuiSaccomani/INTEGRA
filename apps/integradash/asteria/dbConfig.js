// config/dbConfig.js
const oracledb = require("oracledb");

const dbConfig = {
  user: "INTEGRA",        // ex: "system"
  password: "1111",      // ex: "oracle"
  connectString: "localhost:1521/XE" // ex: "host:porta/SID ou SERVICE_NAME"
};

module.exports = dbConfig;
 