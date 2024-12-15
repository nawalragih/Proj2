const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session'); // Add session management middleware

const app = express();

// Import route handlers
const clientsRoutes = require('./routes/clients'); // General client routes
const quotesRoutes = require('./routes/quotes');
const ordersRoutes = require('./routes/orders');
const billsRoutes = require('./routes/bills');
const reportsRoutes = require('./routes/reports');
const quoteRequest = require('./routes/quoteRequest'); // New route for quote requests
const quoteReviewRoutes = require('./routes/quoteReview'); // New route for David's review
const quoteNegotiationRoutes = require('./routes/clientNegotiation'); // New route for quote negotiation
const clientRegistrationRoutes = require('./routes/clientRegistration'); // Ensure this file exists
const clientLoginRoutes = require('./routes/clientLogin'); // Add client login route

// Middleware
app.use(cors()); // Ensure CORS is applied before routes
app.use(express.json()); // Parse JSON payloads
app.use((req, res, next) => {
    console.log('Session:', req.session); // Log session data
    next();
});
app.use(express.static(path.join(__dirname, '../public')));

// Configure session middleware
app.use(
    session({
        secret: 'proj2', // Replace with a secure key
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } // Use secure: true in production with HTTPS
    })
);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// Define routes
app.use('/clients', clientsRoutes); // Handle general client routes
app.use('/quotes', quotesRoutes); // Handle quotes
app.use('/orders', ordersRoutes); // Handle orders
app.use('/bills', billsRoutes); // Handle bills
app.use('/reports', reportsRoutes); // Handle reports

// Handle API routes
app.use('/api/clients/register', clientRegistrationRoutes); // Client registration route
app.use('/api/clients/login', clientLoginRoutes); // Client login route
app.use('/api/quoteRequest', quoteRequest); // Quote request route
app.use('/api/quoteReview', quoteReviewRoutes); // Quote review route for David
app.use('/api/quoteNegotiation', quoteNegotiationRoutes); // Quote negotiation route

// Middleware to check if the client is logged in
const isLoggedIn = (req, res, next) => {
    if (!req.session || !req.session.clientId) {
        return res.status(401).json({ success: false, message: 'Unauthorized. Please log in.' });
    }
    next();
};

// Route for quote submission
app.post('/quotes', isLoggedIn, (req, res) => {
    const { propertyAddress, squareFeet } = req.body;
    const clientId = req.session.clientId;

    const query = 'INSERT INTO quotes (clientId, propertyAddress, squareFeet) VALUES (?, ?, ?)';
    db.query(query, [clientId, propertyAddress, squareFeet], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Error submitting quote' });
        }
        res.json({ success: true, message: 'Quote submitted successfully' });
    });
});

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/home.html'));
});

// Route to serve the registration page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
});

// Route to serve the quote request page for clients
app.get('/quoteRequest', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/quoteRequest.html'));
});

// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
