const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/', async (req, res) => {
    const [rows] = await db.query("SELECT * FROM quotes");
    res.json(rows);
});

router.post('/', async (req, res) => {
    const { address, squareFeet } = req.body;
    await db.query("INSERT INTO quotes (address, squareFeet) VALUES (?, ?)", [address, squareFeet]);
    res.sendStatus(201);
});

module.exports = router;
