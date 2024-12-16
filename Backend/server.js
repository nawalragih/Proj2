const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const app = express();

// Import route handlers
const clientRoutes = require('./routes/clients');
const quotesRoutes = require('./routes/quotes');
const ordersRoutes = require('./routes/orders');
const billsRoutes = require('./routes/bills');
const reportsRoutes = require('./routes/reports');
const quoteRequestRouter = require('./api/quoteRequest'); 
const quoteReviewRoutes = require('./routes/quoteReview');
const quoteNegotiationRoutes = require('./routes/clientNegotiation');

// Import database methods and pool
const { pool, createQuote, getClientById, getClientByEmail } = require('./db/db');

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',  // Frontend URL
    credentials: true,               // Allow cookies to be sent and received
}));

app.use(express.json()); // Parse incoming JSON payloads
app.use(express.static(path.join(__dirname, '../public'))); // Serve static files

// Configure session middleware
app.use(
    session({
        secret: 'proj2', // Replace with a strong secret key in production
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } // Use `true` in production with HTTPS
    })
);

// Middleware to log session data for debugging
app.use((req, res, next) => {
    console.log('Session:', req.session);
    next();
});

// Define routes
app.use('/clients', clientRoutes);
app.use('/quotes', quotesRoutes);
app.use('/orders', ordersRoutes);
app.use('/bills', billsRoutes);
app.use('/reports', reportsRoutes);
app.use('/api/quoteRequest', quoteRequestRouter);
app.use('/api/quoteReview', quoteReviewRoutes);
app.use('/api/quoteNegotiation', quoteNegotiationRoutes);

// Middleware to check if the client is logged in
const isLoggedIn = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: 'Please log in' });
    }
    next();
};

// Route for quote submission (uses the `isLoggedIn` middleware)
app.post('/quotes', isLoggedIn, async (req, res) => {
    const { propertyAddress, squareFeet } = req.body;
    const id = req.session.user.id;

    const query = 'INSERT INTO quotes (id, propertyAddress, squareFeet) VALUES (?, ?, ?)';
    try {
        const [result] = await pool.execute(query, [id, propertyAddress, squareFeet]);
        res.json({ success: true, message: 'Quote submitted successfully', quoteId: result.insertId });
    } catch (err) {
        console.error('Error submitting quote:', err);
        return res.status(500).json({ success: false, message: 'Error submitting quote' });
    }
});

// Route to handle login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    pool.execute('SELECT * FROM clients WHERE email = ?', [email])
        .then(([results]) => {
            const userFound = results[0];

            if (userFound && password === userFound.password) { // Direct password comparison without hashing
                // Store user in session
                req.session.user = {
                    id: userFound.id,                    
                    email: userFound.email,
                    firstName: userFound.firstName,
                    lastName: userFound.lastName,
                    propertyAddress: userFound.propertyAddress,
                    creditCardInfo: userFound.creditCardInfo,
                    phoneNumber: userFound.phoneNumber
                };

                // Send the id along with other user info to the frontend
                res.status(200).json({
                    message: 'Login successful',
                    user: {
                        id: userFound.id,                         email: userFound.email,
                        firstName: userFound.firstName,
                        lastName: userFound.lastName,
                        propertyAddress: userFound.propertyAddress,
                        creditCardInfo: userFound.creditCardInfo,
                        phoneNumber: userFound.phoneNumber
                    }
                });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        })
        .catch(err => {
            console.error('Database error:', err);
            res.status(500).json({ message: 'Database error' });
        });
});

// In server.js
// Route to handle the quote request
app.post('/quoteRequest', async (req, res) => {
    const { userId, propertyAddress, squareFeet, proposedPrice, note } = req.body;

    // Ensure we have all the required fields
    if (!userId || !propertyAddress || !squareFeet || !proposedPrice) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get the current date and time for the `createdAt` field
    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

    try {
        const query = `INSERT INTO quotes (clientId, propertyAddress, squareFeet, proposedPrice, status, createdAt, note)
                       VALUES (?, ?, ?, ?, 'Pending', ?, ?)`;
        const [result] = await pool.execute(query, [userId, propertyAddress, squareFeet, proposedPrice, createdAt, note]);

        // Send a success response with the quote ID
        res.json({
            message: 'Quote request submitted successfully!',
            quoteId: result.insertId,
        });
    } catch (err) {
        console.error('Error inserting quote:', err);
        return res.status(500).json({ message: 'Error submitting quote request' });
    }
});




// Example route: Get user details by email
app.post('/get-user-by-email', (req, res) => {
    const { email } = req.body;
    getClientByEmail(email)
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(500).json({ error: 'An error occurred while fetching user.' });
        });
});

// Route to handle registration
app.post('/register', async (req, res) => {
    const { email, password, firstName, lastName, propertyAddress, creditCardInfo, phoneNumber } = req.body;

    // Get current date and time for registrationDate
    const registrationDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    try {
        // Check if the email already exists in the 'clients' table
        const [results] = await pool.execute('SELECT * FROM clients WHERE email = ?', [email]);

        if (results.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Insert the new client into the 'clients' table
        const query = 'INSERT INTO clients (email, password, firstName, lastName, propertyAddress, creditCardInfo, phoneNumber, registrationDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const [result] = await pool.execute(query, [email, password, firstName, lastName, propertyAddress, creditCardInfo, phoneNumber, registrationDate]);

        // Store user in session after successful registration
        req.session.user = {
            id: result.insertId,
            email,
            firstName,
            lastName,
            propertyAddress,
            creditCardInfo,
            phoneNumber,
            registrationDate
        };

        res.status(201).json({ message: 'Registration successful', user: req.session.user });
    } catch (err) {
        return res.status(500).json({ message: 'Error registering user', error: err.message });
    }
});

// Route to check if user is logged in and access dashboard
app.get('/dashboard', (req, res) => {
    if (req.session && req.session.user) {
        res.json({ success: true, user: req.session.user });
    } else {
        res.status(401).json({ message: 'Please log in' });
    }
});
// Simulate session check
app.get('/session', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).json({ user: null });
    }
});

// Serve static HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/home.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
});

app.get('/quoteRequest', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/quoteRequest.html'));
});

// Logout API endpoint
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
