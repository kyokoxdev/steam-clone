/**
 * Rating System Module
 * Implements the rating system for games
 */

const RatingSystem = (function() {
    // Store the current user's ratings
    let userRatings = {};
    
    // Rating types
    const RATING_TYPES = {
        STARS: 'stars',
        THUMBS: 'thumbs'
    };
    
    /**
     * Initialize the rating system
     */
    const init = () => {
        // Load user ratings from localStorage
        loadUserRatings();
        
        // Initialize star rating components
        initializeStarRatings();
        
        // Initialize thumbs rating components
        initializeThumbsRatings();
        
        // Initialize review star ratings
        initializeReviewStarRatings();
        
        // Initialize review form star ratings
        initializeReviewFormStarRating();
        
        // Initialize review form thumbs rating
        initializeReviewFormThumbsRating();
        
        // Initialize review filters
        initializeReviewFilters();
        
        // Initialize helpful buttons
        initializeHelpfulButtons();
    };
    
    /**
     * Load user ratings from localStorage
     */
    const loadUserRatings = () => {
        const savedRatings = localStorage.getItem('user_ratings');
        if (savedRatings) {
            userRatings = JSON.parse(savedRatings);
        }
    };
    
    /**
     * Save user ratings to localStorage
     */
    const saveUserRatings = () => {
        localStorage.setItem('user_ratings', JSON.stringify(userRatings));
    };
    
    /**
     * Initialize star rating components
     */
    const initializeStarRatings = () => {
        const starRatingContainers = document.querySelectorAll('.star-rating-container');
        
        starRatingContainers.forEach(container => {
            const gameId = container.getAttribute('data-game-id');
            const isInteractive = container.getAttribute('data-interactive') === 'true';
            const starCount = parseInt(container.getAttribute('data-star-count') || '5');
            
            // Create rating element
            createStarRatingElement(container, gameId, starCount, isInteractive);
            
            // Display saved rating if exists
            if (userRatings[gameId] && userRatings[gameId].type === RATING_TYPES.STARS) {
                displayUserStarRating(container, userRatings[gameId].value);
            }
        });
    };
    
    /**
     * Create star rating element
     * @param {HTMLElement} container - Container element
     * @param {string} gameId - Game ID
     * @param {number} starCount - Number of stars
     * @param {boolean} isInteractive - Whether the rating is interactive
     */
    const createStarRatingElement = (container, gameId, starCount, isInteractive) => {
        // Create stars container
        const starsContainer = document.createElement('div');
        starsContainer.className = 'stars-container';
        
        // Create stars
        for (let i = 1; i <= starCount; i++) {
            const star = document.createElement('span');
            star.className = 'star';
            star.innerHTML = '★';
            star.setAttribute('data-value', i.toString());
            
            if (isInteractive) {
                // Add hover and click events for interactive stars
                star.addEventListener('mouseenter', (e) => {
                    const value = parseInt(e.target.getAttribute('data-value'));
                    highlightStars(container, value);
                });
                
                star.addEventListener('click', (e) => {
                    const value = parseInt(e.target.getAttribute('data-value'));
                    rateGame(gameId, value, RATING_TYPES.STARS);
                    displayUserStarRating(container, value);
                });
            }
            
            starsContainer.appendChild(star);
        }
        
        // Add mouseleave event to reset stars if no rating
        if (isInteractive) {
            starsContainer.addEventListener('mouseleave', () => {
                if (userRatings[gameId] && userRatings[gameId].type === RATING_TYPES.STARS) {
                    highlightStars(container, userRatings[gameId].value);
                } else {
                    highlightStars(container, 0);
                }
            });
        }
        
        // Create rating display
        const ratingDisplay = document.createElement('span');
        ratingDisplay.className = 'rating-display';
        
        // Create rating count
        const ratingCount = document.createElement('span');
        ratingCount.className = 'rating-count';
        
        // Add elements to container
        container.appendChild(starsContainer);
        container.appendChild(ratingDisplay);
        container.appendChild(ratingCount);
        
        // Add verification message for interactive ratings
        if (isInteractive) {
            const verificationMsg = document.createElement('div');
            verificationMsg.className = 'verification-message';
            verificationMsg.textContent = 'You must own this game to rate it';
            verificationMsg.style.display = 'none';
            container.appendChild(verificationMsg);
        }
    };
    
    /**
     * Highlight stars up to a certain value
     * @param {HTMLElement} container - Star rating container
     * @param {number} value - Star rating value
     */
    const highlightStars = (container, value) => {
        const stars = container.querySelectorAll('.star');
        
        stars.forEach((star, index) => {
            if (index < value) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
        
        // Update rating display
        const ratingDisplay = container.querySelector('.rating-display');
        if (ratingDisplay) {
            ratingDisplay.textContent = value > 0 ? value.toFixed(1) : '';
        }
    };
    
    /**
     * Display user's star rating
     * @param {HTMLElement} container - Star rating container
     * @param {number} value - Star rating value
     */
    const displayUserStarRating = (container, value) => {
        highlightStars(container, value);
        
        // Add "rated" class to container
        container.classList.add('rated');
    };
    
    /**
     * Initialize thumbs rating components
     */
    const initializeThumbsRatings = () => {
        const thumbsRatingContainers = document.querySelectorAll('.thumbs-rating-container');
        
        thumbsRatingContainers.forEach(container => {
            const gameId = container.getAttribute('data-game-id');
            const isInteractive = container.getAttribute('data-interactive') === 'true';
            
            // Create rating element
            createThumbsRatingElement(container, gameId, isInteractive);
            
            // Display saved rating if exists
            if (userRatings[gameId] && userRatings[gameId].type === RATING_TYPES.THUMBS) {
                displayUserThumbsRating(container, userRatings[gameId].value);
            }
        });
    };
    
    /**
     * Create thumbs rating element
     * @param {HTMLElement} container - Container element
     * @param {string} gameId - Game ID
     * @param {boolean} isInteractive - Whether the rating is interactive
     */
    const createThumbsRatingElement = (container, gameId, isInteractive) => {
        // Create thumbs container
        const thumbsContainer = document.createElement('div');
        thumbsContainer.className = 'thumbs-container';
        
        // Create thumbs up button
        const thumbUp = document.createElement('button');
        thumbUp.className = 'thumb-button thumb-up';
        thumbUp.innerHTML = '<i class="icon-thumbs-up"></i>';
        thumbUp.setAttribute('aria-label', 'Thumbs up');
        thumbUp.setAttribute('data-value', '1');
        
        // Create thumbs down button
        const thumbDown = document.createElement('button');
        thumbDown.className = 'thumb-button thumb-down';
        thumbDown.innerHTML = '<i class="icon-thumbs-down"></i>';
        thumbDown.setAttribute('aria-label', 'Thumbs down');
        thumbDown.setAttribute('data-value', '-1');
        
        if (isInteractive) {
            // Add click events for interactive thumbs
            thumbUp.addEventListener('click', () => {
                const value = 1;
                rateGame(gameId, value, RATING_TYPES.THUMBS);
                displayUserThumbsRating(container, value);
            });
            
            thumbDown.addEventListener('click', () => {
                const value = -1;
                rateGame(gameId, value, RATING_TYPES.THUMBS);
                displayUserThumbsRating(container, value);
            });
        }
        
        // Add thumbs to container
        thumbsContainer.appendChild(thumbUp);
        thumbsContainer.appendChild(thumbDown);
        
        // Create summary display
        const summaryContainer = document.createElement('div');
        summaryContainer.className = 'thumbs-summary';
        
        // Add thumbs counts
        const thumbsUpCount = document.createElement('span');
        thumbsUpCount.className = 'thumbs-up-count';
        thumbsUpCount.textContent = '0';
        
        const thumbsDownCount = document.createElement('span');
        thumbsDownCount.className = 'thumbs-down-count';
        thumbsDownCount.textContent = '0';
        
        // Add percentage display
        const percentageDisplay = document.createElement('div');
        percentageDisplay.className = 'thumbs-percentage';
        
        // Add elements to summary container
        summaryContainer.appendChild(thumbsUpCount);
        summaryContainer.appendChild(thumbsDownCount);
        summaryContainer.appendChild(percentageDisplay);
        
        // Add elements to main container
        container.appendChild(thumbsContainer);
        container.appendChild(summaryContainer);
        
        // Add verification message for interactive ratings
        if (isInteractive) {
            const verificationMsg = document.createElement('div');
            verificationMsg.className = 'verification-message';
            verificationMsg.textContent = 'You must own this game to rate it';
            verificationMsg.style.display = 'none';
            container.appendChild(verificationMsg);
        }
    };
    
    /**
     * Display user's thumbs rating
     * @param {HTMLElement} container - Thumbs rating container
     * @param {number} value - Thumbs rating value (1 for up, -1 for down)
     */
    const displayUserThumbsRating = (container, value) => {
        const thumbUp = container.querySelector('.thumb-up');
        const thumbDown = container.querySelector('.thumb-down');
        
        if (value === 1) {
            thumbUp.classList.add('active');
            thumbDown.classList.remove('active');
        } else if (value === -1) {
            thumbUp.classList.remove('active');
            thumbDown.classList.add('active');
        }
        
        // Add "rated" class to container
        container.classList.add('rated');
    };
    
    /**
     * Rate a game
     * @param {string} gameId - Game ID
     * @param {number} value - Rating value
     * @param {string} type - Rating type (stars or thumbs)
     */
    const rateGame = (gameId, value, type) => {
        // Check if user owns the game
        if (!verifyGameOwnership(gameId)) {
            showVerificationMessage(gameId, type);
            return;
        }
        
        // Save rating
        userRatings[gameId] = {
            type,
            value,
            timestamp: Date.now()
        };
        
        // Save to localStorage
        saveUserRatings();
        
        // Update aggregate rating
        updateAggregateRating(gameId, value, type);
    };
    
    /**
     * Verify if user owns the game
     * @param {string} gameId - Game ID
     * @returns {boolean} Whether user owns the game
     */
    const verifyGameOwnership = (gameId) => {
        // In a real implementation, this would check the user's library
        // For this demo, we'll simulate ownership by checking a predefined list
        const ownedGames = localStorage.getItem('owned_games');
        if (ownedGames) {
            const ownedGamesList = JSON.parse(ownedGames);
            return ownedGamesList.includes(gameId);
        }
        
        // For demo purposes, allow rating on some games without ownership verification
        const demoGames = ['1', '2', '3'];
        return demoGames.includes(gameId);
    };
    
    /**
     * Show verification message
     * @param {string} gameId - Game ID
     * @param {string} type - Rating type
     */
    const showVerificationMessage = (gameId, type) => {
        const selector = type === RATING_TYPES.STARS 
            ? `.star-rating-container[data-game-id="${gameId}"] .verification-message`
            : `.thumbs-rating-container[data-game-id="${gameId}"] .verification-message`;
        
        const message = document.querySelector(selector);
        
        if (message) {
            message.style.display = 'block';
            
            // Hide after 3 seconds
            setTimeout(() => {
                message.style.display = 'none';
            }, 3000);
        }
    };
    
    /**
     * Update aggregate rating
     * @param {string} gameId - Game ID
     * @param {number} value - Rating value
     * @param {string} type - Rating type
     */
    const updateAggregateRating = (gameId, value, type) => {
        // In a real implementation, this would send the rating to a server
        // For this demo, we'll simulate updating the UI
        
        if (type === RATING_TYPES.STARS) {
            // Update star rating display
            const containers = document.querySelectorAll(`.star-rating-container[data-game-id="${gameId}"]:not([data-interactive="true"])`);
            
            containers.forEach(container => {
                // Update display with simulated aggregate
                const ratingDisplay = container.querySelector('.rating-display');
                const randomOffset = (Math.random() * 0.4) - 0.2; // Random number between -0.2 and 0.2
                const aggregateRating = Math.min(Math.max(value + randomOffset, 1), 5);
                
                if (ratingDisplay) {
                    ratingDisplay.textContent = aggregateRating.toFixed(1);
                }
                
                // Update rating count
                const ratingCount = container.querySelector('.rating-count');
                if (ratingCount) {
                    const currentCount = parseInt(ratingCount.textContent.replace(/[^0-9]/g, '') || '0');
                    ratingCount.textContent = `(${currentCount + 1})`;
                }
                
                // Highlight stars based on aggregate
                highlightStars(container, aggregateRating);
            });
        } else if (type === RATING_TYPES.THUMBS) {
            // Update thumbs rating display
            const containers = document.querySelectorAll(`.thumbs-rating-container[data-game-id="${gameId}"]:not([data-interactive="true"])`);
            
            containers.forEach(container => {
                // Update thumbs counts
                const thumbsUpCount = container.querySelector('.thumbs-up-count');
                const thumbsDownCount = container.querySelector('.thumbs-down-count');
                
                if (thumbsUpCount && thumbsDownCount) {
                    const currentUpCount = parseInt(thumbsUpCount.textContent || '0');
                    const currentDownCount = parseInt(thumbsDownCount.textContent || '0');
                    
                    if (value === 1) {
                        thumbsUpCount.textContent = (currentUpCount + 1).toString();
                    } else if (value === -1) {
                        thumbsDownCount.textContent = (currentDownCount + 1).toString();
                    }
                    
                    // Update percentage
                    const percentageDisplay = container.querySelector('.thumbs-percentage');
                    if (percentageDisplay) {
                        const upCount = parseInt(thumbsUpCount.textContent || '0');
                        const downCount = parseInt(thumbsDownCount.textContent || '0');
                        const total = upCount + downCount;
                        
                        if (total > 0) {
                            const percentage = Math.round((upCount / total) * 100);
                            percentageDisplay.textContent = `${percentage}% Positive`;
                            
                            // Add sentiment class
                            if (percentage >= 70) {
                                percentageDisplay.className = 'thumbs-percentage positive';
                            } else if (percentage >= 40) {
                                percentageDisplay.className = 'thumbs-percentage mixed';
                            } else {
                                percentageDisplay.className = 'thumbs-percentage negative';
                            }
                        }
                    }
                }
            });
        }
    };
    
    /**
     * Initialize star rating component on review items
     */
    const initializeReviewStarRatings = () => {
        // Find all star ratings within review items
        const reviewStarRatings = document.querySelectorAll('.review-item .star-rating');
        
        reviewStarRatings.forEach(ratingElement => {
            // Set up read-only rating display
            const starsFilledElement = ratingElement.querySelector('.stars-filled');
            if (starsFilledElement) {
                // The width percentage is already set in HTML (e.g., style="width: 80%")
                // No additional initialization needed for display-only ratings
                
                // Add aria attribute for better accessibility
                const percent = starsFilledElement.style.width;
                const starsValue = Math.round(parseFloat(percent) / 20); // Convert percentage to 1-5 value
                ratingElement.setAttribute('aria-label', `${starsValue} out of 5 stars`);
            }
        });
    };
    
    /**
     * Initialize star rating component in the review form
     */
    const initializeReviewFormStarRating = () => {
        // Get interactive star buttons from review form
        const starButtons = document.querySelectorAll('.interactive-stars .star-btn');
        const ratingDisplay = document.querySelector('.star-rating-input .rating-display');
        
        if (!starButtons.length || !ratingDisplay) return;
        
        let currentRating = 0;
        
        // Add event listeners to each star button
        starButtons.forEach(button => {
            // Add hover effect
            button.addEventListener('mouseenter', () => {
                const value = parseInt(button.getAttribute('data-value'));
                highlightInteractiveStars(value);
            });
            
            // Add click event
            button.addEventListener('click', () => {
                const value = parseInt(button.getAttribute('data-value'));
                currentRating = value;
                highlightInteractiveStars(value);
                updateRatingDisplay(value);
                
                // Add selected class to indicate permanent selection
                clearStarSelection();
                for (let i = 0; i < value; i++) {
                    starButtons[i].classList.add('selected');
                }
            });
        });
        
        // Add mouseleave event to the star container to reset highlights (but keep selection)
        const starContainer = document.querySelector('.interactive-stars');
        if (starContainer) {
            starContainer.addEventListener('mouseleave', () => {
                highlightInteractiveStars(currentRating);
            });
        }
        
        // Helper function to update rating display text
        function updateRatingDisplay(value) {
            ratingDisplay.textContent = value > 0 ? `${value} Star${value !== 1 ? 's' : ''}` : 'Not Rated';
        }
        
        // Helper function to clear selected class from all stars
        function clearStarSelection() {
            starButtons.forEach(button => {
                button.classList.remove('selected');
            });
        }
        
        // Helper function to highlight stars based on value
        function highlightInteractiveStars(value) {
            starButtons.forEach((button, index) => {
                if (index < value) {
                    button.classList.add('hovered');
                } else {
                    button.classList.remove('hovered');
                }
            });
        }
    };
    
    /**
     * Initialize thumbs rating in the review form
     */
    const initializeReviewFormThumbsRating = () => {
        const thumbsUpBtn = document.querySelector('.thumbs-container .thumbs-up');
        const thumbsDownBtn = document.querySelector('.thumbs-container .thumbs-down');
        
        if (!thumbsUpBtn || !thumbsDownBtn) return;
        
        // Add click event for thumbs up
        thumbsUpBtn.addEventListener('click', () => {
            thumbsUpBtn.classList.add('active');
            thumbsDownBtn.classList.remove('active');
        });
        
        // Add click event for thumbs down
        thumbsDownBtn.addEventListener('click', () => {
            thumbsDownBtn.classList.add('active');
            thumbsUpBtn.classList.remove('active');
        });
    };
    
    /**
     * Initialize review filters
     */
    const initializeReviewFilters = () => {
        // Basic filters (All, Positive, Negative)
        const filterButtons = document.querySelectorAll('.review-filters .review-filter');
        const reviewItems = document.querySelectorAll('.review-item');
        
        // Add click event to filter buttons
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Get filter type
                const filterType = button.textContent.toLowerCase();
                
                // Filter reviews
                reviewItems.forEach(item => {
                    const isPositive = item.querySelector('.review-rating.positive') !== null;
                    
                    if (filterType === 'all') {
                        item.style.display = '';
                    } else if (filterType === 'positive' && isPositive) {
                        item.style.display = '';
                    } else if (filterType === 'negative' && !isPositive) {
                        item.style.display = 'none';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
        
        // Advanced filters dropdown
        const filterDropdownBtn = document.querySelector('.review-filter-btn');
        const filterDropdownContent = document.querySelector('.filter-dropdown-content');
        
        if (filterDropdownBtn && filterDropdownContent) {
            // Toggle dropdown visibility
            filterDropdownBtn.addEventListener('click', () => {
                filterDropdownContent.classList.toggle('show');
                
                // Toggle arrow direction
                const arrow = filterDropdownBtn.querySelector('.dropdown-arrow');
                if (arrow) {
                    arrow.textContent = filterDropdownContent.classList.contains('show') ? '▲' : '▼';
                }
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (event) => {
                if (!event.target.matches('.review-filter-btn') && 
                    !event.target.closest('.filter-dropdown-content') &&
                    !event.target.closest('.dropdown-arrow')) {
                    
                    if (filterDropdownContent.classList.contains('show')) {
                        filterDropdownContent.classList.remove('show');
                        
                        // Reset arrow
                        const arrow = filterDropdownBtn.querySelector('.dropdown-arrow');
                        if (arrow) {
                            arrow.textContent = '▼';
                        }
                    }
                }
            });
            
            // Apply filters button
            const applyFiltersBtn = document.querySelector('.apply-filters');
            if (applyFiltersBtn) {
                applyFiltersBtn.addEventListener('click', () => {
                    applyAdvancedFilters();
                    filterDropdownContent.classList.remove('show');
                    
                    // Reset arrow
                    const arrow = filterDropdownBtn.querySelector('.dropdown-arrow');
                    if (arrow) {
                        arrow.textContent = '▼';
                    }
                });
            }
        }
        
        /**
         * Apply advanced filters to reviews
         */
        function applyAdvancedFilters() {
            // Get filter values
            const starFilters = Array.from(document.querySelectorAll('input[name="rating"]:checked')).map(input => parseInt(input.value));
            const verifiedOnly = document.querySelector('input[name="purchase"][value="verified"]').checked;
            const language = document.querySelector('select[name="language"]').value;
            const sortBy = document.querySelector('select[name="sort"]').value;
            
            // Filter reviews
            reviewItems.forEach(item => {
                let showItem = true;
                
                // Star rating filter
                if (starFilters.length > 0) {
                    const starRating = item.querySelector('.star-rating');
                    if (starRating) {
                        const filledWidth = starRating.querySelector('.stars-filled').style.width;
                        const ratingValue = Math.round(parseFloat(filledWidth) / 20);
                        
                        if (!starFilters.includes(ratingValue)) {
                            showItem = false;
                        }
                    }
                }
                
                // Verified purchase filter
                if (verifiedOnly) {
                    const isVerified = item.querySelector('.review-ownership .owned') !== null;
                    if (!isVerified) {
                        showItem = false;
                    }
                }
                
                // Set visibility
                item.style.display = showItem ? '' : 'none';
            });
            
            // Sort reviews
            sortReviews(sortBy);
        }
        
        /**
         * Sort reviews based on criteria
         * @param {string} sortBy - Sort criteria
         */
        function sortReviews(sortBy) {
            const reviewList = document.querySelector('.review-list');
            const reviewMore = document.querySelector('.review-more');
            const writeReviewSection = document.querySelector('.write-review-section');
            
            if (!reviewList || !reviewItems.length) return;
            
            // Remove elements that should stay at the end
            if (reviewMore) reviewList.removeChild(reviewMore);
            if (writeReviewSection) reviewList.removeChild(writeReviewSection);
            
            // Convert NodeList to Array for sorting
            const reviewsArray = Array.from(reviewItems);
            
            // Define compare functions for different sort criteria
            const compareRecent = (a, b) => {
                const dateA = new Date(a.querySelector('.review-date').textContent.replace('Posted: ', ''));
                const dateB = new Date(b.querySelector('.review-date').textContent.replace('Posted: ', ''));
                return dateB - dateA; // Newest first
            };
            
            const compareHelpful = (a, b) => {
                const helpfulA = parseInt(a.querySelector('.helpful-count span').textContent.match(/\d+/)[0]);
                const helpfulB = parseInt(b.querySelector('.helpful-count span').textContent.match(/\d+/)[0]);
                return helpfulB - helpfulA; // Most helpful first
            };
            
            const comparePlaytime = (a, b) => {
                const hoursA = parseFloat(a.querySelector('.review-hours').textContent.match(/\d+(\.\d+)?/)[0]);
                const hoursB = parseFloat(b.querySelector('.review-hours').textContent.match(/\d+(\.\d+)?/)[0]);
                return hoursB - hoursA; // Most playtime first
            };
            
            // Sort based on criteria
            switch (sortBy) {
                case 'recent':
                    reviewsArray.sort(compareRecent);
                    break;
                case 'helpful':
                    reviewsArray.sort(compareHelpful);
                    break;
                case 'playtime':
                    reviewsArray.sort(comparePlaytime);
                    break;
                case 'funny':
                    // In a real implementation, this would sort by "funny" votes
                    // For demo, we'll use helpful as a proxy
                    reviewsArray.sort(compareHelpful);
                    break;
            }
            
            // Remove all reviews
            reviewItems.forEach(item => {
                reviewList.removeChild(item);
            });
            
            // Add sorted reviews back
            reviewsArray.forEach(item => {
                reviewList.appendChild(item);
            });
            
            // Add back the elements that should stay at the end
            if (writeReviewSection) reviewList.appendChild(writeReviewSection);
            if (reviewMore) reviewList.appendChild(reviewMore);
        }
    };
    
    /**
     * Initialize helpful buttons on reviews
     */
    const initializeHelpfulButtons = () => {
        const helpfulButtons = document.querySelectorAll('.review-helpful .helpful-btn');
        
        helpfulButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const reviewItem = e.target.closest('.review-item');
                const helpfulCount = reviewItem.querySelector('.helpful-count span');
                const buttonType = e.target.textContent;
                
                // Toggle active state
                if (button.classList.contains('active')) {
                    button.classList.remove('active');
                } else {
                    // Make sure only one button is active
                    const siblingButtons = e.target.parentElement.querySelectorAll('.helpful-btn');
                    siblingButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    
                    // Update helpful count (simulated)
                    if (helpfulCount) {
                        const currentCount = parseInt(helpfulCount.textContent.match(/\d+/)[0]);
                        helpfulCount.textContent = `${currentCount + 1} people found this review helpful`;
                    }
                    
                    // Show feedback message
                    showHelpfulFeedback(reviewItem, buttonType);
                }
            });
        });
    };
    
    /**
     * Show feedback message after marking a review as helpful
     * @param {HTMLElement} reviewItem - Review item element
     * @param {string} feedbackType - Type of feedback (Yes, No, Funny)
     */
    const showHelpfulFeedback = (reviewItem, feedbackType) => {
        // Check if feedback message already exists
        let feedbackMsg = reviewItem.querySelector('.feedback-message');
        
        if (!feedbackMsg) {
            // Create feedback message
            feedbackMsg = document.createElement('div');
            feedbackMsg.className = 'feedback-message';
            reviewItem.querySelector('.review-footer').appendChild(feedbackMsg);
        }
        
        // Set message based on feedback type
        feedbackMsg.textContent = `Thank you for marking this review as ${feedbackType.toLowerCase()}!`;
        feedbackMsg.style.display = 'block';
        
        // Hide after 3 seconds
        setTimeout(() => {
            feedbackMsg.style.display = 'none';
        }, 3000);
    };
    
    // Public API
    return {
        init,
        rateGame
    };
})();

// Initialize rating system on page load
document.addEventListener('DOMContentLoaded', RatingSystem.init);

export default RatingSystem;