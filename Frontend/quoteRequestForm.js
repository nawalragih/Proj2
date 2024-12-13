// Frontend logic for submitting the quote request form
document.getElementById('quoteRequestForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const images = [];
    const files = formData.getAll('images');
    
    for (const file of files) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            images.push(reader.result);
        };
    }

    // Wait for all images to load before proceeding
    await new Promise(resolve => {
        const interval = setInterval(() => {
            if (images.length === files.length) {
                clearInterval(interval);
                resolve();
            }
        }, 100);
    });

    const data = {
        clientId: getClientIdFromSession(),  // Automatically retrieved from session or auth token
        address: formData.get('address'),
        squareFeet: formData.get('squareFeet'),
        proposedPrice: formData.get('proposedPrice'),
        note: formData.get('note'),
        images: images,
    };

    // Log the request payload to check if all values are correct
    console.log('Sending quote request with data:', data);

    const response = await fetch('/api/quoteRequest/quote-request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (response.ok) {
        alert('Quote request submitted successfully');
    } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
    }
});
