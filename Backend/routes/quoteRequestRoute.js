// quoteRequestRoute.js
const express = require('express');
const router = express.Router();
const multer = require('multer');

// Set up multer for handling file uploads
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.array('images'), async (req, res) => {
    const { clientId, propertyAddress, squareFeet, proposedPrice, note } = req.body;
    
    // Check if all required fields are present
    if (!clientId || !propertyAddress || !squareFeet || !proposedPrice) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        console.log('Received quote request:', req.body);
        
        // You can save the data to your database here, for example:
        // await saveQuoteRequestToDatabase(req.body);

        // Handle image uploads if any
        const images = req.files || [];
        console.log('Uploaded images:', images);

        // Respond with a success message
        res.status(201).json({ message: 'Quote request submitted successfully' });
    } catch (error) {
        console.error('Error processing quote request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
