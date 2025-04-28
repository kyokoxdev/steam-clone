/**
 * GameHub - Utility Functions
 * Reusable utility functions for the GameHub application
 */

const Utils = {
    /**
     * Debounce function to limit how often a function is called
     * @param {Function} func - The function to debounce
     * @param {number} wait - The time to wait in milliseconds
     * @return {Function} - The debounced function
     */
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
    },
    
    /**
     * Throttle function to limit the rate at which a function is executed
     * @param {Function} func - The function to throttle
     * @param {number} limit - The time limit in milliseconds
     * @return {Function} - The throttled function
     */
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const context = this;
            const args = arguments;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    /**
     * Format a number as currency
     * @param {number} amount - The amount to format
     * @param {string} currency - Currency code (default: USD)
     * @return {string} - Formatted currency string
     */
    formatCurrency: function(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },
    
    /**
     * Format a date
     * @param {string|Date} date - Date to format
     * @param {string} format - Format type ('short', 'medium', 'long')
     * @return {string} - Formatted date string
     */
    formatDate: function(date, format = 'medium') {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        
        let options;
        switch(format) {
            case 'short':
                options = { month: 'short', day: 'numeric', year: 'numeric' };
                break;
            case 'long':
                options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
                break;
            case 'time':
                options = { hour: '2-digit', minute: '2-digit' };
                break;
            case 'datetime':
                options = { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
                break;
            default: // medium
                options = { month: 'long', day: 'numeric', year: 'numeric' };
        }
        
        return new Intl.DateTimeFormat('en-US', options).format(dateObj);
    },
    
    /**
     * Calculate time elapsed since a date
     * @param {string|Date} date - The date to compare against current time
     * @return {string} - Human-readable time elapsed
     */
    timeAgo: function(date) {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const now = new Date();
        const seconds = Math.floor((now - dateObj) / 1000);
        
        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) {
            return interval === 1 ? '1 year ago' : `${interval} years ago`;
        }
        
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            return interval === 1 ? '1 month ago' : `${interval} months ago`;
        }
        
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
            return interval === 1 ? '1 day ago' : `${interval} days ago`;
        }
        
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
            return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
        }
        
        interval = Math.floor(seconds / 60);
        if (interval >= 1) {
            return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;
        }
        
        return seconds < 10 ? 'just now' : `${Math.floor(seconds)} seconds ago`;
    },
    
    /**
     * Truncate a string to a specified length
     * @param {string} str - The string to truncate
     * @param {number} maxLength - Maximum length before truncation
     * @param {string} suffix - String to append after truncation
     * @return {string} - Truncated string
     */
    truncateString: function(str, maxLength, suffix = '...') {
        if (str.length <= maxLength) {
            return str;
        }
        return str.substring(0, maxLength).trim() + suffix;
    },
    
    /**
     * Generate a random string (useful for IDs)
     * @param {number} length - Length of string to generate
     * @return {string} - Random alphanumeric string
     */
    generateRandomString: function(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },
    
    /**
     * Validate an email address
     * @param {string} email - Email to validate
     * @return {boolean} - Whether the email is valid
     */
    isValidEmail: function(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },
    
    /**
     * Create a slugified version of a string
     * @param {string} text - Text to convert to slug
     * @return {string} - URL-friendly slug
     */
    createSlug: function(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove non-word chars
            .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    },
    
    /**
     * Get URL parameter by name
     * @param {string} name - Parameter name to retrieve
     * @return {string|null} - Parameter value or null
     */
    getUrlParameter: function(name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    },
    
    /**
     * Set URL parameter
     * @param {string} name - Parameter name
     * @param {string} value - Parameter value
     * @param {boolean} reload - Whether to reload page
     */
    setUrlParameter: function(name, value, reload = false) {
        const url = new URL(window.location.href);
        url.searchParams.set(name, value);
        if (reload) {
            window.location.href = url.toString();
        } else {
            window.history.pushState({}, '', url.toString());
        }
    },
    
    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @return {Promise} - Promise resolving to success boolean
     */
    copyToClipboard: function(text) {
        return navigator.clipboard.writeText(text)
            .then(() => true)
            .catch(err => {
                console.error('Failed to copy text: ', err);
                return false;
            });
    },
    
    /**
     * Get a cookie by name
     * @param {string} name - Cookie name
     * @return {string|null} - Cookie value or null
     */
    getCookie: function(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
    },
    
    /**
     * Set a cookie
     * @param {string} name - Cookie name
     * @param {string} value - Cookie value
     * @param {number} days - Days until expiration
     */
    setCookie: function(name, value, days = 30) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = '; expires=' + date.toUTCString();
        document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/; SameSite=Lax';
    },
    
    /**
     * Delete a cookie
     * @param {string} name - Cookie name
     */
    deleteCookie: function(name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    },
    
    /**
     * Create DOM element with attributes and children
     * @param {string} tag - Element tag name
     * @param {Object} attributes - Element attributes
     * @param {string|Node|Array} children - Child content
     * @return {HTMLElement} - Created element
     */
    createElement: function(tag, attributes = {}, children = null) {
        const element = document.createElement(tag);
        
        // Set attributes
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else {
                element.setAttribute(key, value);
            }
        });
        
        // Add children
        if (children) {
            if (Array.isArray(children)) {
                children.forEach(child => {
                    if (typeof child === 'string') {
                        element.appendChild(document.createTextNode(child));
                    } else if (child instanceof Node) {
                        element.appendChild(child);
                    }
                });
            } else if (typeof children === 'string') {
                element.textContent = children;
            } else if (children instanceof Node) {
                element.appendChild(children);
            }
        }
        
        return element;
    }
};

// Make utils available globally for now
window.Utils = Utils;

// Export for module usage (future implementation)
// export default Utils;