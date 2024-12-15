const express = require('express');
const router = express.Router();
const db = require('../db'); // Import database connection

router.post('/', async (req, res) => {
    const { clientId, propertyAddress, squareFeet, proposedPrice, note } = req.body;

    // Validate required fields
    if (!clientId || !propertyAddress || !squareFeet || !proposedPrice) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const status = 'Pending';
        const query = `
            INSERT INTO quotes (clientId, propertyAddress, squareFeet, proposedPrice, status, note)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        await db.execute(query, [clientId, propertyAddress, squareFeet, proposedPrice, status, note]);

        res.status(201).json({ message: 'Quote request submitted successfully' });
    } catch (error) {
        console.error('Error processing quote request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
