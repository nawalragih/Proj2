document.getElementById('registrationForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form from refreshing the page

    // Get values from the form
    const clientData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        address: document.getElementById('address').value,
        creditCardInfo: document.getElementById('creditCard').value, // Secure this in production
        phoneNumber: document.getElementById('phoneNumber').value,
        email: document.getElementById('email').value
    };

    // Send the data to the server
    fetch('http://localhost:3000/clients/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(clientData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Client registered:', data);
        // Optionally redirect to a success page or show a message
    })
    .catch(error => {
        console.error('Error registering client:', error);
    });
});
