/**
 * Price History Chart for Game Details
 * 
 * This script renders the price history chart for games, showing
 * historical prices and discounts over time.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on a page with price history chart
  const priceHistoryCanvas = document.getElementById('priceHistoryChart');
  if (!priceHistoryCanvas) return;
  
  // Initialize the price history chart
  initPriceHistoryChart(priceHistoryCanvas);
  
  // Add event listener for price alert button
  const priceAlertBtn = document.querySelector('.price-alert-btn');
  if (priceAlertBtn) {
    priceAlertBtn.addEventListener('click', setupPriceAlert);
  }
});

/**
 * Initialize the price history chart with Chart.js
 */
function initPriceHistoryChart(canvas) {
  // Sample data for the price history (in a real app, this would come from an API)
  const priceData = {
    labels: [
      'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024',
      'Oct 2024', 'Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025',
      'Mar 2025', 'Apr 2025'
    ],
    prices: [
      59.99, 59.99, 59.99, 47.99, 59.99,
      59.99, 47.99, 29.99, 59.99, 59.99,
      47.99, 59.99
    ]
  };
  
  // Check if Chart.js is loaded
  if (typeof Chart === 'undefined') {
    // Create fallback visualization
    createFallbackChart(canvas, priceData);
    
    // Try to load Chart.js dynamically
    loadChartJs().then(() => {
      if (typeof Chart !== 'undefined') {
        createChart(canvas, priceData);
      }
    }).catch(error => {
      console.error('Failed to load Chart.js:', error);
    });
  } else {
    // Create chart directly
    createChart(canvas, priceData);
  }
}

/**
 * Create the chart using Chart.js
 */
function createChart(canvas, data) {
  const ctx = canvas.getContext('2d');
  
  // Create dataset with style
  const chartData = {
    labels: data.labels,
    datasets: [{
      label: 'Price',
      data: data.prices,
      borderColor: '#66c0f4', // Steam blue
      backgroundColor: 'rgba(102, 192, 244, 0.2)',
      borderWidth: 2,
      fill: true,
      tension: 0.1,
      pointBackgroundColor: '#1a9fff',
      pointBorderColor: '#fff',
      pointRadius: 4,
      pointHoverRadius: 6
    }]
  };
  
  // Chart configuration
  const config = {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#c7d5e0'
          }
        },
        y: {
          beginAtZero: false,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#c7d5e0',
            callback: function(value) {
              return '$' + value;
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#1b2838',
          titleColor: '#fff',
          bodyColor: '#c7d5e0',
          borderColor: '#66c0f4',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              return '$' + context.raw;
            }
          }
        }
      }
    }
  };
  
  // Create the chart
  new Chart(ctx, config);
}

/**
 * Create a fallback visualization for browsers without Chart.js
 */
function createFallbackChart(canvas, data) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Background
  ctx.fillStyle = '#1b2838';
  ctx.fillRect(0, 0, width, height);
  
  // Find min and max price for scaling
  const maxPrice = Math.max(...data.prices);
  const minPrice = Math.min(...data.prices);
  const priceRange = maxPrice - minPrice;
  
  // Draw axes
  ctx.strokeStyle = '#c7d5e0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(30, 10);
  ctx.lineTo(30, height - 20);
  ctx.lineTo(width - 10, height - 20);
  ctx.stroke();
  
  // Draw price points and lines
  ctx.strokeStyle = '#66c0f4';
  ctx.lineWidth = 2;
  ctx.beginPath();
  
  const pointCount = data.prices.length;
  const pointSpacing = (width - 40) / (pointCount - 1);
  
  for (let i = 0; i < pointCount; i++) {
    const x = 30 + (i * pointSpacing);
    // Normalize price between 0 and 1, then scale to canvas height (with padding)
    const normalizedPrice = 1 - ((data.prices[i] - minPrice) / priceRange);
    const y = 10 + (normalizedPrice * (height - 40));
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    
    // Draw point
    ctx.fillStyle = '#1a9fff';
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.stroke();
  
  // Add text
  ctx.fillStyle = '#c7d5e0';
  ctx.font = '10px Arial';
  ctx.fillText('$' + minPrice.toFixed(2), 5, height - 25);
  ctx.fillText('$' + maxPrice.toFixed(2), 5, 15);
  
  // Add first and last date
  ctx.fillText(data.labels[0], 30, height - 5);
  ctx.fillText(data.labels[data.labels.length - 1], width - 40, height - 5);
}

/**
 * Load Chart.js dynamically
 */
function loadChartJs() {
  return new Promise((resolve, reject) => {
    if (typeof Chart !== 'undefined') {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * Set up a price alert for the game
 */
function setupPriceAlert() {
  // Get current game information
  const gameTitle = document.querySelector('.game-title').textContent;
  const currentPrice = document.querySelector('.price-tag').textContent;
  
  // Create modal for price alert
  const modal = document.createElement('div');
  modal.className = 'modal price-alert-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h3>Set Price Alert for ${gameTitle}</h3>
      <p>Current price: ${currentPrice}</p>
      
      <form id="price-alert-form">
        <div class="form-group">
          <label for="alert-price">Alert me when price drops below:</label>
          <div class="price-input-container">
            <span class="currency-symbol">$</span>
            <input type="number" id="alert-price" min="1" max="59.99" step="0.01" value="39.99">
          </div>
        </div>
        
        <div class="form-group">
          <label for="alert-email">Email:</label>
          <input type="email" id="alert-email" placeholder="your@email.com" required>
        </div>
        
        <div class="alert-options">
          <label>
            <input type="checkbox" id="alert-check-sales" checked>
            Also alert me about seasonal sales for this game
          </label>
        </div>
        
        <button type="submit" class="btn btn-primary">Set Alert</button>
      </form>
    </div>
  `;
  
  // Add modal to the document
  document.body.appendChild(modal);
  
  // Show the modal
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
  
  // Handle close button
  const closeBtn = modal.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.remove();
    }, 300); // Wait for animation to complete
  });
  
  // Handle form submission
  const form = modal.querySelector('#price-alert-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const alertPrice = document.getElementById('alert-price').value;
    const alertEmail = document.getElementById('alert-email').value;
    const alertSales = document.getElementById('alert-check-sales').checked;
    
    // In a real app, this would send to the server
    // For now, we'll just show a success message
    
    // Replace form with success message
    form.innerHTML = `
      <div class="alert-success">
        <div class="alert-icon">✓</div>
        <h4>Price Alert Set!</h4>
        <p>We'll email you at ${alertEmail} when the price drops below $${alertPrice}.</p>
        <button class="btn btn-secondary close-alert-btn">Close</button>
      </div>
    `;
    
    // Add event listener to the close button
    const closeAlertBtn = form.querySelector('.close-alert-btn');
    closeAlertBtn.addEventListener('click', () => {
      modal.classList.remove('show');
      setTimeout(() => {
        modal.remove();
      }, 300);
    });
    
    // Store in local storage for demo purposes
    const alerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]');
    alerts.push({
      game: gameTitle,
      price: alertPrice,
      email: alertEmail,
      includeSales: alertSales,
      dateSet: new Date().toISOString()
    });
    localStorage.setItem('priceAlerts', JSON.stringify(alerts));
  });
}