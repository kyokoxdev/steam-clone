/**
 * GameHub - Utilities
 * Common utility functions used throughout the site
 */

GameHub.utils = {
    // Show notification messages to the user
    showNotification: function(message, type = 'info') {
        // Create notification element if it doesn't exist
        let notificationContainer = document.querySelector('.notification-container');
        
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
        }
        
        // Create the notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add notification to container
        notificationContainer.appendChild(notification);
        
        // Add click event for close button
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            notification.classList.add('notification-hide');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Auto-hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.add('notification-hide');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    },
    
    // Format price with proper currency symbol and decimals
    formatPrice: function(price, currency = 'USD') {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2
        });
        
        return formatter.format(price);
    },
    
    // Format date in a user-friendly way
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    // Truncate text to a specific length and add ellipsis
    truncateText: function(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    },
    
    // Get URL parameters as an object
    getUrlParams: function() {
        const params = {};
        const queryString = window.location.search.substring(1);
        const pairs = queryString.split('&');
        
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i].split('=');
            params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
        
        return params;
    },
    
    // Validate form inputs with common validation rules
    validateForm: function(formSelector, rules) {
        const form = document.querySelector(formSelector);
        if (!form) return false;
        
        let isValid = true;
        const errors = {};
        
        // Clear previous error messages
        form.querySelectorAll('.error-message').forEach(el => el.remove());
        form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        
        // Check each field against rules
        for (const fieldName in rules) {
            const fieldRules = rules[fieldName];
            const field = form.querySelector(`[name="${fieldName}"]`);
            
            if (!field) continue;
            
            const value = field.value.trim();
            
            // Check each rule for this field
            for (const rule of fieldRules) {
                // Required rule
                if (rule === 'required' && value === '') {
                    errors[fieldName] = 'This field is required';
                    isValid = false;
                    break;
                }
                
                // Email rule
                if (rule === 'email' && value !== '') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        errors[fieldName] = 'Please enter a valid email address';
                        isValid = false;
                        break;
                    }
                }
                
                // Minimum length rule
                if (typeof rule === 'object' && rule.minLength && value.length < rule.minLength) {
                    errors[fieldName] = `This field must be at least ${rule.minLength} characters`;
                    isValid = false;
                    break;
                }
                
                // Maximum length rule
                if (typeof rule === 'object' && rule.maxLength && value.length > rule.maxLength) {
                    errors[fieldName] = `This field cannot exceed ${rule.maxLength} characters`;
                    isValid = false;
                    break;
                }
                
                // Match another field (e.g. password confirmation)
                if (typeof rule === 'object' && rule.matches) {
                    const matchField = form.querySelector(`[name="${rule.matches}"]`);
                    if (matchField && value !== matchField.value) {
                        errors[fieldName] = rule.message || 'Fields do not match';
                        isValid = false;
                        break;
                    }
                }
            }
        }
        
        // Display error messages for invalid fields
        for (const fieldName in errors) {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (!field) continue;
            
            // Add invalid class to the field
            field.classList.add('is-invalid');
            
            // Create and append error message
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = errors[fieldName];
            
            const fieldParent = field.parentElement;
            fieldParent.appendChild(errorElement);
        }
        
        return isValid;
    },
    
    // Initialize global site features
    initGlobalFeatures: function() {
        // Initialize theme toggle functionality
        this.initThemeToggle();
        
        // Initialize mobile menu toggle
        this.initMobileMenu();
        
        // Initialize search functionality
        this.initSearch();
        
        // Initialize global event listeners
        this.initGlobalEvents();
    },
    
    // Handle dark/light theme toggling
    initThemeToggle: function() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) return;
        
        // Set initial theme based on localStorage or system preference
        const currentTheme = localStorage.getItem('gameHubTheme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        // Update toggle button
        themeToggle.classList.toggle('theme-dark', currentTheme === 'dark');
        
        // Handle click event
        themeToggle.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            
            // Update document theme
            document.documentElement.setAttribute('data-theme', newTheme);
            
            // Update toggle button
            themeToggle.classList.toggle('theme-dark', newTheme === 'dark');
            
            // Save preference to localStorage
            localStorage.setItem('gameHubTheme', newTheme);
        });
    },
    
    // Handle mobile menu toggling
    initMobileMenu: function() {
        const menuToggle = document.querySelector('.menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (!menuToggle || !mobileMenu) return;
        
        menuToggle.addEventListener('click', () => {
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
            
            // Toggle menu visibility
            menuToggle.setAttribute('aria-expanded', !expanded);
            mobileMenu.classList.toggle('menu-open', !expanded);
            
            // Prevent body scrolling when menu is open
            document.body.classList.toggle('no-scroll', !expanded);
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('menu-open') && 
                !mobileMenu.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                
                menuToggle.setAttribute('aria-expanded', 'false');
                mobileMenu.classList.remove('menu-open');
                document.body.classList.remove('no-scroll');
            }
        });
    },
    
    // Handle search functionality
    initSearch: function() {
        const searchForm = document.querySelector('.search-form');
        const searchInput = document.querySelector('.search-input');
        
        if (!searchForm || !searchInput) return;
        
        // Handle search form submission
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const searchQuery = searchInput.value.trim();
            if (searchQuery) {
                // Redirect to search results page with query
                window.location.href = `search-results.html?q=${encodeURIComponent(searchQuery)}`;
            }
        });
    },
    
    // Global event listeners
    initGlobalEvents: function() {
        // Dropdown menus
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                
                const dropdown = toggle.nextElementSibling;
                if (!dropdown) return;
                
                // Close all other dropdowns
                document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                    if (menu !== dropdown) {
                        menu.classList.remove('show');
                        menu.previousElementSibling.setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Toggle this dropdown
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', !isExpanded);
                dropdown.classList.toggle('show', !isExpanded);
            });
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                    menu.classList.remove('show');
                    menu.previousElementSibling.setAttribute('aria-expanded', 'false');
                });
            }
        });
        
        // Handle scroll events
        window.addEventListener('scroll', () => {
            // Add shadow to header when scrolling
            const header = document.querySelector('.main-header');
            if (header) {
                header.classList.toggle('header-shadow', window.scrollY > 0);
            }
            
            // Show/hide back-to-top button
            const backToTopBtn = document.querySelector('.back-to-top');
            if (backToTopBtn) {
                backToTopBtn.classList.toggle('show', window.scrollY > 300);
            }
        });
        
        // Back to top button functionality
        const backToTopBtn = document.querySelector('.back-to-top');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
};