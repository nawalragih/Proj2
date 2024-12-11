const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Adjust path based on your project structure

// POST route for quote request
router.post('/quote-request', async (req, res) => {
    const { clientId, address, squareFeet, proposedPrice, images, note } = req.body;

    // Validate input
    if (!clientId || !address || !squareFeet || !proposedPrice || !images || images.length !== 5) {
        return res.status(400).json({ error: 'Missing required fields or invalid number of images' });
    }

    try {
        await db.query(
            'INSERT INTO Quotes (clientId, propertyAddress, squareFeet, proposedPrice, status, note) VALUES (?, ?, ?, ?, ?, ?)',
            [clientId, address, squareFeet, proposedPrice, 'PENDING', note]
        );

        // Assuming the image upload has been handled separately, save image file references (URLs or file paths)
        // Save images references to a new table 'QuoteImages' (optional step)
        images.forEach(async (image) => {
            await db.query('INSERT INTO QuoteImages (quoteId, imagePath) VALUES (?, ?)', [quoteId, image]);
        });

        res.status(201).json({ message: 'Quote request submitted successfully' });
    } catch (error) {
        console.error('Error submitting quote request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
