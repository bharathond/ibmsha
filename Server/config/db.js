var mysqlModel = require("mysql-model");
let HOST = process.env.HOST || "localhost";
let USER = process.env.USER || "root";
let PASS = process.env.PASS || "Ashmishara";
let DB = process.env.DB || "nodeapp";

var connection = mysqlModel.createConnection({
  host: HOST,
  user: "root",
  password: "root",
  database: DB,
});

module.exports = connection;
