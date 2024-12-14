async function loadClientQuotes() {
    try {
        const response = await fetch('/quotes');
        if (!response.ok) throw new Error('Failed to load quotes');
        const quotes = await response.json();

        const contentDiv = document.getElementById('client-content');
        contentDiv.innerHTML = quotes
            .map((q) => `<p>Client ID: ${q.clientId}, propertyAddress: ${q.propertyAddress}, ${q.squareFeet} sqft</p>`)
            .join('');
    } catch (error) {
        console.error(error);
        alert('Error loading quotes');
    }
}

async function submitQuote() {
    try {
        const clientId = prompt('Enter your client ID');
        const propertyAddress = prompt('Enter property propertyAddress');
        const squareFeet = prompt('Enter driveway size in square feet');

        const response = await fetch('/quotes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientId, propertyAddress, squareFeet }),
        });

        if (response.ok) {
            alert('Quote submitted!');
            loadClientQuotes(); // Reload quotes after submission
        } else {
            const { error } = await response.json();
            alert(`Error: ${error}`);
        }
    } catch (error) {
        console.error(error);
        alert('Failed to submit quote');
    }
}

// Dynamically load dashboards
function openClientDashboard() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <h2>Client Dashboard</h2>
        <button onclick="loadClientQuotes()">View Quotes</button>
        <button onclick="submitQuote()">Submit a Quote</button>
    `;
}

function openDavidDashboard() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = '<h2>David\'s Dashboard</h2><p>Feature coming soon...</p>';
}

