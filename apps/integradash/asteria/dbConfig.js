// config/dbConfig.js
const oracledb = require("oracledb");

const dbConfig = {
  user: "SYS",        // ex: "system"
  password: "Authentic12",      // ex: "oracle"
  connectString: "localhost:1521/XE", // ex: "host:porta/SID ou SERVICE_NAME"
    privilege: oracledb.SYSDBA
};

module.exports = dbConfig;
 