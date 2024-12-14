// Function to load David's dashboard
function openDavidDashboard() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <h2>David Smith's Dashboard</h2>
        <button onclick="loadIncomingQuotes()">Check Incoming Quotes</button>
        <button onclick="loadWorkOrders()">Check Work Orders</button>
        <button onclick="loadBills()">Check Bills</button>
        <button onclick="generateRevenueReport()">Generate Revenue Report</button>
        <div id="david-content" style="margin-top: 20px;"></div>
    `;
}


// Function to load Client dashboard
function openClientDashboard() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <h2>Client Dashboard</h2>
        <button onclick="loadClientQuotes()">View Quotes</button>
        <button onclick="loadClientOrders()">View Orders</button>
        <button onclick="loadClientBills()">View Bills</button>
        <div id="client-content" style="margin-top: 20px;"></div>
    `;
}

// Functions for David's Dashboard
async function loadIncomingQuotes() {
    try {
        const response = await fetch('/quotes');
        const quotes = await response.json();

        const contentDiv = document.getElementById('david-content');
        contentDiv.innerHTML = quotes
            .map(
                (q) => `
            <div>
                <p>Quote ID: ${q.id}</p>
                <p>Client ID: ${q.clientId}</p>
                <p>propertyAddress: ${q.propertyAddress}</p>
                <p>Square Feet: ${q.squareFeet}</p>
                <p>Status: ${q.status || 'Pending'}</p>
                <button onclick="respondToQuote(${q.id})">Respond</button>
            </div>
            <hr />
        `
            )
            .join('');
    } catch (error) {
        console.error(error);
    }
}

async function loadWorkOrders() {
    try {
        const response = await fetch('/orders');
        const orders = await response.json();

        const contentDiv = document.getElementById('david-content');
        contentDiv.innerHTML = orders
            .map(
                (o) => `
            <div>
                <p>Order ID: ${o.id}</p>
                <p>Client ID: ${o.clientId}</p>
                <p>Content: ${o.content}</p>
                <p>Status: ${o.status}</p>
            </div>
            <hr />
        `
            )
            .join('');
    } catch (error) {
        console.error(error);
    }
}

async function loadBills() {
    try {
        const response = await fetch('/bills');
        const bills = await response.json();

        const contentDiv = document.getElementById('david-content');
        contentDiv.innerHTML = bills
            .map(
                (b) => `
            <div>
                <p>Bill ID: ${b.id}</p>
                <p>Client ID: ${b.clientId}</p>
                <p>Amount: ${b.amount}</p>
                <p>Status: ${b.status}</p>
                <button onclick="respondToBill(${b.id})">Respond</button>
            </div>
            <hr />
        `
            )
            .join('');
    } catch (error) {
        console.error(error);
    }
}

async function generateRevenueReport() {
    const startDate = prompt('Enter start date (YYYY-MM-DD):');
    const endDate = prompt('Enter end date (YYYY-MM-DD):');

    try {
        const response = await fetch(`/reports/revenue?start=${startDate}&end=${endDate}`);
        const report = await response.json();

        const contentDiv = document.getElementById('david-content');
        contentDiv.innerHTML = `
            <h3>Revenue Report (${startDate} to ${endDate})</h3>
            <p>Total Revenue: $${report.totalRevenue}</p>
        `;
    } catch (error) {
        console.error(error);
    }
}

async function respondToQuote(quoteId) {
    const response = prompt(`Enter your response for Quote ID: ${quoteId}`);
    if (!response) return;

    try {
        await fetch(`/quotes/${quoteId}/respond`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ response }),
        });
        alert('Response submitted successfully.');
    } catch (error) {
        console.error(error);
    }
}

async function respondToBill(billId) {
    const response = prompt(`Enter your response for Bill ID: ${billId}`);
    if (!response) return;

    try {
        await fetch(`/bills/${billId}/respond`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ response }),
        });
        alert('Response submitted successfully.');
    } catch (error) {
        console.error(error);
    }
}

// Functions for Client Dashboard
async function loadClientQuotes() {
    try {
        const response = await fetch('/quotes');
        const quotes = await response.json();

        const contentDiv = document.getElementById('client-content');
        contentDiv.innerHTML = quotes
            .map(
                (q) => `
            <div>
                <p>Quote ID: ${q.id}</p>
                <p>propertyAddress: ${q.propertyAddress}</p>
                <p>Status: ${q.status}</p>
                <button onclick="respondToQuote(${q.id})">Respond</button>
            </div>
            <hr />
        `
            )
            .join('');
    } catch (error) {
        console.error(error);
    }
}

async function loadClientOrders() {
    try {
        const response = await fetch('/orders');
        const orders = await response.json();

        const contentDiv = document.getElementById('client-content');
        contentDiv.innerHTML = orders
            .map(
                (o) => `
            <div>
                <p>Order ID: ${o.id}</p>
                <p>Content: ${o.content}</p>
                <p>Status: ${o.status}</p>
            </div>
            <hr />
        `
            )
            .join('');
    } catch (error) {
        console.error(error);
    }
}

async function loadClientBills() {
    try {
        const response = await fetch('/bills');
        const bills = await response.json();

        const contentDiv = document.getElementById('client-content');
        contentDiv.innerHTML = bills
            .map(
                (b) => `
            <div>
                <p>Bill ID: ${b.id}</p>
                <p>Amount: ${b.amount}</p>
                <p>Status: ${b.status}</p>
                <button onclick="respondToBill(${b.id})">Respond</button>
            </div>
            <hr />
        `
            )
            .join('');
    } catch (error) {
        console.error(error);
    }
}
