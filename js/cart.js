/**
 * GameHub - Cart Module
 * Handles shopping cart functionality and checkout process
 */

const Cart = {
    cartItems: [],
    
    init: function() {
        // Load cart data from storage
        this.loadCartFromStorage();
        
        // Initialize cart UI elements
        this.initCartIndicator();
        this.initAddToCartButtons();
        
        // If on cart page, initialize cart-specific elements
        if (document.querySelector('.cart-page')) {
            this.renderCartPage();
            this.initCartEvents();
        }
        
        console.log('Cart module initialized');
    },
    
    loadCartFromStorage: function() {
        // Load cart data from localStorage
        const cartData = localStorage.getItem('gameHubCart');
        
        if (cartData) {
            try {
                this.cartItems = JSON.parse(cartData);
                console.log(`Cart loaded: ${this.cartItems.length} items`);
            } catch (error) {
                console.error('Failed to parse cart data from storage', error);
                this.cartItems = [];
                localStorage.removeItem('gameHubCart');
            }
        } else {
            this.cartItems = [];
        }
    },
    
    saveCartToStorage: function() {
        // Save cart data to localStorage
        localStorage.setItem('gameHubCart', JSON.stringify(this.cartItems));
    },
    
    initCartIndicator: function() {
        // Update cart count in the header
        this.updateCartCount();
        
        // Add click handler to cart icon to show mini cart
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.addEventListener('click', (e) => {
                if (e.target.closest('a[href]') && this.cartItems.length === 0) {
                    // If cart is empty and clicked on a link, let the navigation happen
                    return;
                }
                
                e.preventDefault();
                this.toggleMiniCart();
            });
        }
    },
    
    toggleMiniCart: function() {
        let miniCart = document.querySelector('.mini-cart');
        
        // Create mini cart if it doesn't exist
        if (!miniCart) {
            miniCart = document.createElement('div');
            miniCart.className = 'mini-cart';
            document.querySelector('header').appendChild(miniCart);
            
            // Close mini cart when clicking outside
            document.addEventListener('click', (e) => {
                if (miniCart && !miniCart.contains(e.target) && !e.target.closest('.cart-icon')) {
                    miniCart.classList.remove('show');
                }
            });
        }
        
        // Toggle visibility
        miniCart.classList.toggle('show');
        
        // Generate content if cart is visible
        if (miniCart.classList.contains('show')) {
            this.renderMiniCart(miniCart);
        }
    },
    
    renderMiniCart: function(miniCart) {
        if (this.cartItems.length === 0) {
            miniCart.innerHTML = `
                <div class="mini-cart-header">
                    <h3>Your Cart</h3>
                    <button class="close-mini-cart">&times;</button>
                </div>
                <div class="mini-cart-empty">
                    <p>Your shopping cart is empty.</p>
                    <a href="pages/browse.html" class="btn btn-primary">Browse Games</a>
                </div>
            `;
        } else {
            // Calculate totals
            const totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
            const subtotal = this.cartItems.reduce((sum, item) => {
                const price = item.discountPercent > 0 
                    ? item.price * (1 - item.discountPercent / 100) 
                    : item.price;
                return sum + (price * item.quantity);
            }, 0);
            
            // Build mini cart HTML
            let miniCartHTML = `
                <div class="mini-cart-header">
                    <h3>Your Cart (${totalItems} ${totalItems === 1 ? 'item' : 'items'})</h3>
                    <button class="close-mini-cart">&times;</button>
                </div>
                <div class="mini-cart-items">
            `;
            
            // Add cart items
            this.cartItems.forEach(item => {
                const itemPrice = item.discountPercent > 0 
                    ? item.price * (1 - item.discountPercent / 100) 
                    : item.price;
                
                miniCartHTML += `
                    <div class="mini-cart-item" data-game-id="${item.id}">
                        <div class="mini-cart-item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="mini-cart-item-details">
                            <h4>${item.name}</h4>
                            <div class="mini-cart-item-price">
                                ${item.discountPercent > 0 
                                    ? `<span class="original-price">$${item.price.toFixed(2)}</span>
                                       <span class="discounted-price">$${(item.price * (1 - item.discountPercent / 100)).toFixed(2)}</span>` 
                                    : `<span class="price">$${item.price.toFixed(2)}</span>`
                                }
                            </div>
                            <div class="mini-cart-item-controls">
                                <span>Qty: ${item.quantity}</span>
                                <button class="remove-from-cart-btn" data-game-id="${item.id}">Remove</button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            // Add cart footer with totals and buttons
            miniCartHTML += `
                </div>
                <div class="mini-cart-footer">
                    <div class="mini-cart-subtotal">
                        <span>Subtotal:</span>
                        <span class="price">$${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="mini-cart-buttons">
                        <a href="pages/cart.html" class="btn btn-secondary">View Cart</a>
                        <a href="pages/checkout-flow.html" class="btn btn-primary">Checkout</a>
                    </div>
                </div>
            `;
            
            miniCart.innerHTML = miniCartHTML;
            
            // Add event listeners for remove buttons
            miniCart.querySelectorAll('.remove-from-cart-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const gameId = button.getAttribute('data-game-id');
                    this.removeFromCart(gameId);
                    this.renderMiniCart(miniCart);
                });
            });
        }
        
        // Add event listener for close button
        const closeButton = miniCart.querySelector('.close-mini-cart');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                miniCart.classList.remove('show');
            });
        }
    },
    
    updateCartCount: function() {
        // Update cart count indicator in the header
        const cartCount = document.querySelector('.cart-count');
        if (!cartCount) return;
        
        // Calculate total item quantity
        const totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
        
        if (totalItems > 0) {
            cartCount.textContent = totalItems;
            cartCount.classList.add('show');
        } else {
            cartCount.textContent = '0';
            cartCount.classList.remove('show');
        }
    },
    
    initAddToCartButtons: function() {
        // Add event listeners to all "Add to Cart" buttons
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Get game data from button attributes
                const gameId = button.getAttribute('data-game-id');
                const gameName = button.getAttribute('data-game-name');
                const gamePrice = parseFloat(button.getAttribute('data-game-price'));
                const gameImage = button.getAttribute('data-game-image');
                const gameDiscount = parseFloat(button.getAttribute('data-game-discount') || '0');
                
                // Add to cart
                this.addToCart(gameId, gameName, gamePrice, gameImage, gameDiscount);
                
                // Show animation
                this.animateAddToCart(button);
            });
        });
    },
    
    animateAddToCart: function(button) {
        // Create a small circle element that will animate to the cart
        const circle = document.createElement('div');
        circle.className = 'add-to-cart-animation';
        document.body.appendChild(circle);
        
        // Position the circle at the button's location
        const buttonRect = button.getBoundingClientRect();
        circle.style.top = `${buttonRect.top + buttonRect.height / 2}px`;
        circle.style.left = `${buttonRect.left + buttonRect.width / 2}px`;
        
        // Get the cart icon position
        const cartIcon = document.querySelector('.cart-icon');
        const cartRect = cartIcon.getBoundingClientRect();
        const cartX = cartRect.left + cartRect.width / 2;
        const cartY = cartRect.top + cartRect.height / 2;
        
        // Animate the circle to the cart
        setTimeout(() => {
            circle.style.transform = `translate(${cartX - buttonRect.left - buttonRect.width / 2}px, ${cartY - buttonRect.top - buttonRect.height / 2}px) scale(0.1)`;
            circle.style.opacity = '0';
            
            // After animation completes, remove the circle and flash the cart
            setTimeout(() => {
                circle.remove();
                cartIcon.classList.add('flash');
                setTimeout(() => {
                    cartIcon.classList.remove('flash');
                }, 700);
            }, 500);
        }, 10);
    },
    
    addToCart: function(gameId, gameName, gamePrice, gameImage, gameDiscount = 0) {
        // Check if this game is already in the cart
        const existingItemIndex = this.cartItems.findIndex(item => item.id === gameId);
        
        if (existingItemIndex !== -1) {
            // Game already in cart, increase quantity
            this.cartItems[existingItemIndex].quantity += 1;
        } else {
            // Game not in cart, add new item
            this.cartItems.push({
                id: gameId,
                name: gameName,
                price: gamePrice,
                image: gameImage,
                discountPercent: gameDiscount,
                quantity: 1,
                addedAt: new Date().toISOString()
            });
        }
        
        // Save cart and update UI
        this.saveCartToStorage();
        this.updateCartCount();
        
        // Show success notification
        Utils.showNotification(`Added to cart: ${gameName}`, 'success');
    },
    
    removeFromCart: function(gameId) {
        // Find the item in the cart
        const itemIndex = this.cartItems.findIndex(item => item.id === gameId);
        
        if (itemIndex !== -1) {
            const removedItem = this.cartItems[itemIndex];
            
            // Remove item from array
            this.cartItems.splice(itemIndex, 1);
            
            // Save cart and update UI
            this.saveCartToStorage();
            this.updateCartCount();
            
            // If on cart page, re-render the cart
            if (document.querySelector('.cart-page')) {
                this.renderCartPage();
            }
            
            // Show notification
            Utils.showNotification(`Removed from cart: ${removedItem.name}`, 'info');
        }
    },
    
    updateQuantity: function(gameId, quantity) {
        // Find the item in the cart
        const itemIndex = this.cartItems.findIndex(item => item.id === gameId);
        
        if (itemIndex !== -1) {
            // Ensure quantity is a positive integer
            quantity = Math.max(1, parseInt(quantity));
            
            // Update quantity
            this.cartItems[itemIndex].quantity = quantity;
            
            // Save cart and update UI
            this.saveCartToStorage();
            this.updateCartCount();
            
            // If on cart page, update the cart UI
            if (document.querySelector('.cart-page')) {
                this.updateCartTotals();
            }
        }
    },
    
    clearCart: function() {
        // Clear all items from cart
        this.cartItems = [];
        
        // Save cart and update UI
        this.saveCartToStorage();
        this.updateCartCount();
        
        // If on cart page, re-render the cart
        if (document.querySelector('.cart-page')) {
            this.renderCartPage();
        }
        
        // Show notification
        Utils.showNotification('Your cart has been cleared', 'info');
    },
    
    renderCartPage: function() {
        const cartContainer = document.querySelector('.cart-items-container');
        if (!cartContainer) return;
        
        if (this.cartItems.length === 0) {
            // Cart is empty
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon"></div>
                    <h2>Your shopping cart is empty</h2>
                    <p>Looks like you haven't added any games to your cart yet.</p>
                    <a href="../pages/browse.html" class="btn btn-primary">Browse Games</a>
                </div>
            `;
            
            // Hide the cart summary
            const cartSummary = document.querySelector('.cart-summary');
            if (cartSummary) {
                cartSummary.style.display = 'none';
            }
        } else {
            // Cart has items
            let cartItemsHTML = `
                <div class="cart-header">
                    <div class="cart-header-item">Product</div>
                    <div class="cart-header-price">Price</div>
                    <div class="cart-header-quantity">Quantity</div>
                    <div class="cart-header-total">Total</div>
                    <div class="cart-header-actions"></div>
                </div>
                <div class="cart-items">
            `;
            
            // Add each cart item
            this.cartItems.forEach(item => {
                const itemPrice = item.discountPercent > 0 
                    ? item.price * (1 - item.discountPercent / 100) 
                    : item.price;
                const itemTotal = itemPrice * item.quantity;
                
                cartItemsHTML += `
                    <div class="cart-item" data-game-id="${item.id}">
                        <div class="cart-item-product">
                            <div class="cart-item-image">
                                <img src="${item.image}" alt="${item.name}">
                            </div>
                            <div class="cart-item-details">
                                <h3 class="cart-item-name">${item.name}</h3>
                                <div class="cart-item-meta">
                                    <span>Digital Download</span>
                                </div>
                            </div>
                        </div>
                        <div class="cart-item-price">
                            ${item.discountPercent > 0 
                                ? `<span class="original-price">$${item.price.toFixed(2)}</span>
                                   <span class="discounted-price">$${itemPrice.toFixed(2)}</span>
                                   <span class="discount-badge">-${item.discountPercent}%</span>` 
                                : `<span class="price">$${item.price.toFixed(2)}</span>`
                            }
                        </div>
                        <div class="cart-item-quantity">
                            <div class="quantity-control">
                                <button class="quantity-decrease" data-game-id="${item.id}">−</button>
                                <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" data-game-id="${item.id}">
                                <button class="quantity-increase" data-game-id="${item.id}">+</button>
                            </div>
                        </div>
                        <div class="cart-item-total">
                            <span class="price">$${itemTotal.toFixed(2)}</span>
                        </div>
                        <div class="cart-item-actions">
                            <button class="remove-from-cart-btn" data-game-id="${item.id}">
                                <span class="remove-icon"></span>
                            </button>
                        </div>
                    </div>
                `;
            });
            
            cartItemsHTML += `
                </div>
                <div class="cart-actions">
                    <button class="clear-cart-btn">Clear Cart</button>
                    <a href="../pages/browse.html" class="continue-shopping-btn">Continue Shopping</a>
                </div>
            `;
            
            cartContainer.innerHTML = cartItemsHTML;
            
            // Show the cart summary
            const cartSummary = document.querySelector('.cart-summary');
            if (cartSummary) {
                cartSummary.style.display = 'block';
            }
            
            // Update totals
            this.updateCartTotals();
        }
    },
    
    updateCartTotals: function() {
        // Calculate totals
        const subtotal = this.cartItems.reduce((sum, item) => {
            const price = item.discountPercent > 0 
                ? item.price * (1 - item.discountPercent / 100) 
                : item.price;
            return sum + (price * item.quantity);
        }, 0);
        
        // In a real store, you'd calculate taxes and shipping here
        const tax = subtotal * 0.08; // Example: 8% tax
        const shipping = subtotal > 0 ? 0 : 0; // Free shipping
        const total = subtotal + tax + shipping;
        
        // Update summary elements
        const summarySubtotal = document.querySelector('.summary-subtotal .value');
        const summaryTax = document.querySelector('.summary-tax .value');
        const summaryShipping = document.querySelector('.summary-shipping .value');
        const summaryTotal = document.querySelector('.summary-total .value');
        
        if (summarySubtotal) summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
        if (summaryTax) summaryTax.textContent = `$${tax.toFixed(2)}`;
        if (summaryShipping) summaryShipping.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
        if (summaryTotal) summaryTotal.textContent = `$${total.toFixed(2)}`;
        
        // Update order total in checkout button if it exists
        const checkoutTotal = document.querySelector('.checkout-btn .total');
        if (checkoutTotal) {
            checkoutTotal.textContent = `$${total.toFixed(2)}`;
        }
    },
    
    initCartEvents: function() {
        // Cart page only events
        const cartContainer = document.querySelector('.cart-items-container');
        if (!cartContainer) return;
        
        // Use event delegation for all cart item events
        cartContainer.addEventListener('click', (e) => {
            // Remove button clicked
            if (e.target.closest('.remove-from-cart-btn')) {
                const button = e.target.closest('.remove-from-cart-btn');
                const gameId = button.getAttribute('data-game-id');
                this.removeFromCart(gameId);
            }
            
            // Quantity decrease button clicked
            if (e.target.closest('.quantity-decrease')) {
                const button = e.target.closest('.quantity-decrease');
                const gameId = button.getAttribute('data-game-id');
                const inputEl = cartContainer.querySelector(`.quantity-input[data-game-id="${gameId}"]`);
                let currentValue = parseInt(inputEl.value);
                if (currentValue > 1) {
                    inputEl.value = currentValue - 1;
                    this.updateQuantity(gameId, currentValue - 1);
                }
            }
            
            // Quantity increase button clicked
            if (e.target.closest('.quantity-increase')) {
                const button = e.target.closest('.quantity-increase');
                const gameId = button.getAttribute('data-game-id');
                const inputEl = cartContainer.querySelector(`.quantity-input[data-game-id="${gameId}"]`);
                let currentValue = parseInt(inputEl.value);
                if (currentValue < 99) {
                    inputEl.value = currentValue + 1;
                    this.updateQuantity(gameId, currentValue + 1);
                }
            }
            
            // Clear cart button clicked
            if (e.target.closest('.clear-cart-btn')) {
                // Show confirmation dialog
                if (confirm('Are you sure you want to clear your cart?')) {
                    this.clearCart();
                }
            }
        });
        
        // Handle quantity input changes
        cartContainer.addEventListener('change', (e) => {
            if (e.target.matches('.quantity-input')) {
                const gameId = e.target.getAttribute('data-game-id');
                let value = parseInt(e.target.value);
                
                // Ensure value is within valid range
                if (isNaN(value) || value < 1) {
                    value = 1;
                    e.target.value = 1;
                } else if (value > 99) {
                    value = 99;
                    e.target.value = 99;
                }
                
                this.updateQuantity(gameId, value);
            }
        });
        
        // Checkout button click
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', (e) => {
                if (this.cartItems.length === 0) {
                    e.preventDefault();
                    Utils.showNotification('Your cart is empty', 'error');
                }
            });
        }
    },
    
    // Methods for checkout process
    initiateCheckout: function() {
        // Save cart data to checkout session
        localStorage.setItem('gameHubCheckoutSession', JSON.stringify({
            cartItems: this.cartItems,
            timestamp: new Date().toISOString()
        }));
        
        // Redirect to checkout page
        window.location.href = 'checkout-flow.html';
    },
    
    loadCheckoutData: function() {
        // Load checkout session data
        const checkoutData = localStorage.getItem('gameHubCheckoutSession');
        
        if (!checkoutData) {
            // No checkout session, redirect to cart
            Utils.showNotification('Checkout session expired or invalid', 'error');
            window.location.href = 'cart.html';
            return null;
        }
        
        try {
            const sessionData = JSON.parse(checkoutData);
            
            // Check if session is too old (e.g., 30 minutes)
            const sessionTime = new Date(sessionData.timestamp);
            const currentTime = new Date();
            const timeDiff = (currentTime - sessionTime) / (1000 * 60); // in minutes
            
            if (timeDiff > 30) {
                // Session expired
                localStorage.removeItem('gameHubCheckoutSession');
                Utils.showNotification('Checkout session expired', 'error');
                window.location.href = 'cart.html';
                return null;
            }
            
            return sessionData;
        } catch (error) {
            console.error('Failed to parse checkout data', error);
            localStorage.removeItem('gameHubCheckoutSession');
            window.location.href = 'cart.html';
            return null;
        }
    },
    
    completeCheckout: function(paymentData, shippingData) {
        // In a real app, this would send data to a server for processing
        
        // Get checkout session
        const checkoutSession = this.loadCheckoutData();
        if (!checkoutSession) return false;
        
        // Create order record
        const order = {
            id: 'order_' + Date.now(),
            items: checkoutSession.cartItems,
            payment: paymentData,
            shipping: shippingData,
            status: 'completed',
            createdAt: new Date().toISOString()
        };
        
        // Store in order history
        const orders = JSON.parse(localStorage.getItem('gameHubOrders') || '[]');
        orders.push(order);
        localStorage.setItem('gameHubOrders', JSON.stringify(orders));
        
        // Add games to user's library if logged in
        const currentUser = JSON.parse(localStorage.getItem('gameHubCurrentUser') || 'null');
        if (currentUser) {
            const users = JSON.parse(localStorage.getItem('gameHubUsers') || '[]');
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            
            if (userIndex !== -1) {
                // Initialize library array if it doesn't exist
                if (!users[userIndex].library) {
                    users[userIndex].library = [];
                }
                
                // Add each game to library
                checkoutSession.cartItems.forEach(item => {
                    if (!users[userIndex].library.includes(item.id)) {
                        users[userIndex].library.push(item.id);
                    }
                });
                
                // Save updated user data
                localStorage.setItem('gameHubUsers', JSON.stringify(users));
            }
        }
        
        // Clear the cart and checkout session
        this.cartItems = [];
        this.saveCartToStorage();
        localStorage.removeItem('gameHubCheckoutSession');
        
        return order;
    }
};

// Initialize module when page loads
document.addEventListener('DOMContentLoaded', function() {
    Cart.init();
});