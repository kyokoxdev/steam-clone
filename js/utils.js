/**
 * Utility functions for the game store website
 */

/**
 * Format a date as a relative time (e.g., "2 days ago")
 * or as a date string if it's older than 30 days
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} - Formatted date string
 */
export function formatDate(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    // Convert milliseconds to seconds, minutes, hours, days
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (seconds < 60) {
        return 'Just now';
    } else if (minutes < 60) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (days < 30) {
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
        // Format as date string
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
}

/**
 * Format a price with currency symbol and decimal places
 * @param {number} price - Price in cents
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} - Formatted price
 */
export function formatPrice(price, currency = 'USD') {
    const priceInDollars = price / 100;
    
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    });
    
    return formatter.format(priceInDollars);
}

/**
 * Calculate discount price
 * @param {number} price - Original price in cents
 * @param {number} discountPercent - Discount percentage (0-100)
 * @returns {number} - Discounted price in cents
 */
export function calculateDiscountPrice(price, discountPercent) {
    return Math.floor(price * (1 - discountPercent / 100));
}

/**
 * Format file size in human-readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted size (e.g., "1.5 MB")
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Generate a random ID
 * @param {number} length - Length of ID (default: 8)
 * @returns {string} - Random ID
 */
export function generateId(length = 8) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    
    for (let i = 0; i < length; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return id;
}

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Truncate text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} - Truncated text
 */
export function truncateText(text, length) {
    if (text.length <= length) return text;
    return text.slice(0, length) + '...';
}

/**
 * Check if an element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} - Whether element is in viewport
 */
export function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Get query parameters from URL
 * @returns {Object} - Object with query parameters
 */
export function getQueryParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    
    if (queryString) {
        const pairs = queryString.split('&');
        
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i].split('=');
            params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
    }
    
    return params;
}

/**
 * Check if user is logged in
 * @returns {boolean} - Whether user is logged in
 */
export function isUserLoggedIn() {
    return localStorage.getItem('user_id') !== null;
}

/**
 * Get current user ID
 * @returns {string|null} - User ID or null if not logged in
 */
export function getCurrentUserId() {
    return localStorage.getItem('user_id');
}

/**
 * Get user's avatar URL
 * @param {string} userId - User ID
 * @returns {string} - Avatar URL
 */
export function getUserAvatar(userId) {
    // In a real implementation, this would fetch from user database
    // For demo, we'll return a default or random avatar
    
    // If no user ID, return default avatar
    if (!userId) {
        return '../assets/images/avatars/avatar-default.jpg';
    }
    
    // Generate deterministic avatar number based on user ID
    const avatarNumber = (userId.charCodeAt(0) % 5) + 1;
    return `../assets/images/avatars/avatar${avatarNumber}.jpg`;
}