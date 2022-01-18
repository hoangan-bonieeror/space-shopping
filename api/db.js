require('dotenv').config()
var mysql = require('mysql');
// console.log(process.env)
var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.PASSWORD_DB,
  database : process.env.DB_NAME
});

db.connect(function(err) {
  if (err) throw err;
  console.log(`Connect ${process.env.DB_NAME} database`);
});

module.exports = db;