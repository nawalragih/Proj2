// Accept a quote
async function acceptQuote(quoteId) {
    if (!confirm('Are you sure you want to accept this quote?')) return;

    try {
        console.log(`Sending request to accept quote ID: ${quoteId}`);
        const response = await fetch(`/quotes/${quoteId}/accept`, { method: 'PUT' });
        if (response.ok) {
            alert('Quote accepted successfully!');
            loadIncomingQuotes(); // Reload quotes
        } else {
            alert('Failed to accept quote');
        }
    } catch (error) {
        console.error('Error accepting quote:', error);
        alert('Error accepting quote');
    }
}

// Reject a quote
async function rejectQuote(quoteId) {
    if (!confirm('Are you sure you want to reject this quote?')) return;

    try {
        console.log(`Sending request to reject quote ID: ${quoteId}`);
        const response = await fetch(`/quotes/${quoteId}/reject`, { method: 'PUT' });
        if (response.ok) {
            alert('Quote rejected successfully!');
            loadIncomingQuotes(); // Reload quotes
        } else {
            alert('Failed to reject quote');
        }
    } catch (error) {
        console.error('Error rejecting quote:', error);
        alert('Error rejecting quote');
    }
}

// Negotiate a quote
async function negotiateQuote(quoteId) {
    const newProposedPrice = prompt('Enter your proposed price:');
    if (!newProposedPrice) return;

    try {
        console.log(`Sending negotiation request for quote ID: ${quoteId} with proposed price: ${newProposedPrice}`);
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
        console.error('Error negotiating quote:', error);
        alert('Error negotiating quote');
    }
}
