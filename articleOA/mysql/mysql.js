const mysql = require("mysql");

const db = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "123456",
    database: "test2"
});

db.getConnection((err, data) => {
    if (err) return console.log(err.message);

    console.log("连接数据库成功");
})

module.exports = db;

