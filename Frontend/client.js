async function loadClientQuotes() {
    const response = await fetch('/quotes');
    const quotes = await response.json();
    const contentDiv = document.getElementById("client-content");
    contentDiv.innerHTML = quotes.map(q => `<p>${q.details}</p>`).join("");
}

async function submitQuote() {
    const formData = new FormData();
    formData.append('address', prompt("Enter property address"));
    formData.append('squareFeet', prompt("Enter driveway size in square feet"));
    // Add more fields as necessary
    const response = await fetch('/quotes', {
        method: 'POST',
        body: formData
    });
    alert("Quote submitted!");
}
