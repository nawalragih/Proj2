const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/', async (req, res) => {
    const [rows] = await db.query("SELECT * FROM clients");
    res.json(rows);
});

module.exports = router;
