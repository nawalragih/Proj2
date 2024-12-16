const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn'); // Adjust the path if needed
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'driveway_management'
});

module.exports = db;
router.post('/create', isLoggedIn, async (req, res) => {
    const { propertyAddress, squareFeet, proposedPrice, note } = req.body;
    const clientID = req.session.user?.id;

    if (!clientID) {
        console.log('Client ID missing');
        return res.status(401).json({ error: 'Client ID is missing. Please log in first.' });
    }

    try {
        console.log('Inserting quote:', { clientID, propertyAddress, squareFeet, proposedPrice, note });

        const query = 'INSERT INTO quotes (clientId, propertyAddress, squareFeet, proposedPrice, note) VALUES (?, ?, ?, ?, ?)';
        const result = await db.promise().query(query, [clientID, propertyAddress, squareFeet, proposedPrice, note]);

        console.log('Quote insertion result:', result);  // Log the result to check if insertion was successful

        res.status(200).json({ success: true, message: 'Quote submitted successfully' });
    } catch (error) {
        console.error('Error inserting quote:', error);  // Log the error to the server console
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;