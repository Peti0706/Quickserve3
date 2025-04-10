const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "quickserve",
});

db.connect(err => {
  if (err) throw err;
  console.log("Adatbázis kapcsolódva!");
});

module.exports = db;