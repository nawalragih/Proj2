document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        propertyAddress: document.getElementById('propertyAddress').value,
        creditCardInfo: document.getElementById('creditCardInfo').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    };

    const response = await fetch('http://localhost:3000/clients/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });

    const data = await response.json();
    if (data.message) {
        alert('Client registered successfully');
    } else {
        alert('Error registering client');
    }
});
