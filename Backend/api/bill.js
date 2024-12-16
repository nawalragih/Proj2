const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Fetch all bills
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.pool.execute('SELECT * FROM bills');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch bills' });
    }
});

// Add a new bill
router.post('/', async (req, res) => {
    const { orderId, amount, dateIssued } = req.body;
    if (!orderId || !amount || !dateIssued) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        await db.pool.execute(
            'INSERT INTO bills (orderId, amount, dateIssued) VALUES (?, ?, ?)',
            [orderId, amount, dateIssued]
        );
        res.status(201).json({ message: 'Bill created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create bill' });
    }
});

// Update a bill
router.put('/:id', async (req, res) => {
    const { amount } = req.body;
    const { id } = req.params;

    if (!amount) {
        return res.status(400).json({ error: 'Amount is required' });
    }

    try {
        const [result] = await db.pool.execute('UPDATE bills SET amount = ? WHERE id = ?', [amount, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Bill not found' });
        }
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
        const [result] = await db.pool.execute('DELETE FROM bills WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Bill not found' });
        }
        res.json({ message: 'Bill deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete bill' });
    }
});

module.exports = router;
