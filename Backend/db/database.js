const mysql = require('mysql2/promise');
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'driveway_sealing'
});

module.exports = db;
