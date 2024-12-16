# Driveway Management System Project

## Description
This project is a Node.js-based driveway management system that handles client requests for quotes, allows workers (referred to as "David") to accept, reject, or negotiate the proposed prices, and generates bills for accepted orders. The system uses MySQL for data storage and manages sessions with user authentication.

## Prerequisites
Before running the project, make sure you have:
- Node.js installed on your system.
- MySQL database running.
- Access to the MySQL server with necessary privileges.

## Running the Project
To run the project:
1. Navigate to the `backend` directory.
2. Execute the following command:

   ```bash
   node server.js


3. Ensure your MYSQL database is running and properly configured.

## Database Configuration
The project uses db.js for database configuration. Make sure to update the db.js file with your database connection details:

     // db.js
    const mysql = require('mysql2');
    
    const db = mysql.createConnection({
      host: 'localhost', // Update with your database host
      user: 'root', // Update with your database user
      password: '', // Update with your database password
      database: 'driveway_management' // Update with your database name
    });
    
    module.exports = db;

## Session Management   
Sessions are managed using express-session. User data is stored in the session once authenticated:

      const session = require('express-session');
      
      app.use(session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true,
        cookie: {
          httpOnly: true,
          secure: false,
          path: '/',
        }
      }));

## Features

Client Dashboard:
- Quote Request Form: Clients can request quotes by filling out a form with property details.
- Bills: Clients can view their bills for accepted orders.
- Orders: Clients can view their pending and accepted orders.
- Quotes: Clients can view the status of their quotes.
- Quote Request: can request quotes with property details.

David's Dashboard:
- Incoming Quotes: Displays new quotes requested by clients.
- Bills: Lists all bills generated for accepted orders.
- Orders: Shows all orders that have been accepted or rejected.
- Revenue Report: Provides an overview of the revenue generated from completed orders.

Worker Actions for David:
- Accept: David can accept a quote and initiate the negotiation process.
- Reject: David can reject a quote if the proposed terms are not acceptable.
- Negotiate Proposed Price: Both the worker and the client can send notes with a proposed price in a loop until an agreement is reached.

Order Acceptance: Once accepted, both the client and the worker receive a bill for the order.

## Notes for Development
- Ensure proper session handling to keep track of authenticated users.
- Implement mechanisms for negotiation with price updates and notes until an agreement is reached.
- Generate bills once an order is accepted.

## Issues
- Ensure proper handling of the .then(), .catch(), or await on the result of queries to prevent programming errors.
- Ensure that all necessary fields are properly linked between the clients, bills, orders, and quotes tables.

## Hours worked on project:
- Week 1: 15 hours
- Week 2: 28 hours
- Week 3: 33 hours
- Week 4: 35 hours 

## Project Members:
- Nawal Ragih hi0091
- Duaa Saeed he6041




