const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Big Clients
router.get('/big-clients', async (req, res) => {
    const query = `
        SELECT c.id, c.firstName, c.lastName, COUNT(o.id) AS orderCount
        FROM Clients c
        JOIN Orders o ON c.id = o.clientId
        GROUP BY c.id
        HAVING orderCount = (
            SELECT MAX(orderCount)
            FROM (
                SELECT clientId, COUNT(id) AS orderCount FROM Orders GROUP BY clientId
            ) subquery
        );
    `;
    const [rows] = await db.execute(query);
    res.json(rows);
});

// Difficult Clients
router.get('/difficult-clients', async (req, res) => {
    const query = `
        SELECT c.id, c.firstName, c.lastName
        FROM Clients c
        JOIN Quotes q ON c.id = q.clientId
        WHERE q.status = 'NEGOTIATING'
        GROUP BY c.id
        HAVING COUNT(DISTINCT q.id) = 3
        AND NOT EXISTS (
            SELECT 1 FROM Orders o WHERE o.clientId = c.id
        );
    `;
    const [rows] = await db.execute(query);
    res.json(rows);
});

// This Month Quotes
router.get('/this-month-quotes', async (req, res) => {
    const query = `
        SELECT q.*
        FROM Quotes q
        WHERE q.status = 'ACCEPTED'
        AND MONTH(q.createdAt) = MONTH(CURRENT_DATE())
        AND YEAR(q.createdAt) = YEAR(CURRENT_DATE());
    `;
    const [rows] = await db.execute(query);
    res.json(rows);
});

// Prospective Clients
router.get('/prospective-clients', async (req, res) => {
    const query = `
        SELECT c.id, c.firstName, c.lastName
        FROM Clients c
        LEFT JOIN Quotes q ON c.id = q.clientId
        WHERE q.id IS NULL;
    `;
    const [rows] = await db.execute(query);
    res.json(rows);
});

// Largest Driveway
router.get('/largest-driveway', async (req, res) => {
    const query = `
        SELECT q.propertyAddress, q.squareFeet
        FROM Quotes q
        WHERE q.squareFeet = (
            SELECT MAX(squareFeet) FROM Quotes
        );
    `;
    const [rows] = await db.execute(query);
    res.json(rows);
});

// Overdue Bills
router.get('/overdue-bills', async (req, res) => {
    const query = `
        SELECT b.*
        FROM Bills b
        WHERE b.status = 'UNPAID'
        AND DATEDIFF(CURRENT_DATE(), b.generatedAt) > 7;
    `;
    const [rows] = await db.execute(query);
    res.json(rows);
});

// Bad Clients
router.get('/bad-clients', async (req, res) => {
    const query = `
        SELECT DISTINCT c.id, c.firstName, c.lastName
        FROM Clients c
        JOIN Bills b ON c.id = b.clientId
        WHERE b.status = 'UNPAID'
        AND DATEDIFF(CURRENT_DATE(), b.generatedAt) > 7;
    `;
    const [rows] = await db.execute(query);
    res.json(rows);
});

// Good Clients
router.get('/good-clients', async (req, res) => {
    const query = `
        SELECT DISTINCT c.id, c.firstName, c.lastName
        FROM Clients c
        JOIN Bills b ON c.id = b.clientId
        WHERE b.status = 'PAID'
        AND TIMESTAMPDIFF(HOUR, b.generatedAt, CURRENT_TIMESTAMP) <= 24;
    `;
    const [rows] = await db.execute(query);
    res.json(rows);
});

module.exports = router;
