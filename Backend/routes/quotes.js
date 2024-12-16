const express = require('express');
const router = express.Router();
const { pool } = require('../db/db');  // Importing pool object

// Fetch all quotes
router.get('/', async (req, res) => {
    console.log('Fetching quotes...');

    try {
        const [quotes] = await pool.execute('SELECT * FROM quotes');
        console.log('Quotes fetched:', quotes);

        res.status(200).json(quotes);
    } catch (error) {
        console.error('Error fetching quotes:', error);
        res.status(500).json({ error: 'Error fetching quotes' });
    }
});

// Accept a quote
router.put('/:id/accept', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.execute(
            'UPDATE quotes SET status = ?, acceptedPrice = proposedPrice WHERE id = ?',
            ['ACCEPTED', id]
        );
        console.log('Quote accepted:', result);

        res.status(200).json({ message: 'Quote accepted successfully with the proposed price' });
    } catch (error) {
        console.error('Error accepting quote:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Reject a quote
router.put('/:id/reject', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.execute('UPDATE quotes SET status = ? WHERE id = ?', ['REJECTED', id]);
        console.log('Quote rejected:', result);

        res.status(200).json({ message: 'Quote rejected successfully' });
    } catch (error) {
        console.error('Error rejecting quote:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Negotiate a quote (David sends a proposed amount with a note)
router.put('/:id/negotiate', async (req, res) => {
    const { id } = req.params;
    const { note, proposedPrice } = req.body;

    if (!note || !proposedPrice) {
        return res.status(400).json({ error: 'Negotiation note and proposed price are required' });
    }

    try {
        const [result] = await pool.execute('UPDATE quotes SET note = ?, proposedPrice = ?, status = ? WHERE id = ?', [note, proposedPrice, 'NEGOTIATING', id]);
        console.log('Quote negotiation initiated:', result);

        res.status(200).json({ message: 'Negotiation sent to client with proposed price' });
    } catch (error) {
        console.error('Error negotiating quote:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
