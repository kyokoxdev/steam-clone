/**
 * Rating Components Module
 * Contains components for star and thumbs-based rating systems
 */

const RatingComponents = (function() {
    /**
     * Initialize all rating components on the page
     */
    const init = () => {
        initializeStarRatings();
        initializeThumbsRatings();
    };
    
    /**
     * Initialize all star rating components
     */
    const initializeStarRatings = () => {
        const starRatingContainers = document.querySelectorAll('.star-rating-container');
        
        starRatingContainers.forEach(container => {
            const isInteractive = container.getAttribute('data-interactive') === 'true';
            
            // Skip if already initialized
            if (container.getAttribute('data-initialized')) return;
            
            // Create stars if they don't exist
            if (!container.querySelector('.stars-container')) {
                createStars(container);
            }
            
            // If interactive, add event listeners
            if (isInteractive) {
                const stars = container.querySelectorAll('.star');
                
                stars.forEach((star, index) => {
                    star.addEventListener('click', () => {
                        setRating(container, index + 1);
                    });
                    
                    // Prevent repeated hover effects when clicking stars
                    star.addEventListener('mouseenter', () => {
                        previewRating(container, index + 1);
                    });
                });
                
                container.addEventListener('mouseleave', () => {
                    resetPreview(container);
                });
            }
            
            // Mark as initialized
            container.setAttribute('data-initialized', 'true');
        });
    };
    
    /**
     * Create stars for a star rating container
     * @param {HTMLElement} container - Star rating container
     */
    const createStars = (container) => {
        const starsContainer = document.createElement('div');
        starsContainer.className = 'stars-container';
        
        const count = parseInt(container.getAttribute('data-star-count') || 5);
        const value = parseFloat(container.getAttribute('data-rating') || 0);
        
        for (let i = 1; i <= count; i++) {
            const star = document.createElement('span');
            star.className = 'star';
            star.innerHTML = '★';
            
            if (i <= value) {
                star.classList.add('active');
            }
            
            starsContainer.appendChild(star);
        }
        
        // Create rating display if needed
        if (container.getAttribute('data-show-value') === 'true') {
            const ratingDisplay = document.createElement('span');
            ratingDisplay.className = 'rating-display';
            ratingDisplay.textContent = value.toFixed(1);
            container.appendChild(ratingDisplay);
        }
        
        // Create rating count if available
        if (container.hasAttribute('data-rating-count')) {
            const ratingCount = document.createElement('span');
            ratingCount.className = 'rating-count';
            const count = container.getAttribute('data-rating-count');
            ratingCount.textContent = `(${count})`;
            container.appendChild(ratingCount);
        }
        
        container.prepend(starsContainer);
    };
    
    /**
     * Set the rating value for a star rating container
     * @param {HTMLElement} container - Star rating container
     * @param {number} value - Rating value
     */
    const setRating = (container, value) => {
        const stars = container.querySelectorAll('.star');
        const ratingDisplay = container.querySelector('.rating-display');
        
        // Update stars
        stars.forEach((star, index) => {
            star.classList.toggle('active', index < value);
        });
        
        // Update rating display
        if (ratingDisplay) {
            ratingDisplay.textContent = value.toFixed(1);
        }
        
        // Update data attribute
        container.setAttribute('data-rating', value);
        
        // Trigger change event
        const event = new CustomEvent('rating:change', { 
            detail: { value, container } 
        });
        container.dispatchEvent(event);
    };
    
    /**
     * Preview a rating value (on hover)
     * @param {HTMLElement} container - Star rating container
     * @param {number} value - Rating value
     */
    const previewRating = (container, value) => {
        const stars = container.querySelectorAll('.star');
        
        stars.forEach((star, index) => {
            if (index < value) {
                star.classList.add('hover');
            } else {
                star.classList.remove('hover');
            }
        });
    };
    
    /**
     * Reset preview (on mouse leave)
     * @param {HTMLElement} container - Star rating container
     */
    const resetPreview = (container) => {
        const stars = container.querySelectorAll('.star');
        stars.forEach(star => star.classList.remove('hover'));
    };
    
    /**
     * Initialize all thumbs ratings components
     */
    const initializeThumbsRatings = () => {
        const thumbsContainers = document.querySelectorAll('.thumbs-rating-container');
        
        thumbsContainers.forEach(container => {
            // Skip if already initialized
            if (container.getAttribute('data-initialized')) return;
            
            // Create thumbs if they don't exist
            if (!container.querySelector('.thumbs-container')) {
                createThumbs(container);
            }
            
            // Add event listeners
            const isInteractive = container.getAttribute('data-interactive') === 'true';
            
            if (isInteractive) {
                const thumbButtons = container.querySelectorAll('.thumb-button');
                
                thumbButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const value = parseInt(button.getAttribute('data-value'));
                        setThumbsRating(container, value);
                    });
                });
            }
            
            // Mark as initialized
            container.setAttribute('data-initialized', 'true');
        });
    };
    
    /**
     * Create thumbs for a thumbs rating container
     * @param {HTMLElement} container - Thumbs rating container
     */
    const createThumbs = (container) => {
        const thumbsContainer = document.createElement('div');
        thumbsContainer.className = 'thumbs-container';
        
        // Create thumbs up button
        const thumbUp = document.createElement('button');
        thumbUp.className = 'thumb-button thumb-up';
        thumbUp.setAttribute('data-value', '1');
        thumbUp.innerHTML = '👍';
        thumbUp.setAttribute('type', 'button');
        
        // Create thumbs down button
        const thumbDown = document.createElement('button');
        thumbDown.className = 'thumb-button thumb-down';
        thumbDown.setAttribute('data-value', '-1');
        thumbDown.innerHTML = '👎';
        thumbDown.setAttribute('type', 'button');
        
        // Add buttons to container
        thumbsContainer.appendChild(thumbUp);
        thumbsContainer.appendChild(thumbDown);
        
        // Set initial value if available
        const value = parseInt(container.getAttribute('data-thumbs') || 0);
        if (value === 1) {
            thumbUp.classList.add('active');
        } else if (value === -1) {
            thumbDown.classList.add('active');
        }
        
        // Add thumbs summary if counts are available
        if (container.hasAttribute('data-thumbs-up') && container.hasAttribute('data-thumbs-down')) {
            const thumbsUpCount = parseInt(container.getAttribute('data-thumbs-up') || 0);
            const thumbsDownCount = parseInt(container.getAttribute('data-thumbs-down') || 0);
            
            const thumbsSummary = document.createElement('div');
            thumbsSummary.className = 'thumbs-summary';
            
            const thumbsUpCountEl = document.createElement('span');
            thumbsUpCountEl.className = 'thumbs-up-count';
            thumbsUpCountEl.textContent = thumbsUpCount;
            
            const thumbsDownCountEl = document.createElement('span');
            thumbsDownCountEl.className = 'thumbs-down-count';
            thumbsDownCountEl.textContent = thumbsDownCount;
            
            // Calculate percentage
            const total = thumbsUpCount + thumbsDownCount;
            let percentage = 0;
            if (total > 0) {
                percentage = Math.round((thumbsUpCount / total) * 100);
            }
            
            const thumbsPercentageEl = document.createElement('span');
            thumbsPercentageEl.className = 'thumbs-percentage';
            thumbsPercentageEl.textContent = `${percentage}% Positive`;
            
            // Add sentiment class
            if (percentage >= 70) {
                thumbsPercentageEl.classList.add('positive');
            } else if (percentage >= 40) {
                thumbsPercentageEl.classList.add('mixed');
            } else {
                thumbsPercentageEl.classList.add('negative');
            }
            
            thumbsSummary.appendChild(thumbsUpCountEl);
            thumbsSummary.appendChild(thumbsDownCountEl);
            thumbsSummary.appendChild(thumbsPercentageEl);
            
            container.appendChild(thumbsSummary);
        }
        
        container.prepend(thumbsContainer);
    };
    
    /**
     * Set the thumbs rating value
     * @param {HTMLElement} container - Thumbs rating container
     * @param {number} value - Rating value (1 for up, -1 for down)
     */
    const setThumbsRating = (container, value) => {
        const thumbUp = container.querySelector('.thumb-up');
        const thumbDown = container.querySelector('.thumb-down');
        
        // Check if already active
        const currentValue = parseInt(container.getAttribute('data-thumbs') || 0);
        
        // If clicking the same button, toggle it off
        if (currentValue === value) {
            thumbUp.classList.remove('active');
            thumbDown.classList.remove('active');
            container.setAttribute('data-thumbs', '0');
            value = 0;
        } else {
            // Set new value
            thumbUp.classList.toggle('active', value === 1);
            thumbDown.classList.toggle('active', value === -1);
            container.setAttribute('data-thumbs', value);
        }
        
        // Trigger change event
        const event = new CustomEvent('thumbs:change', { 
            detail: { value, container } 
        });
        container.dispatchEvent(event);
        
        // Add verification message if needed
        if (value !== 0 && container.getAttribute('data-show-verification') === 'true') {
            showVerificationMessage(container, value);
        }
    };
    
    /**
     * Show verification message after rating
     * @param {HTMLElement} container - Rating container
     * @param {number} value - Rating value
     */
    const showVerificationMessage = (container, value) => {
        // Remove existing message
        const existingMessage = container.querySelector('.verification-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message
        const message = document.createElement('div');
        message.className = 'verification-message';
        
        if (value === 1) {
            message.textContent = 'Thanks for recommending!';
        } else {
            message.textContent = 'Thanks for your feedback!';
        }
        
        // Add to container
        container.appendChild(message);
        
        // Remove after delay
        setTimeout(() => {
            message.remove();
        }, 3000);
    };
    
    /**
     * Get rating value for a star rating container
     * @param {HTMLElement} container - Star rating container
     * @returns {number} - Rating value
     */
    const getRating = (container) => {
        return parseFloat(container.getAttribute('data-rating') || 0);
    };
    
    /**
     * Get thumbs rating value
     * @param {HTMLElement} container - Thumbs rating container
     * @returns {number} - Thumbs rating value (1, -1, or 0)
     */
    const getThumbsRating = (container) => {
        return parseInt(container.getAttribute('data-thumbs') || 0);
    };
    
    // Public API
    return {
        init,
        initializeStarRatings,
        initializeThumbsRatings,
        getRating,
        getThumbsRating,
        setRating,
        setThumbsRating
    };
})();

// Initialize rating components on page load
document.addEventListener('DOMContentLoaded', RatingComponents.init);

export default RatingComponents;