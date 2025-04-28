/**
 * GameHub - Wishlist Module
 * Handles wishlist functionality for saving games for future purchase
 */

const Wishlist = {
    wishlistItems: [],
    
    init: function() {
        // Load wishlist data from storage
        this.loadWishlistFromStorage();
        
        // Initialize wishlist UI elements
        this.initWishlistButtons();
        
        // If on wishlist page, render wishlist content
        if (document.querySelector('.wishlist-page')) {
            this.renderWishlistPage();
            this.initWishlistPageEvents();
        }
        
        console.log('Wishlist module initialized');
    },
    
    loadWishlistFromStorage: function() {
        // Load wishlist data from localStorage
        const currentUser = JSON.parse(localStorage.getItem('gameHubCurrentUser'));
        
        // Store wishlist in user-specific storage if logged in
        if (currentUser) {
            const users = JSON.parse(localStorage.getItem('gameHubUsers') || '[]');
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            
            if (userIndex !== -1 && users[userIndex].wishlist) {
                this.wishlistItems = users[userIndex].wishlist;
                console.log(`Wishlist loaded for user ${currentUser.username}: ${this.wishlistItems.length} items`);
            } else {
                this.wishlistItems = [];
            }
        } else {
            // For non-logged in users, use general localStorage
            const wishlistData = localStorage.getItem('gameHubWishlist');
            
            if (wishlistData) {
                try {
                    this.wishlistItems = JSON.parse(wishlistData);
                    console.log(`Wishlist loaded: ${this.wishlistItems.length} items`);
                } catch (error) {
                    console.error('Failed to parse wishlist data from storage', error);
                    this.wishlistItems = [];
                    localStorage.removeItem('gameHubWishlist');
                }
            } else {
                this.wishlistItems = [];
            }
        }
    },
    
    saveWishlistToStorage: function() {
        // Save wishlist data to localStorage
        const currentUser = JSON.parse(localStorage.getItem('gameHubCurrentUser'));
        
        // Store wishlist in user-specific storage if logged in
        if (currentUser) {
            const users = JSON.parse(localStorage.getItem('gameHubUsers') || '[]');
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            
            if (userIndex !== -1) {
                users[userIndex].wishlist = this.wishlistItems;
                localStorage.setItem('gameHubUsers', JSON.stringify(users));
            }
        } else {
            // For non-logged in users, use general localStorage
            localStorage.setItem('gameHubWishlist', JSON.stringify(this.wishlistItems));
        }
    },
    
    initWishlistButtons: function() {
        // Add event listeners to all "Add to Wishlist" buttons
        const wishlistButtons = document.querySelectorAll('.add-to-wishlist-btn');
        
        wishlistButtons.forEach(button => {
            const gameId = button.getAttribute('data-game-id');
            
            // Set initial button state based on wishlist status
            if (this.isInWishlist(gameId)) {
                button.classList.add('in-wishlist');
                button.setAttribute('title', 'Remove from Wishlist');
            } else {
                button.classList.remove('in-wishlist');
                button.setAttribute('title', 'Add to Wishlist');
            }
            
            // Add click handler
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent triggering parent card click
                
                // Get game data from button attributes
                const gameId = button.getAttribute('data-game-id');
                const gameName = button.getAttribute('data-game-name');
                const gamePrice = parseFloat(button.getAttribute('data-game-price'));
                const gameImage = button.getAttribute('data-game-image');
                const gameDiscount = parseFloat(button.getAttribute('data-game-discount') || '0');
                
                // Toggle wishlist status
                if (this.isInWishlist(gameId)) {
                    this.removeFromWishlist(gameId);
                    button.classList.remove('in-wishlist');
                    button.setAttribute('title', 'Add to Wishlist');
                } else {
                    this.addToWishlist(gameId, gameName, gamePrice, gameImage, gameDiscount);
                    button.classList.add('in-wishlist');
                    button.setAttribute('title', 'Remove from Wishlist');
                }
            });
        });
    },
    
    isInWishlist: function(gameId) {
        // Check if a game is already in the wishlist
        return this.wishlistItems.some(item => item.id === gameId);
    },
    
    addToWishlist: function(gameId, gameName, gamePrice, gameImage, gameDiscount = 0) {
        // Check if this game is already in the wishlist
        if (this.isInWishlist(gameId)) {
            return false;
        }
        
        // Add new item to wishlist
        this.wishlistItems.push({
            id: gameId,
            name: gameName,
            price: gamePrice,
            image: gameImage,
            discountPercent: gameDiscount,
            addedAt: new Date().toISOString()
        });
        
        // Save wishlist
        this.saveWishlistToStorage();
        
        // Show success notification
        Utils.showNotification(`Added to wishlist: ${gameName}`, 'success');
        
        return true;
    },
    
    removeFromWishlist: function(gameId) {
        // Find the item in the wishlist
        const itemIndex = this.wishlistItems.findIndex(item => item.id === gameId);
        
        if (itemIndex !== -1) {
            const removedItem = this.wishlistItems[itemIndex];
            
            // Remove item from array
            this.wishlistItems.splice(itemIndex, 1);
            
            // Save wishlist
            this.saveWishlistToStorage();
            
            // If on wishlist page, re-render the wishlist
            if (document.querySelector('.wishlist-page')) {
                this.renderWishlistPage();
            }
            
            // Show notification
            Utils.showNotification(`Removed from wishlist: ${removedItem.name}`, 'info');
            
            return true;
        }
        
        return false;
    },
    
    clearWishlist: function() {
        // Clear all items from wishlist
        this.wishlistItems = [];
        
        // Save wishlist
        this.saveWishlistToStorage();
        
        // If on wishlist page, re-render the wishlist
        if (document.querySelector('.wishlist-page')) {
            this.renderWishlistPage();
        }
        
        // Show notification
        Utils.showNotification('Your wishlist has been cleared', 'info');
    },
    
    renderWishlistPage: function() {
        const wishlistContainer = document.querySelector('.wishlist-container');
        if (!wishlistContainer) return;
        
        if (this.wishlistItems.length === 0) {
            // Wishlist is empty
            wishlistContainer.innerHTML = `
                <div class="empty-wishlist">
                    <div class="empty-wishlist-icon"></div>
                    <h2>Your wishlist is empty</h2>
                    <p>Games you add to your wishlist will be saved here for later.</p>
                    <a href="../pages/browse.html" class="btn btn-primary">Browse Games</a>
                </div>
            `;
        } else {
            // Build wishlist header
            let wishlistHTML = `
                <div class="wishlist-header">
                    <div class="wishlist-title">
                        <h1>Your Wishlist (${this.wishlistItems.length} items)</h1>
                    </div>
                    <div class="wishlist-actions">
                        <button class="clear-wishlist-btn">Clear Wishlist</button>
                        <div class="sort-controls">
                            <label for="wishlist-sort">Sort by:</label>
                            <select id="wishlist-sort" class="wishlist-sort-select">
                                <option value="added-desc">Date Added (Newest First)</option>
                                <option value="added-asc">Date Added (Oldest First)</option>
                                <option value="price-asc">Price (Low to High)</option>
                                <option value="price-desc">Price (High to Low)</option>
                                <option value="discount-desc">Discount (Highest First)</option>
                                <option value="name-asc">Name (A to Z)</option>
                                <option value="name-desc">Name (Z to A)</option>
                            </select>
                        </div>
                    </div>
                </div>
            `;
            
            // Build wishlist items grid
            wishlistHTML += '<div class="wishlist-grid">';
            
            // Add each wishlist item
            this.wishlistItems.forEach(item => {
                const itemPrice = item.discountPercent > 0 
                    ? item.price * (1 - item.discountPercent / 100) 
                    : item.price;
                
                wishlistHTML += `
                    <div class="wishlist-item" data-game-id="${item.id}">
                        <button class="remove-from-wishlist-btn" data-game-id="${item.id}" title="Remove from Wishlist">
                            <span class="remove-icon">×</span>
                        </button>
                        <div class="wishlist-item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="wishlist-item-details">
                            <h3 class="wishlist-item-name">${item.name}</h3>
                            <div class="wishlist-item-price">
                                ${item.discountPercent > 0 
                                    ? `<span class="original-price">$${item.price.toFixed(2)}</span>
                                       <span class="discounted-price">$${itemPrice.toFixed(2)}</span>
                                       <span class="discount-badge">-${item.discountPercent}%</span>` 
                                    : `<span class="price">$${item.price.toFixed(2)}</span>`
                                }
                            </div>
                            <div class="wishlist-item-actions">
                                <button class="move-to-cart-btn" data-game-id="${item.id}" 
                                    data-game-name="${item.name}" 
                                    data-game-price="${item.price}" 
                                    data-game-image="${item.image}"
                                    data-game-discount="${item.discountPercent}">
                                    Add to Cart
                                </button>
                                <a href="../pages/game-details.html?id=${item.id}" class="view-details-btn">View Details</a>
                            </div>
                        </div>
                        <div class="wishlist-item-date">
                            Added ${this.formatDate(item.addedAt)}
                        </div>
                    </div>
                `;
            });
            
            wishlistHTML += '</div>';
            
            wishlistContainer.innerHTML = wishlistHTML;
        }
    },
    
    initWishlistPageEvents: function() {
        const wishlistContainer = document.querySelector('.wishlist-container');
        if (!wishlistContainer) return;
        
        // Use event delegation for all wishlist item events
        wishlistContainer.addEventListener('click', (e) => {
            // Remove button clicked
            if (e.target.closest('.remove-from-wishlist-btn')) {
                const button = e.target.closest('.remove-from-wishlist-btn');
                const gameId = button.getAttribute('data-game-id');
                this.removeFromWishlist(gameId);
            }
            
            // Move to cart button clicked
            if (e.target.closest('.move-to-cart-btn')) {
                const button = e.target.closest('.move-to-cart-btn');
                const gameId = button.getAttribute('data-game-id');
                const gameName = button.getAttribute('data-game-name');
                const gamePrice = parseFloat(button.getAttribute('data-game-price'));
                const gameImage = button.getAttribute('data-game-image');
                const gameDiscount = parseFloat(button.getAttribute('data-game-discount') || '0');
                
                // Add to cart
                Cart.addToCart(gameId, gameName, gamePrice, gameImage, gameDiscount);
                
                // Optionally remove from wishlist after adding to cart
                // Uncomment the next line if you want to remove items when they're added to cart
                // this.removeFromWishlist(gameId);
            }
            
            // Clear wishlist button clicked
            if (e.target.closest('.clear-wishlist-btn')) {
                // Show confirmation dialog
                if (confirm('Are you sure you want to clear your wishlist?')) {
                    this.clearWishlist();
                }
            }
        });
        
        // Sort select change
        const sortSelect = document.getElementById('wishlist-sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                this.sortWishlist(sortSelect.value);
            });
        }
    },
    
    sortWishlist: function(sortOption) {
        switch (sortOption) {
            case 'added-desc': // Newest first (default)
                this.wishlistItems.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
                break;
            case 'added-asc': // Oldest first
                this.wishlistItems.sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));
                break;
            case 'price-asc': // Price low to high
                this.wishlistItems.sort((a, b) => {
                    const priceA = a.discountPercent > 0 
                        ? a.price * (1 - a.discountPercent / 100) 
                        : a.price;
                    const priceB = b.discountPercent > 0 
                        ? b.price * (1 - b.discountPercent / 100) 
                        : b.price;
                    return priceA - priceB;
                });
                break;
            case 'price-desc': // Price high to low
                this.wishlistItems.sort((a, b) => {
                    const priceA = a.discountPercent > 0 
                        ? a.price * (1 - a.discountPercent / 100) 
                        : a.price;
                    const priceB = b.discountPercent > 0 
                        ? b.price * (1 - b.discountPercent / 100) 
                        : b.price;
                    return priceB - priceA;
                });
                break;
            case 'discount-desc': // Highest discount first
                this.wishlistItems.sort((a, b) => b.discountPercent - a.discountPercent);
                break;
            case 'name-asc': // A to Z
                this.wishlistItems.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc': // Z to A
                this.wishlistItems.sort((a, b) => b.name.localeCompare(a.name));
                break;
        }
        
        // Re-render the wishlist
        this.renderWishlistPage();
    },
    
    formatDate: function(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
        } else {
            return date.toLocaleDateString('en-US', { 
                year: 'numeric',
                month: 'short', 
                day: 'numeric'
            });
        }
    }
};

// Initialize module when page loads
document.addEventListener('DOMContentLoaded', function() {
    Wishlist.init();
});