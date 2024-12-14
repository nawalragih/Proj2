const express = require('express');
const router = express.Router();
const db = require('../db/db');  // Assuming you have a database connection file

// POST route for client registration
router.post('/', async (req, res) => {
    const { firstName, lastName, propertyAddress, creditCardInfo, phoneNumber, email } = req.body;

    // Validate input
    if (!firstName || !lastName || !propertyAddress || !creditCardInfo || !phoneNumber || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate a unique client ID (for example, could be an auto-incremented value or UUID)
    const clientId = Math.floor(Math.random() * 10000); // Example logic for unique client ID

    try {
        await db.query(
            'INSERT INTO Clients (clientId, firstName, lastName, propertyAddress, creditCardInfo, phoneNumber, email) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [clientId, firstName, lastName, propertyAddress, creditCardInfo, phoneNumber, email]
        );
        res.status(201).json({ message: 'Client registered successfully', clientId });
    } catch (error) {
        console.error('Error registering client:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
