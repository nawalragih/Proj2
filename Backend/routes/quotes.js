const express = require('express');
const router = express.Router(); // Define the router
const db = require('../db/db');

// POST route to add a quote
router.post('/', async (req, res) => {
    const { clientId, address, squareFeet } = req.body;

    // Validate input
    if (!clientId || !address || !squareFeet) {
        return res.status(400).json({ error: 'Missing required fields: clientId, address, squareFeet' });
    }

    try {
        // Insert the new quote into the database
        await db.query(
            'INSERT INTO Quotes (clientId, propertyAddress, squareFeet, proposedPrice, status) VALUES (?, ?, ?, ?, ?)',
            [clientId, address, squareFeet, null, 'PENDING'] // Default proposedPrice to null and status to 'PENDING'
        );
        res.status(201).json({ message: 'Quote submitted successfully' });
    } catch (error) {
        console.error('Error adding quote:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Export the router
module.exports = router;
