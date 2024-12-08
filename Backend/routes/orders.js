const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Get all orders
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM orders");
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Create a new order
router.post('/', async (req, res) => {
    const { clientId, quoteId, serviceDate } = req.body;
    if (!clientId || !quoteId || !serviceDate) {
        return res.status(400).json({ error: 'Missing required fields: clientId, quoteId, serviceDate' });
    }
    try {
        await db.query(
            "INSERT INTO orders (clientId, quoteId, serviceDate) VALUES (?, ?, ?)",
            [clientId, quoteId, serviceDate]
        );
        res.status(201).json({ message: 'Order created successfully' });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Update an order (e.g., change service date)
router.put('/:id', async (req, res) => {
    const { serviceDate } = req.body;
    const { id } = req.params;

    if (!serviceDate) {
        return res.status(400).json({ error: 'Missing required field: serviceDate' });
    }

    try {
        const [result] = await db.query("UPDATE orders SET serviceDate = ? WHERE id = ?", [serviceDate, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json({ message: 'Order updated successfully' });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Failed to update order' });
    }
});

// Delete an order
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query("DELETE FROM orders WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Failed to delete order' });
    }
});

module.exports = router;
