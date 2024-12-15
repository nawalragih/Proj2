const express = require('express');
const session = require('express-session');
const router = express.Router();
const db = require('../db/db'); // Assuming you're using a database connection file

// Initialize session middleware (ensure this is in your main app file as well)
router.use(
    session({
        secret: 'your_secret_key',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } // Use secure: true in production with HTTPS
    })
);

// POST route for client registration
router.post('/register', async (req, res) => {
    const { firstName, lastName, propertyAddress, creditCardInfo, phoneNumber, email, password } = req.body;

    // Validate input
    if (!firstName || !lastName || !propertyAddress || !creditCardInfo || !phoneNumber || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Insert client details into the database (clientId will be auto-generated if the table is set up correctly)
        const query = `
            INSERT INTO Clients (firstName, lastName, propertyAddress, creditCardInfo, phoneNumber, email, password)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(query, [
            firstName,
            lastName,
            propertyAddress,
            creditCardInfo,
            phoneNumber,
            email,
            password
        ]);

        // Save the newly created clientId in the session
        req.session.clientId = result.insertId;

        res.status(201).json({ message: 'Client registered successfully', clientId: result.insertId });
    } catch (error) {
        console.error('Error registering client:', error);

        // Handle specific errors, e.g., if email is already taken
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Email is already registered' });
        }

        // General error handler
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// POST route for client login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Query the database for the user with the given email
        const query = `SELECT * FROM Clients WHERE email = ?`;

        const [results] = await db.query(query, [email]);

        // Check if user exists
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const client = results[0];

        // Verify password (ensure you're hashing passwords in a real-world app!)
        if (client.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Store the clientId in the session
        req.session.clientId = client.id;

        res.status(200).json({ success: true, message: 'Login successful', clientId: client.id });
    } catch (error) {
        console.error('Error logging in client:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Middleware to check if the user is logged in
router.use((req, res, next) => {
    if (!req.session.clientId) {
        return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }
    next();
});

module.exports = router;
