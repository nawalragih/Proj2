const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// This route handles POST requests
router.post('/', upload.array('images'), async (req, res) => { 
    const { clientId, propertyAddress, squareFeet, proposedPrice, note } = req.body;

    // Validate required fields
    if (!clientId || !propertyAddress || !squareFeet || !proposedPrice) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        console.log('Quote request received:', req.body);
        res.status(201).json({ message: 'Quote request submitted successfully' });
    } catch (error) {
        console.error('Error processing quote request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
