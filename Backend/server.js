const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Import route handlers
const clientsRoutes = require('./routes/clients');
const quotesRoutes = require('./routes/quotes');
const ordersRoutes = require('./routes/orders');
const billsRoutes = require('./routes/bills');
const reportsRoutes = require ('./routes/reports');

// Middleware
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// Define routes
app.use('/clients', clientsRoutes);
app.use('/quotes', quotesRoutes);
app.use('/orders', ordersRoutes);
app.use('/bills', billsRoutes);
app.use('/reports', reportsRoutes);

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
