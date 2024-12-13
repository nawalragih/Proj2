const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Adjust path based on your project structure

// API route to submit the quote request (Backend)
router.post('/quote-request', async (req, res) => {
    const { clientId, address, squareFeet, proposedPrice, note, images } = req.body;

    if (!clientId || !address || !squareFeet || !proposedPrice) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Example SQL query to insert the quote request into the database
        await db.query('INSERT INTO QuoteRequests (clientId, address, squareFeet, proposedPrice, note, images) VALUES (?, ?, ?, ?, ?, ?)',
            [clientId, address, squareFeet, proposedPrice, note, JSON.stringify(images)]
        );

        res.status(201).json({ message: 'Quote request submitted successfully' });
    } catch (error) {
        console.error('Error submitting quote request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
