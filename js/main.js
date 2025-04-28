/**
 * GameHub - Main JavaScript Entry Point
 * This file initializes all modules and coordinates functionality across the site
 */

// Import modules (for future implementation with bundlers)
// import { initNavigation } from './modules/navigation.js';
// import { initCarousel } from './modules/carousel.js'; 
// import { initGameCards } from './modules/game-cards.js';
// import { initForms } from './modules/forms.js';

// For now we'll use a more simple approach without module bundling
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    GameHub.init();
});

// Main GameHub namespace to avoid polluting global scope
const GameHub = {
    init: function() {
        // Initialize core modules
        this.navigation.init();
        
        // Initialize page-specific modules based on current page
        this.initPageSpecificModules();
        
        // Initialize global components
        this.initGlobalComponents();
        
        console.log('GameHub initialized successfully');
    },
    
    initPageSpecificModules: function() {
        // Detect current page and initialize relevant modules
        const path = window.location.pathname;
        
        if (path.includes('index.html') || path.endsWith('/')) {
            // Home page
            this.homePage.init();
        } else if (path.includes('game-details.html')) {
            // Game details page
            this.gameDetails.init();
        } else if (path.includes('checkout-flow.html')) {
            // Checkout flow
            this.checkout.init();
        } else if (path.includes('cart.html')) {
            // Cart page
            this.cart.init();
        } else if (path.includes('login.html')) {
            // Login/Register page
            this.auth.init();
        } else if (path.includes('library.html')) {
            // Library page
            this.library.init();
        } else if (path.includes('browse.html')) {
            // Browse/store page
            this.browse.init();
        }
    },
    
    initGlobalComponents: function() {
        // Initialize components that exist on every page
        this.search.init();
        this.cart.initCartIndicator();
        this.utils.initTooltips();
        this.theme.init();
    },
    
    // Navigation module
    navigation: {
        init: function() {
            this.initMobileNav();
            this.initDropdowns();
            this.initStickyHeader();
            this.initActiveState();
        },
        
        initMobileNav: function() {
            const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
            const mobileNavOverlay = document.getElementById('mobile-nav');
            
            if (!mobileNavToggle || !mobileNavOverlay) return;
            
            mobileNavToggle.addEventListener('click', function() {
                const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
                
                // Toggle aria-expanded attribute
                mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
                
                // Toggle active class on overlay
                mobileNavOverlay.classList.toggle('active');
                
                // Toggle mobile-nav-open class on body to prevent scrolling
                document.body.classList.toggle('mobile-nav-open');
                
                // Add animation class for slide-in effect
                if (!isExpanded) {
                    mobileNavOverlay.classList.add('slide-in');
                } else {
                    // Handle slide-out animation
                    mobileNavOverlay.classList.remove('slide-in');
                    mobileNavOverlay.classList.add('slide-out');
                    
                    // Remove slide-out class after animation completes
                    setTimeout(() => {
                        mobileNavOverlay.classList.remove('slide-out');
                    }, 300); // Match animation duration in CSS
                }
            });
            
            // Close mobile nav when clicking on a link
            const mobileNavLinks = mobileNavOverlay.querySelectorAll('a');
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mobileNavToggle.setAttribute('aria-expanded', 'false');
                    mobileNavOverlay.classList.remove('active');
                    mobileNavOverlay.classList.remove('slide-in');
                    document.body.classList.remove('mobile-nav-open');
                });
            });
            
            // Close mobile nav when pressing Escape key
            document.addEventListener('keydown', function(event) {
                if (event.key === 'Escape' && mobileNavOverlay.classList.contains('active')) {
                    mobileNavToggle.setAttribute('aria-expanded', 'false');
                    mobileNavOverlay.classList.remove('active');
                    mobileNavOverlay.classList.remove('slide-in');
                    document.body.classList.remove('mobile-nav-open');
                }
            });
        },
        
        initDropdowns: function() {
            // Get all dropdown triggers
            const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
            
            dropdownTriggers.forEach(trigger => {
                // Find associated dropdown menu
                const dropdownId = trigger.getAttribute('aria-controls');
                const dropdown = document.getElementById(dropdownId);
                
                if (!dropdown) return;
                
                // Set initial state
                const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
                dropdown.classList.toggle('show', isExpanded);
                
                // Toggle dropdown on click
                trigger.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Check current state
                    const isCurrentlyExpanded = trigger.getAttribute('aria-expanded') === 'true';
                    
                    // Close all other dropdowns
                    dropdownTriggers.forEach(otherTrigger => {
                        if (otherTrigger !== trigger) {
                            otherTrigger.setAttribute('aria-expanded', 'false');
                            const otherId = otherTrigger.getAttribute('aria-controls');
                            const otherDropdown = document.getElementById(otherId);
                            if (otherDropdown) {
                                otherDropdown.classList.remove('show');
                            }
                        }
                    });
                    
                    // Toggle this dropdown
                    trigger.setAttribute('aria-expanded', !isCurrentlyExpanded);
                    dropdown.classList.toggle('show');
                    
                    // Add animation classes
                    if (!isCurrentlyExpanded) {
                        dropdown.classList.add('dropdown-fade-in');
                        dropdown.classList.remove('dropdown-fade-out');
                    } else {
                        dropdown.classList.remove('dropdown-fade-in');
                        dropdown.classList.add('dropdown-fade-out');
                        
                        // Remove class after animation completes
                        setTimeout(() => {
                            dropdown.classList.remove('dropdown-fade-out');
                        }, 200); // Match animation duration in CSS
                    }
                });
                
                // Close dropdown when clicking outside
                document.addEventListener('click', function(e) {
                    if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
                        trigger.setAttribute('aria-expanded', 'false');
                        dropdown.classList.remove('show');
                        dropdown.classList.remove('dropdown-fade-in');
                    }
                });
                
                // Close dropdown when pressing Escape
                dropdown.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape') {
                        trigger.setAttribute('aria-expanded', 'false');
                        dropdown.classList.remove('show');
                        dropdown.classList.remove('dropdown-fade-in');
                        trigger.focus(); // Return focus to trigger for better accessibility
                    }
                });
            });
        },
        
        initStickyHeader: function() {
            const header = document.querySelector('header');
            if (!header) return;
            
            // Get header height for offset calculation
            const headerHeight = header.offsetHeight;
            let isSticky = false;
            
            // Function to handle scroll
            const handleScroll = () => {
                const scrollPosition = window.scrollY;
                
                // Add sticky class when scrolled past threshold
                if (scrollPosition > headerHeight && !isSticky) {
                    header.classList.add('sticky');
                    document.body.style.paddingTop = headerHeight + 'px'; // Prevent content jump
                    isSticky = true;
                } 
                // Remove sticky class when scrolled back to top
                else if (scrollPosition <= headerHeight && isSticky) {
                    header.classList.remove('sticky');
                    document.body.style.paddingTop = '0';
                    isSticky = false;
                }
            };
            
            // Throttle scroll event for better performance
            window.addEventListener('scroll', Utils.throttle(handleScroll, 100));
            
            // Check initial scroll position
            handleScroll();
        },
        
        initActiveState: function() {
            // Get current page path
            const currentPath = window.location.pathname;
            
            // Find all navigation links
            const navLinks = document.querySelectorAll('nav a, .mobile-nav a');
            
            navLinks.forEach(link => {
                const linkPath = link.getAttribute('href');
                
                // Skip if no href or is just a "#" link
                if (!linkPath || linkPath === '#') return;
                
                // Match exact path or index.html
                if (
                    linkPath === currentPath || 
                    (currentPath.endsWith('/') && linkPath === 'index.html') ||
                    (linkPath === '/' && currentPath.endsWith('/index.html'))
                ) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                    
                    // If link is in a dropdown, mark parent as active too
                    const parentDropdown = link.closest('.dropdown-menu');
                    if (parentDropdown) {
                        const triggerId = parentDropdown.getAttribute('id');
                        const trigger = document.querySelector(`[aria-controls="${triggerId}"]`);
                        if (trigger) {
                            trigger.classList.add('active');
                        }
                    }
                }
                
                // Check for section matches (for pages like /games/, /community/, etc.)
                else if (linkPath !== '/' && currentPath.includes(linkPath)) {
                    link.classList.add('active');
                }
            });
        }
    },
    
    // Home page module
    homePage: {
        init: function() {
            this.initCarousel();
            this.initFeaturedGameCards();
        },
        
        initCarousel: function() {
            // Will be implemented with carousel functionality
            console.log('Home carousel initialized');
        },
        
        initFeaturedGameCards: function() {
            // Will be implemented with featured games behavior
            console.log('Featured games initialized');
        }
    },
    
    // Game details page module
    gameDetails: {
        init: function() {
            this.initGallery();
            this.initTabs();
            this.initReviews();
        },
        
        initGallery: function() {
            // Will be implemented with image gallery behavior
        },
        
        initTabs: function() {
            // Will handle tab switching on details page
        },
        
        initReviews: function() {
            // Will handle review loading and sorting
        }
    },
    
    // Cart module
    cart: {
        items: [],
        
        init: function() {
            this.loadCartFromStorage();
            this.renderCart();
            this.initCartEvents();
        },
        
        initCartIndicator: function() {
            // Updates the cart icon with current count
            this.loadCartFromStorage();
            this.updateCartCount();
        },
        
        loadCartFromStorage: function() {
            // Load cart data from localStorage
            const cartData = localStorage.getItem('gameHubCart');
            this.items = cartData ? JSON.parse(cartData) : [];
        },
        
        saveCartToStorage: function() {
            // Save cart data to localStorage
            localStorage.setItem('gameHubCart', JSON.stringify(this.items));
            this.updateCartCount();
        },
        
        updateCartCount: function() {
            // Update cart count in header
            const cartCountElement = document.querySelector('.cart-count');
            if (cartCountElement) {
                cartCountElement.textContent = this.items.length;
            }
        },
        
        addToCart: function(gameId, gameName, gamePrice, gameImage) {
            // Add a game to the cart
            this.items.push({
                id: gameId,
                name: gameName,
                price: gamePrice,
                image: gameImage,
                addedAt: new Date().toISOString()
            });
            
            this.saveCartToStorage();
            
            // Show success notification (to be implemented)
            GameHub.utils.showNotification('Added to cart: ' + gameName, 'success');
        },
        
        removeFromCart: function(gameId) {
            // Remove a game from the cart
            const index = this.items.findIndex(item => item.id === gameId);
            if (index !== -1) {
                const removedItem = this.items[index];
                this.items.splice(index, 1);
                this.saveCartToStorage();
                
                if (document.querySelector('.cart-page')) {
                    this.renderCart();
                }
                
                // Show notification (to be implemented)
                GameHub.utils.showNotification('Removed from cart: ' + removedItem.name, 'info');
            }
        },
        
        renderCart: function() {
            // Render cart items on cart page
            const cartItemsContainer = document.querySelector('.cart-items');
            if (!cartItemsContainer) return;
            
            if (this.items.length === 0) {
                // Show empty cart message
                cartItemsContainer.innerHTML = `
                    <div class="empty-cart">
                        <div class="empty-cart-icon"></div>
                        <h3>Your shopping cart is empty</h3>
                        <p>Browse our store to find games you'll love.</p>
                        <a href="../index.html" class="btn btn-primary">Continue Shopping</a>
                    </div>
                `;
                return;
            }
            
            // Cart has items, hide empty message
            const emptyCart = cartItemsContainer.querySelector('.empty-cart');
            if (emptyCart) {
                emptyCart.classList.add('hidden');
            }
            
            // To be fully implemented
        },
        
        initCartEvents: function() {
            // Setup event listeners for cart page
            const self = this;
            const cartItemsContainer = document.querySelector('.cart-items');
            if (!cartItemsContainer) return;
            
            // Delegate events for remove buttons
            cartItemsContainer.addEventListener('click', function(event) {
                if (event.target.closest('.remove-btn')) {
                    const cartItem = event.target.closest('.cart-item');
                    const gameId = cartItem.dataset.gameId;
                    self.removeFromCart(gameId);
                }
            });
            
            // To be expanded with more event handlers
        }
    },
    
    // Checkout module
    checkout: {
        init: function() {
            this.initCheckoutSteps();
            this.initPaymentOptions();
            this.initFormValidation();
        },
        
        initCheckoutSteps: function() {
            // Handle checkout flow navigation between steps
            const stepButtons = document.querySelectorAll('.next-step, .prev-step');
            
            stepButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Get current step and target step
                    const currentStep = document.querySelector('.checkout-step.active');
                    const targetStepId = this.dataset.next || this.dataset.prev;
                    const targetStep = document.getElementById(targetStepId + '-step');
                    
                    if (!targetStep) return;
                    
                    // Update progress indicator
                    document.querySelectorAll('.progress-step').forEach(step => {
                        step.classList.remove('active');
                    });
                    
                    document.querySelector(`.progress-step[data-step="${targetStepId}"]`).classList.add('active');
                    
                    // Hide current step and show target step
                    currentStep.classList.remove('active');
                    targetStep.classList.add('active');
                    
                    // Scroll to top of new step
                    targetStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
            });
        },
        
        initPaymentOptions: function() {
            // Handle payment method selection
            const paymentOptions = document.querySelectorAll('input[name="payment-method"]');
            const paymentDetails = document.querySelectorAll('.payment-details');
            
            paymentOptions.forEach(option => {
                option.addEventListener('change', function() {
                    // Hide all payment details first
                    paymentDetails.forEach(details => {
                        details.classList.remove('active');
                    });
                    
                    // Show the selected payment method details
                    const selectedDetails = document.getElementById(this.id + '-details');
                    if (selectedDetails) {
                        selectedDetails.classList.add('active');
                    }
                });
            });
        },
        
        initFormValidation: function() {
            // To be implemented
            // Will validate checkout form inputs
        }
    },
    
    // Authentication module (login/register)
    auth: {
        init: function() {
            this.initAuthTabs();
            this.initLoginForm();
            this.initRegisterForm();
        },
        
        initAuthTabs: function() {
            // Handle tab switching between login and register
            const authTabs = document.querySelectorAll('.auth-tab');
            const authForms = document.querySelectorAll('.auth-form');
            
            authTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    // Remove active class from all tabs and forms
                    authTabs.forEach(t => t.classList.remove('active'));
                    authForms.forEach(f => f.classList.remove('active'));
                    
                    // Add active class to clicked tab and corresponding form
                    this.classList.add('active');
                    const formId = this.dataset.form;
                    document.getElementById(formId).classList.add('active');
                });
            });
        },
        
        initLoginForm: function() {
            // To be implemented
            // Will handle login form submission and validation
        },
        
        initRegisterForm: function() {
            // To be implemented
            // Will handle registration form submission and validation
        },
        
        login: function(username, password, rememberMe) {
            // To be implemented
            // Will simulate login process
        },
        
        register: function(userData) {
            // To be implemented
            // Will simulate registration process
        },
        
        logout: function() {
            // To be implemented
            // Will handle logout process
        }
    },
    
    // Library module
    library: {
        init: function() {
            // To be implemented
            // Will handle library page functionality
        }
    },
    
    // Browse/Store module
    browse: {
        init: function() {
            this.initFilters();
            this.initSorting();
            this.initPagination();
        },
        
        initFilters: function() {
            // To be implemented
            // Will handle filter controls
        },
        
        initSorting: function() {
            // To be implemented
            // Will handle sort controls
        },
        
        initPagination: function() {
            // To be implemented
            // Will handle pagination controls
        }
    },
    
    // Search module
    search: {
        init: function() {
            this.initSearchBar();
        },
        
        initSearchBar: function() {
            // To be implemented
            // Will handle search functionality
        }
    },
    
    // Theme/Preferences module
    theme: {
        init: function() {
            this.loadThemePreference();
        },
        
        loadThemePreference: function() {
            // To be implemented
            // Will handle user theme preferences
        }
    },
    
    // Utility functions
    utils: {
        initTooltips: function() {
            // To be implemented
            // Will initialize tooltip functionality
        },
        
        showNotification: function(message, type = 'info') {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <span class="notification-message">${message}</span>
                </div>
                <button class="notification-close">&times;</button>
            `;
            
            // Add to DOM
            const notificationContainer = document.querySelector('.notification-container');
            if (!notificationContainer) {
                // Create container if it doesn't exist
                const container = document.createElement('div');
                container.className = 'notification-container';
                document.body.appendChild(container);
                container.appendChild(notification);
            } else {
                notificationContainer.appendChild(notification);
            }
            
            // Setup close button
            notification.querySelector('.notification-close').addEventListener('click', function() {
                notification.classList.add('notification-hiding');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            });
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                notification.classList.add('notification-hiding');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 5000);
        },
        
        formatCurrency: function(amount) {
            return '$' + parseFloat(amount).toFixed(2);
        },
        
        debounce: function(func, wait) {
            let timeout;
            return function() {
                const context = this;
                const args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    func.apply(context, args);
                }, wait);
            };
        }
    }
};