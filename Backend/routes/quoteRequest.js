const express = require('express');
const router = express.Router();

router.use('/api/quoteRequest', require('./api/quoteRequest')); // Adjust this path if needed

module.exports = router;
