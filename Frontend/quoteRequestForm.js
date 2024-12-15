document.getElementById('quoteRequestForm').addEventListener('submit', async function (event) {
    event.preventDefault();  // Prevent form from submitting normally

    const id = sessionStorage.getItem('id');  // Retrieve id from sessionStorage
    if (!id) {
        alert('Client ID is missing. Please log in first.');
        return;
    }

    const formData = new FormData();
    formData.append('id', id);  // Add id to formData
    formData.append('propertyAddress', document.getElementById('propertyAddress').value);
    formData.append('squareFeet', document.getElementById('squareFeet').value);
    formData.append('proposedPrice', document.getElementById('proposedPrice').value);
    formData.append('note', document.getElementById('note').value);

    // Handle image uploads
    const images = document.getElementById('images').files;
    if (images.length === 0) {
        alert('Please upload at least one image.');
        return;
    }

    for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
    }

    try {
        const response = await fetch('http://localhost:3000/api/quoteRequest', {
            method: 'POST',
            body: formData
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
