const express = require('express');
const router = express.Router(); // Define the router
const db = require('../db/db');

// GET route to fetch all quotes
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM Quotes");
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching quotes:', error);
        res.status(500).json({ error: 'Failed to fetch quotes' });
    }
});

// POST route to add a quote
router.post('/', async (req, res) => {
    const { clientId, propertyAddress, squareFeet, proposedPrice, status, dateRequested } = req.body;

    // Validate input
    if (!clientId || !propertyAddress|| !squareFeet || !status) {
        return res.status(400).json({ error: 'Missing required fields: clientId, address, squareFeet, and status' });
    }

    try {
        // Insert the new quote into the database
        await db.query(
            'INSERT INTO Quotes (clientId, propertyAddress, squareFeet, proposedPrice, status, dateRequested) VALUES (?, ?, ?, ?, ?, ?)',
            [clientId, propertyAddress, squareFeet, proposedPrice || null, status, dateRequested || null] // Optional fields handled
        );
        res.status(201).json({ message: 'Quote submitted successfully' });
    } catch (error) {
        console.error('Error adding quote:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Export the router
module.exports = router;
