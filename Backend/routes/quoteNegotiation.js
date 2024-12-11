const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Adjust path based on your project structure

// PUT route to resubmit the quote request
router.put('/quote-request/:id/resubmit', async (req, res) => {
    const { id } = req.params;
    const { proposedPrice, squareFeet, address, note } = req.body;

    if (!proposedPrice || !address || !squareFeet || !note) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        await db.query(
            'UPDATE Quotes SET proposedPrice = ?, squareFeet = ?, propertyAddress = ?, note = ?, status = ? WHERE id = ?',
            [proposedPrice, squareFeet, address, note, 'NEGOTIATING', id]
        );
        res.status(200).json({ message: 'Quote resubmitted successfully for negotiation' });
    } catch (error) {
        console.error('Error resubmitting quote request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
