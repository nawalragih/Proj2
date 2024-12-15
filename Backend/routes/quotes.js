const express = require('express');
const router = express.Router(); 
const db = require('../db/db');

// GET route to fetch all quotes
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.pool.execute("SELECT * FROM Quotes");
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching quotes:', error);
        res.status(500).json({ error: 'Failed to fetch quotes' });
    }
});

// POST route to add a quote
router.post('/', async (req, res) => {
    const { clientId, propertyAddress, squareFeet, proposedPrice, status, dateRequested } = req.body;

    if (!clientId || !propertyAddress || !squareFeet || !status) {
        return res.status(400).json({ error: 'Missing required fields: clientId, address, squareFeet, and status' });
    }

    try {
        await db.pool.execute(
            'INSERT INTO Quotes (clientId, propertyAddress, squareFeet, proposedPrice, status, dateRequested) VALUES (?, ?, ?, ?, ?, ?)',
            [clientId, propertyAddress, squareFeet, proposedPrice || null, status, dateRequested || null]
        );
        res.status(201).json({ message: 'Quote submitted successfully' });
    } catch (error) {
        console.error('Error adding quote:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
