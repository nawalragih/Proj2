const express = require('express');
const session = require('express-session');
const cors = require('cors');
const app = express();

// Ensure session middleware is configured before routes
app.use(
    session({
        secret: 'your_secret_key', // Use a secure secret key
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } // Set to true if using HTTPS in production
    })
);

app.use(cors()); // Ensure CORS is applied before routes
app.use(express.json()); // Parse JSON payloads

// Middleware to ensure the client is logged in
function isLoggedIn(req, res, next) {
    if (!req.session.clientId) {
        return res.status(401).json({ error: 'Please log in' });
    }
    next();
}

// POST route to create a quote
router.post('/create', isLoggedIn, async (req, res) => {
    const { propertyAddress, squareFeet, proposedPrice, status, images, note } = req.body;
    const clientId = req.session.clientId;

    try {
        // Make sure the client exists
        const client = await db.getClientById(clientId);
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        // Create a new quote
        const quoteId = await db.createQuote(clientId, propertyAddress, squareFeet, proposedPrice, status, images, note);

        res.status(201).json({
            success: true,
            message: 'Quote created successfully',
            quoteId: quoteId
        });
    } catch (err) {
        console.error('Error creating quote:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;