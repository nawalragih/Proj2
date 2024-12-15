const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'driveway_management',
});

module.exports = db;

async function createQuote(clientId, propertyAddress, squareFeet, proposedPrice, status, images, note) {
    const query = `
        INSERT INTO quotes (clientId, propertyAddress, squareFeet, proposedPrice, status, images, note) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const response = await new Promise((resolve, reject) => {
        connection.query(query, [clientId, propertyAddress, squareFeet, proposedPrice, status, images, note], (err, result) => {
            if (err) {
                reject(new Error(err.message));
            } else {
                resolve(result.insertId);
            }
        });
    });
    return response;
}

async function getClientById(clientId) {
    const query = 'SELECT * FROM Clients WHERE clientId = ?';
    const [results] = await db.execute(query, [clientId]);
    return results[0]; // Returns the client data or undefined if no match
}

async function getClientByEmail(email) {
    const query = 'SELECT * FROM Clients WHERE email = ?';
    const [results] = await db.execute(query, [email]);
    return results[0]; // Return client info if found, or undefined
}

module.exports = {
    createQuote,
    getClientById,
    getClientByEmail
};
