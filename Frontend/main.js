function openClientDashboard() {
    document.getElementById("content").innerHTML = `
        <h2>Client Dashboard</h2>
        <button onclick="loadClientQuotes()">View Quotes</button>
        <button onclick="submitQuote()">Submit a Quote</button>
        <div id="client-content"></div>
        window.location.href = "/clients-dashboard";

    `;
}

function openDavidDashboard() {
    document.getElementById("content").innerHTML = `
        <h2>David's Dashboard</h2>
        <button onclick="viewOrders()">View Orders</button>
        <button onclick="viewBills()">View Bills</button>
        <div id="david-content"></div>
        window.location.href = "/david-dashboard";

    `;
}
