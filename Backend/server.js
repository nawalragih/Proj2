const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const db = require('./db/db'); // Assuming a database connection file exists

const app = express();

// Import route handlers
const clientsRoutes = require('./routes/clientLogin'); // General client routes
const quotesRoutes = require('./routes/quotes');
const ordersRoutes = require('./routes/orders');
const billsRoutes = require('./routes/bills');
const reportsRoutes = require('./routes/reports');
const quoteRequestRoutes = require('./routes/quoteRequest');
const quoteReviewRoutes = require('./routes/quoteReview');
const quoteNegotiationRoutes = require('./routes/clientNegotiation');
const clientRegistrationRoutes = require('./routes/clientRegistration');

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
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
app.use('/clients', clientsRoutes); // Handle client login and registration
app.use('/quotes', quotesRoutes); // Handle quote-related actions
app.use('/orders', ordersRoutes); // Handle order-related actions
app.use('/bills', billsRoutes); // Handle billing actions
app.use('/reports', reportsRoutes); // Handle report generation
app.use('/api/quoteRequest', quoteRequestRoutes); // Quote request for clients
app.use('/api/quoteReview', quoteReviewRoutes); // Quote review for David
app.use('/api/quoteNegotiation', quoteNegotiationRoutes); // Quote negotiation

// Middleware to check if the client is logged in
const isLoggedIn = (req, res, next) => {
    if (!req.session || !req.session.clientId) {
        return res.status(401).json({ success: false, message: 'Unauthorized. Please log in.' });
    }
    next();
};

// Route for quote submission (uses the `isLoggedIn` middleware)
app.post('/quotes', isLoggedIn, (req, res) => {
    const { propertyAddress, squareFeet } = req.body;
    const clientId = req.session.clientId;

    const query = 'INSERT INTO quotes (clientId, propertyAddress, squareFeet) VALUES (?, ?, ?)';
    db.query(query, [clientId, propertyAddress, squareFeet], (err, result) => {
        if (err) {
            console.error('Error submitting quote:', err);
            return res.status(500).json({ success: false, message: 'Error submitting quote' });
        }
        res.json({ success: true, message: 'Quote submitted successfully' });
    });
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

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
