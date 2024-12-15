const express = require('express');
const router = express.Router();
const { pool } = require('../db/db');  // Importing pool object

// Fetch all quotes
router.get('/', async (req, res) => {
    console.log('Fetching quotes...');  // Logs when the request is received

    try {
        // Query the database to get all quotes
        const [quotes] = await pool.execute('SELECT * FROM quotes');
        console.log('Quotes fetched:', quotes);  // Logs the fetched quotes

        // Send the quotes back as a JSON response
        res.status(200).json(quotes);
    } catch (error) {
        console.error('Error fetching quotes:', error);  // Logs any error that occurs
        res.status(500).json({ error: 'Error fetching quotes' });
    }
});

// Accept a quote
router.put('/:id/accept', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.execute('UPDATE quotes SET status = ? WHERE id = ?', ['ACCEPTED', id]);
        console.log('Quote accepted:', result);

        res.status(200).json({ message: 'Quote accepted successfully' });
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

// Negotiate a quote
router.put('/:id/negotiate', async (req, res) => {
    const { id } = req.params;
    const { proposedPrice } = req.body;

    if (!proposedPrice) {
        return res.status(400).json({ error: 'Proposed price is required' });
    }

    try {
        const [result] = await pool.execute('UPDATE quotes SET proposedPrice = ?, status = ? WHERE id = ?', [proposedPrice, 'NEGOTIATING', id]);
        console.log('Quote negotiation initiated:', result);

        res.status(200).json({ message: 'Negotiation initiated with the client' });
    } catch (error) {
        console.error('Error negotiating quote:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
