/**
 * This file handles the rendering of featured games on the homepage
 * Uses responsive images and lazy loading for optimal performance
 */

import featuredGames from '../data/featured-games.js';
import { createGameCardImage } from '../utils/responsive-images.js';

// Function to format price display
function formatPrice(price) {
  return (price / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });
}

// Generate a discount badge if the game is on sale
function createDiscountBadge(discountPercent) {
  if (!discountPercent) return '';
  return `<div class="discount-badge">-${discountPercent}%</div>`;
}

// Create a single game card element
function createGameCard(game) {
  const formattedPrice = formatPrice(game.price);
  const discountedPrice = game.discountPercent ? 
    formatPrice(game.price * (1 - game.discountPercent / 100)) : null;
  
  return `
    <div class="game-card" data-game-id="${game.id}">
      <div class="game-card-image-container">
        ${createGameCardImage(game)}
        ${createDiscountBadge(game.discountPercent)}
      </div>
      <div class="game-card-info">
        <h3 class="game-title">${game.title}</h3>
        <div class="game-categories">
          ${game.categories.slice(0, 3).map(cat => `<span class="category-tag">${cat}</span>`).join('')}
        </div>
        <div class="game-price">
          ${game.discountPercent ? 
            `<span class="original-price">${formattedPrice}</span>
            <span class="discounted-price">${discountedPrice}</span>` : 
            `<span class="price">${formattedPrice}</span>`
          }
        </div>
      </div>
    </div>
  `;
}

// Initialize the featured games section
function initFeaturedGames() {
  const featuredContainer = document.getElementById('featured-games');
  if (!featuredContainer) return;
  
  // Generate HTML for all featured games
  const gamesHTML = featuredGames
    .slice(0, 6) // Limit to 6 games for the featured section
    .map(game => createGameCard(game))
    .join('');
  
  // Set the HTML content
  featuredContainer.innerHTML = gamesHTML;
  
  // Add click event listeners to game cards
  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => {
      const gameId = card.getAttribute('data-game-id');
      window.location.href = `game-details.html?id=${gameId}`;
    });
  });
}

// Initialize the special offers section
function initSpecialOffers() {
  const specialOffersContainer = document.getElementById('special-offers');
  if (!specialOffersContainer) return;
  
  // Filter games with discounts
  const discountedGames = featuredGames
    .filter(game => game.discountPercent > 0)
    .slice(0, 4); // Limit to 4 games for special offers
  
  if (discountedGames.length === 0) {
    specialOffersContainer.parentElement.style.display = 'none';
    return;
  }
  
  // Generate HTML for special offers
  const offersHTML = discountedGames
    .map(game => createGameCard(game))
    .join('');
  
  // Set the HTML content
  specialOffersContainer.innerHTML = offersHTML;
}

// Initialize the new releases section
function initNewReleases() {
  const newReleasesContainer = document.getElementById('new-releases');
  if (!newReleasesContainer) return;
  
  // Sort games by release date (newest first)
  const sortedGames = [...featuredGames]
    .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
    .slice(0, 4); // Limit to 4 games
  
  // Generate HTML for new releases
  const releasesHTML = sortedGames
    .map(game => createGameCard(game))
    .join('');
  
  // Set the HTML content
  newReleasesContainer.innerHTML = releasesHTML;
}

// Initialize all game sections when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initFeaturedGames();
  initSpecialOffers();
  initNewReleases();
});