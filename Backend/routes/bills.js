const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Get all bills
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM bills');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch bills' });
    }
});

// Create a new bill
router.post('/', async (req, res) => {
    const { orderId, amount, dateIssued } = req.body;
    try {
        await db.query(
            'INSERT INTO bills (orderId, amount, dateIssued) VALUES (?, ?, ?)',
            [orderId, amount, dateIssued]
        );
        res.status(201).json({ message: 'Bill created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create bill' });
    }
});

// Update a bill (e.g., update amount)
router.put('/:id', async (req, res) => {
    const { amount } = req.body;
    const { id } = req.params;
    try {
        await db.query('UPDATE bills SET amount = ? WHERE id = ?', [amount, id]);
        res.json({ message: 'Bill updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update bill' });
    }
});

// Delete a bill
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM bills WHERE id = ?', [id]);
        res.json({ message: 'Bill deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete bill' });
    }
});

module.exports = router;
