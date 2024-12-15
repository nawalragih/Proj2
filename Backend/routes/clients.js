const express = require('express');
const session = require('express-session');
const router = express.Router();
const mysql = require('mysql2');


const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',  // Use your actual password
    database: 'driveway_management',
});


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
    const { firstName, lastName, propertyAddress, creditCardInfo, phoneNumber, email, password } = req.body;
    
    try {
        // Check if the email is already taken
        const [existingClient] = await db.execute('SELECT * FROM Clients WHERE email = ?', [email]);
        if (existingClient.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Insert new client into the database
        const query = `
            INSERT INTO Clients (firstName, lastName, propertyAddress, creditCardInfo, phoneNumber, email, password)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [firstName, lastName, propertyAddress, creditCardInfo, phoneNumber, email, password]);

        res.status(201).json({ message: 'Client registered successfully' });
    } catch (err) {
        console.error('Error registering client:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// POST route for client registration
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


console.log(db);

module.exports = router;
