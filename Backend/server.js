const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Import route handlers
const clientsRoutes = require('./routes/clients');
const quotesRoutes = require('./routes/quotes');
const ordersRoutes = require('./routes/orders'); // Import orders routes
const billsRoutes = require('./routes/bills');   // Import bills routes
const path = require('path'); // Import path to resolve file paths


// Middleware
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'frontend')));

// Define routes
app.use('/clients', clientsRoutes);
app.use('/quotes', quotesRoutes);
app.use('/orders', ordersRoutes);
app.use('/bills', billsRoutes);

// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
