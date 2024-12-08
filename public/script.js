// Fetch and display orders from the server
async function fetchOrders() {
    try {
        const response = await fetch('/orders'); // Fetch orders from the server
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const orders = await response.json(); // Parse JSON response
        const ordersContainer = document.getElementById('orders'); // Get the container element

        // Clear existing orders
        ordersContainer.innerHTML = '';

        // Populate the container with fetched orders
        orders.forEach(order => {
            const orderElement = document.createElement('div');
            orderElement.classList.add('order');
            orderElement.innerHTML = `
                <p>Order ID: ${order.id}</p>
                <p>Client ID: ${order.clientId}</p>
                <p>Quote ID: ${order.quoteId}</p>
                <p>Service Date: ${order.serviceDate}</p>
                <button onclick="deleteOrder(${order.id})">Delete</button>
            `;
            ordersContainer.appendChild(orderElement);
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}

// Delete an order
async function deleteOrder(id) {
    try {
        const response = await fetch(`/orders/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete order');
        }

        alert('Order deleted successfully');
        fetchOrders(); // Refresh the orders list after deletion
    } catch (error) {
        console.error('Error deleting order:', error);
        alert('Error deleting order');
    }
}

// Handle order form submission
document.getElementById('order-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const clientId = document.getElementById('client-id').value;
    const quoteId = document.getElementById('quote-id').value;
    const serviceDate = document.getElementById('service-date').value;

    try {
        const response = await fetch('/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ clientId, quoteId, serviceDate }),
        });

        if (!response.ok) {
            throw new Error('Failed to create order');
        }

        alert('Order created successfully');
        fetchOrders(); // Refresh the orders list after creating a new order
    } catch (error) {
        console.error('Error creating order:', error);
        alert('Error creating order');
    }
});
