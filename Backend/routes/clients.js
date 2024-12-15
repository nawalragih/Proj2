const express = require('express');
const session = require('express-session');
const router = express.Router();
const mysql = require('mysql2');

// Create a connection pool with promise-based queries
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',  // Use your actual password
    database: 'driveway_management',
});

// Use promise-based queries from the pool
const pool = db.promise(); // This allows you to use query as a promise

// Session middleware
router.use(
    session({
        secret: 'proj2',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } // Set to true in production with HTTPS
    })
);

// POST route for client registration
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, phoneNumber, propertyAddress, creditCardInfo, password } = req.body;

    // Input validation
    if (!firstName || !lastName || !email || !phoneNumber || !propertyAddress || !creditCardInfo || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Check if the client already exists using promise-based query
        const [existingClient] = await pool.execute('SELECT * FROM Clients WHERE email = ?', [email]);

        // If the client already exists, return an error
        if (existingClient.length > 0) {
            return res.status(400).json({ error: 'Client with this email already exists' });
        }

        // Insert the new client into the database using promise-based query
        await pool.execute(
            'INSERT INTO Clients (firstName, lastName, email, phoneNumber, propertyAddress, creditCardInfo, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [firstName, lastName, email, phoneNumber, propertyAddress, creditCardInfo, password]
        );

        // Return success message
        res.status(201).json({ message: 'Client registered successfully' });
    } catch (error) {
        console.error('Error registering client:', error);
        res.status(500).json({ error: 'Failed to register client' });
    }
});

// POST route for client login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    // SQL query to check if the client exists
    const query = 'SELECT * FROM clients WHERE email = ? AND password = ?';
  
    db.query(query, [email, password], function(err, results) {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }
  
      if (results.length > 0) {
        // Successfully found the client, log them in
        req.session.user = results[0]; // Storing client data in session
        return res.status(200).json({ message: 'Login successful' });
      } else {
        // Invalid email or password
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    });
});

router.get('/session', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.json({ user: null });
    }
});

// Route for logging out and destroying the session
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to log out' });
        }
        res.redirect('/login');
    });
});

module.exports = router;
