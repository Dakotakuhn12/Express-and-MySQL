const mysql = require("mysql2");

const db = mysql.createConnection({
  database: "igdb",
  user: "root",
  password: "password",
  host: "localhost",
});

db.connect((err) => {
  if (err) {
    console.error("DB Connection Failed", err);
  } else {
    console.log("Connected to DB");
  }
});

module.exports = db;
