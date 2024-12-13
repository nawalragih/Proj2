const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// Import route handlers
const clientsRoutes = require('./routes/clients');  // General client routes
const quotesRoutes = require('./routes/quotes');
const ordersRoutes = require('./routes/orders');
const billsRoutes = require('./routes/bills');
const reportsRoutes = require('./routes/reports');
const quoteRequestRoutes = require('./routes/quoteRequest');  // New route for quote requests
const quoteReviewRoutes = require('./routes/quoteReview');  // New route for David's review
const quoteNegotiationRoutes = require('./routes/quoteNegotiation');  // New route for quote negotiation
const clientRegistrationRoutes = require('./routes/clientRegistration');  // Ensure this file exists

// Middleware
app.use(cors()); // Ensure CORS is applied before routes
app.use(express.json()); // Parse JSON payloads

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// Define routes
app.use('/clients', clientsRoutes);  // Handle general client routes
app.use('/quotes', quotesRoutes);  // Handle quotes
app.use('/orders', ordersRoutes);  // Handle orders
app.use('/bills', billsRoutes);  // Handle bills
app.use('/reports', reportsRoutes);  // Handle reports

// Handle API routes
app.use('/api/clients/register', clientRegistrationRoutes);  // Client registration route
app.use('/api/quoteRequest', quoteRequestRoutes);  // Quote request route
app.use('/api/quoteReview', quoteReviewRoutes);  // Quote review route for David
app.use('/api/quoteNegotiation', quoteNegotiationRoutes);  // Quote negotiation route

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
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
