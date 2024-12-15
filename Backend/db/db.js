const mysql = require('mysql2');

// Create a connection pool
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',  // Use your actual password
    database: 'driveway_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Use promise-based queries from the pool
const pool = db.promise();  // This allows you to use query as a promise

// Function to create a new quote
async function createQuote(clientId, propertyAddress, squareFeet, proposedPrice, status, images, note) {
    const query = ` 
        INSERT INTO quotes (clientId, propertyAddress, squareFeet, proposedPrice, status, images, note) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    try {
        const [result] = await pool.execute(query, [clientId, propertyAddress, squareFeet, proposedPrice, status, images, note]);
        return result.insertId;  // Return the insert ID for the newly created quote
    } catch (err) {
        throw new Error('Error creating quote: ' + err.message);
    }
}

// Function to get client by their ID
async function getClientById(clientId) {
    const query = 'SELECT * FROM Clients WHERE clientId = ?';
    try {
        const [results] = await pool.execute(query, [clientId]);
        return results[0]; // Returns the client data or undefined if no match
    } catch (err) {
        throw new Error('Error fetching client by ID: ' + err.message);
    }
}

// Function to get client by their email
async function getClientByEmail(email) {
    const query = 'SELECT * FROM Clients WHERE email = ?';
    try {
        const [results] = await pool.execute(query, [email]);
        return results[0]; // Return client info if found, or undefined if not
    } catch (err) {
        throw new Error('Error fetching client by email: ' + err.message);
    }
}

// Expose the database functions and pool
module.exports = {
    pool,  // This is what you should be importing and using in your routes
    createQuote,
    getClientById,
    getClientByEmail,
};
