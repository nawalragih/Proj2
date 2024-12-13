const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Adjust path based on your project structure

// POST route for submitting a quote request
router.post('/submit-quote', async (req, res) => {
    // Get the clientId from the session
    const clientId = getClientIdFromSession(req);

    if (!clientId) {
        return res.status(401).json({ error: 'Client not logged in' });
    }

    const { address, squareFootage, proposedPrice, pictures, note } = req.body;

    // Validate input
    if (!address || !squareFootage || !proposedPrice || !pictures) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const query = `
            INSERT INTO QuoteRequests (clientId, address, squareFootage, proposedPrice, pictures, note)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const result = await db.query(query, [clientId, address, squareFootage, proposedPrice, pictures, note]);

        res.status(201).json({ message: 'Quote request submitted successfully', quoteId: result.insertId });
    } catch (error) {
        console.error('Error submitting quote request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

// Frontend logic for submitting the quote request form
document.getElementById('quoteRequestForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Collect the quote request data from the form
    const quoteRequestData = {
        address: document.getElementById('address').value,
        squareFootage: document.getElementById('squareFootage').value,
        proposedPrice: document.getElementById('proposedPrice').value,
        pictures: document.getElementById('pictures').value, // Adjust as needed for file input
        note: document.getElementById('note').value
    };

    // Get the auth token from localStorage
    const authToken = localStorage.getItem('authToken');

    // Fetch request to submit the quote
    fetch('http://localhost:3000/clients/submit-quote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(quoteRequestData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert('Quote request submitted successfully');
        }
    })
    .catch(error => {
        console.error('Error submitting quote request:', error);
    });
});
