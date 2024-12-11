const express = require('express');
const router = express.Router();

router.get('/:id', async (req, res) => {
    const clientId = req.params.id;
    try {
        const [rows] = await db.query('SELECT * FROM clients WHERE id = ?', [clientId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching client:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = router;