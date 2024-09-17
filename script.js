async function fetchCryptoData() {
  try {
    const response = await fetch("http://localhost:5000/get-crypto");
    const data = await response.json();

    const cryptoDiv = document.getElementById("crypto-data");
    cryptoDiv.innerHTML = ""; 

    cryptoDiv.innerHTML += `
      <div class="crypto-header">
        <h4 class="header-name">#</h4>
        <h4 class="header-name">Platform</h4>
        <h4 class="header-detail">Last Traded Price</h4>
        <h4 class="header-detail">Buy/Sell</h4>
        <h4 class="header-detail">Volume</h4>
        <h4 class="header-detail">Base Unit</h4>
      </div>
      <hr class="divider">
    `;

    data.forEach((crypto, index) => {
      cryptoDiv.innerHTML += `
        <div class="crypto-item">
          <h3 class="crypto-name">${index+1}</h3> 
          <h3 class="crypto-name">${crypto.name.toUpperCase()}</h3>
          <p class="crypto-detail">₹${crypto.last}</p>
          <p class="crypto-detail">₹${crypto.buy} / ₹${crypto.sell}</p>
          <p class="crypto-detail">${crypto.volume}</p>
          <p class="crypto-detail">${crypto.base_unit}</p>
        </div>
        <hr class="divider">
      `;
    });
  } catch (error) {
    console.error("Error fetching crypto data:", error);
  }
}

window.onload = fetchCryptoData;
