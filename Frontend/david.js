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
