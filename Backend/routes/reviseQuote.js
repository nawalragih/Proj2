const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Adjust path as needed

// PUT route for David to revise a quote
router.put('/quote-request/:id/resubmit', async (req, res) => {
    const { id } = req.params;
    const { proposedPrice } = req.body;

    if (!proposedPrice) {
        return res.status(400).json({ error: 'Missing proposed price' });
    }

    try {
        // Update the quote with new price and status
        await db.query(
            'UPDATE Quotes SET proposedPrice = ?, status = ? WHERE id = ?',
            [proposedPrice, 'WAITING FOR CLIENT RESPONSE', id]
        );
        res.status(200).json({ message: 'Quote revised and sent back to client' });
    } catch (error) {
        console.error('Error revising quote:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
