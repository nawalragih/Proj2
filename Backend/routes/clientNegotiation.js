const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Adjust path as needed

// PUT route for clients to negotiate a quote
router.put('/quote-request/:id/negotiate', async (req, res) => {
    const { id } = req.params;
    const { proposedPrice } = req.body;

    if (!proposedPrice) {
        return res.status(400).json({ error: 'Missing proposed price' });
    }

    try {
        // Update quote status to "Negotiating" and set the proposed price
        await db.query(
            'UPDATE Quotes SET proposedPrice = ?, status = ? WHERE id = ?',
            [proposedPrice, 'NEGOTIATING', id]
        );
        res.status(200).json({ message: 'Quote price updated for negotiation' });
    } catch (error) {
        console.error('Error updating quote:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
