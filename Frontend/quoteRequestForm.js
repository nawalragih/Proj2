document.getElementById('quoteRequestForm').addEventListener('submit', async function (event) {
    event.preventDefault();  // Prevent form from submitting normally

    const userId = sessionStorage.getItem('id');  // Retrieve id from sessionStorage
    if (!userId) {
        alert('Client ID is missing. Please log in first.');
        return;
    }

    const quoteData = {
        userId: userId,
        propertyAddress: document.getElementById('propertyAddress').value,
        squareFeet: document.getElementById('squareFeet').value,
        proposedPrice: document.getElementById('proposedPrice').value,
        note: document.getElementById('note').value
    };

    try {
        const response = await fetch('http://localhost:3000/api/quoteRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(quoteData),  // Send data as JSON
            credentials: 'include'
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response from server:', errorText);
            alert('Error submitting quote request. Please check the form and try again.');
            return;
        }

        const responseData = await response.json();
        alert('Quote request submitted successfully!');
        window.location.href = 'clientDashboard.html';  // Redirect to the client dashboard
    } catch (error) {
        console.error('Network error:', error);
        alert('Failed to submit the request. Please try again later.');
    }
});
