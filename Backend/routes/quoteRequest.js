const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Assuming db is your database connection
const isLoggedIn = require('../middleware/isLoggedIn'); // Adjust the path if needed

router.post('/create', isLoggedIn, async (req, res) => {
    const { propertyAddress, squareFeet } = req.body;
    const id = req.session.user?.id;

    if (!id) {
        return res.status(401).json({ error: 'Client ID is missing. Please log in first.' });
    }

    try {
        const query = 'INSERT INTO quotes (id, propertyAddress, squareFeet) VALUES (?, ?, ?)';
        await db.query(query, [id, propertyAddress, squareFeet]);

        res.status(200).json({ success: true, message: 'Quote submitted successfully' });
    } catch (error) {
        console.error('Error submitting quote:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
