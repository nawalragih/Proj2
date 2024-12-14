async function viewOrders() {
    const response = await fetch('/orders');
    const orders = await response.json();
    const contentDiv = document.getElementById("david-content");
    contentDiv.innerHTML = orders.map(order => `
        <p>Order #${order.id}: Client ID ${order.clientId}, Service Date ${order.serviceDate}</p>
        <button onclick="updateOrder(${order.id})">Update</button>
        <button onclick="deleteOrder(${order.id})">Delete</button>
    `).join("");
}

async function viewBills() {
    const response = await fetch('/bills');
    const bills = await response.json();
    const contentDiv = document.getElementById("david-content");
    contentDiv.innerHTML = bills.map(bill => `
        <p>Bill #${bill.id}: Amount $${bill.amount}, Status: ${bill.status}</p>
        <button onclick="markAsPaid(${bill.id})">Mark as Paid</button>
        <button onclick="deleteBill(${bill.id})">Delete</button>
    `).join("");
}

// Load and display incoming quotes for David
async function loadIncomingQuotes() {
    const contentDiv = document.getElementById('david-content');
    contentDiv.innerHTML = '<p>Loading incoming quotes...</p>';

    try {
        const response = await fetch('/quotes');
        if (!response.ok) throw new Error('Failed to load quotes');

        const quotes = await response.json();
        contentDiv.innerHTML = quotes
            .map(q => `
                <div>
                    <p><strong>Quote ID:</strong> ${q.id}</p>
                    <p><strong>Client ID:</strong> ${q.clientId}</p>
                    <p><strong>Property Address:</strong> ${q.propertyAddress}</p>
                    <p><strong>Square Feet:</strong> ${q.squareFeet}</p>
                    <p><strong>Proposed Price:</strong> $${q.proposedPrice}</p>
                    <p><strong>Note:</strong> ${q.note || 'N/A'}</p>
                    <p><strong>Status:</strong> ${q.status || 'Pending'}</p>
                    <button onclick="acceptQuote(${q.id})">Accept</button>
                    <button onclick="rejectQuote(${q.id})">Reject</button>
                    <button onclick="negotiateQuote(${q.id})">Negotiate</button>
                </div>
                <hr>
            `)
            .join('');
    } catch (error) {
        contentDiv.innerHTML = '<p>Error loading quotes.</p>';
        console.error(error);
    }
}

// Accept a quote
async function acceptQuote(quoteId) {
    if (!confirm('Are you sure you want to accept this quote?')) return;

    try {
        const response = await fetch(`/quotes/${quoteId}/accept`, { method: 'PUT' });
        if (response.ok) {
            alert('Quote accepted successfully!');
            loadIncomingQuotes(); // Reload quotes
        } else {
            alert('Failed to accept quote');
        }
    } catch (error) {
        console.error(error);
        alert('Error accepting quote');
    }
}

// Reject a quote
async function rejectQuote(quoteId) {
    if (!confirm('Are you sure you want to reject this quote?')) return;

    try {
        const response = await fetch(`/quotes/${quoteId}/reject`, { method: 'PUT' });
        if (response.ok) {
            alert('Quote rejected successfully!');
            loadIncomingQuotes(); // Reload quotes
        } else {
            alert('Failed to reject quote');
        }
    } catch (error) {
        console.error(error);
        alert('Error rejecting quote');
    }
}

// Negotiate a quote
async function negotiateQuote(quoteId) {
    const newProposedPrice = prompt('Enter your proposed price:');
    if (!newProposedPrice) return;

    try {
        const response = await fetch(`/quotes/${quoteId}/negotiate`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ proposedPrice: newProposedPrice }),
        });

        if (response.ok) {
            alert('Negotiation sent to client!');
            loadIncomingQuotes(); // Reload quotes
        } else {
            alert('Failed to negotiate quote');
        }
    } catch (error) {
        console.error(error);
        alert('Error negotiating quote');
    }
}
