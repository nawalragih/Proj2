const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Adjust path based on your project structure

// PUT route to review a quote (Reject or Send Counter Proposal)
router.put('/quotes/:id/review', async (req, res) => {
    const { id } = req.params;
    const { action, note, newPrice, newTimeWindow } = req.body;

    if (!action || (action === 'SEND' && (!newPrice || !newTimeWindow)) || (action === 'REJECT' && !note)) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        if (action === 'REJECT') {
            // Reject the quote with a note
            await db.query('UPDATE Quotes SET status = ?, note = ? WHERE id = ?', ['REJECTED', note, id]);
            res.status(200).json({ message: 'Quote rejected successfully' });
        } else if (action === 'SEND') {
            // Send a counterproposal
            await db.query('UPDATE Quotes SET status = ?, proposedPrice = ?, timeWindow = ? WHERE id = ?',
                ['NEGOTIATING', newPrice, newTimeWindow, id]);
            res.status(200).json({ message: 'Counter proposal sent successfully' });
        }
    } catch (error) {
        console.error('Error reviewing quote:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
