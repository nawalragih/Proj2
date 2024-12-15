// Load quotes for the client dashboard
async function loadClientQuotes() {
    try {
        const response = await fetch('/quotes');
        if (!response.ok) throw new Error('Failed to load quotes');
        const quotes = await response.json();

        const contentDiv = document.getElementById('client-content');
        contentDiv.innerHTML = quotes
            .map((q) => `<p>Client ID: ${q.id}, propertyAddress: ${q.propertyAddress}, ${q.squareFeet} sqft</p>`)
            .join('');
    } catch (error) {
        console.error(error);
        alert('Error loading quotes');
    }
}

// Submit a quote for a client
async function submitQuote() {
    try {
        const id = prompt('Enter your client ID');
        const propertyAddress = prompt('Enter property address');
        const squareFeet = prompt('Enter driveway size in square feet');

        const response = await fetch('/quotes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, propertyAddress, squareFeet }),
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

// Dynamically load client dashboard
function openClientDashboard() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <h2>Client Dashboard</h2>
        <button onclick="loadClientQuotes()">View Quotes</button>
        <button onclick="submitQuote()">Submit a Quote</button>
    `;
}

// Dynamically load David's dashboard
function openDavidDashboard() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = '<h2>David\'s Dashboard</h2><p>Feature coming soon...</p>';
}
