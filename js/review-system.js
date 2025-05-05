/**
 * Review System Module
 * Handles game reviews creation, display and management
 */

import RatingComponents from './rating-components.js';
import Utils from './utils.js';

const ReviewSystem = (function() {
    // Local storage key for reviews
    const STORAGE_KEY = 'gameReviews';
    
    /**
     * Initialize the review system
     */
    const init = () => {
        initializeReviewForms();
        initializeReviewLists();
        initializeReviewFilters();
    };
    
    /**
     * Initialize all review forms
     */
    const initializeReviewForms = () => {
        const reviewForms = document.querySelectorAll('.game-review-form');
        
        reviewForms.forEach(form => {
            // Skip if already initialized
            if (form.getAttribute('data-initialized')) return;
            
            // Add event listener for form submission
            form.addEventListener('submit', handleReviewSubmit);
            
            // Initialize the star rating component
            const ratingContainer = form.querySelector('.star-rating-container');
            if (ratingContainer) {
                RatingComponents.initializeStarRatings();
            }
            
            // Initialize character counter for review text
            const reviewTextArea = form.querySelector('.review-text');
            const charCounter = form.querySelector('.char-counter');
            
            if (reviewTextArea && charCounter) {
                reviewTextArea.addEventListener('input', () => {
                    const count = reviewTextArea.value.length;
                    const maxLength = parseInt(reviewTextArea.getAttribute('maxlength') || 1000);
                    charCounter.textContent = `${count}/${maxLength}`;
                    
                    // Update visual indicator
                    if (count > maxLength * 0.9) {
                        charCounter.classList.add('near-limit');
                    } else {
                        charCounter.classList.remove('near-limit');
                    }
                });
                
                // Trigger initial count
                reviewTextArea.dispatchEvent(new Event('input'));
            }
            
            // Mark as initialized
            form.setAttribute('data-initialized', 'true');
        });
    };
    
    /**
     * Handle review form submission
     * @param {Event} e - Form submit event
     */
    const handleReviewSubmit = (e) => {
        e.preventDefault();
        
        const form = e.target;
        const gameId = form.getAttribute('data-game-id');
        const ratingContainer = form.querySelector('.star-rating-container');
        const reviewText = form.querySelector('.review-text').value.trim();
        const reviewTitle = form.querySelector('.review-title').value.trim();
        
        // Validate form data
        if (!gameId) {
            showFormError(form, 'Missing game information');
            return;
        }
        
        const rating = ratingContainer ? 
            RatingComponents.getRating(ratingContainer) : 0;
            
        if (rating === 0) {
            showFormError(form, 'Please provide a star rating');
            return;
        }
        
        if (!reviewTitle) {
            showFormError(form, 'Please provide a review title');
            return;
        }
        
        if (!reviewText || reviewText.length < 20) {
            showFormError(form, 'Review must be at least 20 characters');
            return;
        }
        
        // Create review object
        const review = {
            id: Utils.generateId(),
            gameId,
            userId: getCurrentUserId(),
            username: getCurrentUsername(),
            rating,
            title: reviewTitle,
            content: reviewText,
            helpfulCount: 0,
            notHelpfulCount: 0,
            datePosted: new Date().toISOString(),
            lastUpdated: null,
            visible: true
        };
        
        // Save review to storage
        saveReview(review);
        
        // Reset form
        form.reset();
        if (ratingContainer) {
            RatingComponents.setRating(ratingContainer, 0);
        }
        
        // Show success message
        showFormSuccess(form, 'Your review has been submitted!');
        
        // Update review list if exists on the page
        const reviewList = document.querySelector(`.review-list[data-game-id="${gameId}"]`);
        if (reviewList) {
            loadAndRenderReviews(reviewList);
        }
    };
    
    /**
     * Save a review to local storage
     * @param {Object} review - Review object
     */
    const saveReview = (review) => {
        const reviews = getAllReviews();
        
        // Check if user already has a review for this game
        const existingIndex = reviews.findIndex(r => 
            r.gameId === review.gameId && r.userId === review.userId
        );
        
        if (existingIndex !== -1) {
            // Update existing review
            review.id = reviews[existingIndex].id;
            review.lastUpdated = new Date().toISOString();
            review.helpfulCount = reviews[existingIndex].helpfulCount;
            review.notHelpfulCount = reviews[existingIndex].notHelpfulCount;
            reviews[existingIndex] = review;
        } else {
            // Add new review
            reviews.push(review);
        }
        
        // Save to local storage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
        
        // Update game rating summary if it exists
        updateGameRatingSummary(review.gameId);
    };
    
    /**
     * Get all reviews from local storage
     * @returns {Array} - Array of review objects
     */
    const getAllReviews = () => {
        const storedReviews = localStorage.getItem(STORAGE_KEY);
        return storedReviews ? JSON.parse(storedReviews) : [];
    };
    
    /**
     * Get reviews for a specific game
     * @param {string} gameId - Game ID
     * @returns {Array} - Array of review objects
     */
    const getGameReviews = (gameId) => {
        const reviews = getAllReviews();
        return reviews.filter(review => 
            review.gameId === gameId && review.visible === true
        );
    };
    
    /**
     * Get current user ID (simulated)
     * @returns {string} - User ID
     */
    const getCurrentUserId = () => {
        // In a real app, this would come from authentication
        // For demo, we'll use a stored or generated ID
        let userId = localStorage.getItem('currentUserId');
        
        if (!userId) {
            userId = 'user_' + Utils.generateId();
            localStorage.setItem('currentUserId', userId);
        }
        
        return userId;
    };
    
    /**
     * Get current username (simulated)
     * @returns {string} - Username
     */
    const getCurrentUsername = () => {
        // In a real app, this would come from authentication
        // For demo, we'll use a stored or generated username
        let username = localStorage.getItem('currentUsername');
        
        if (!username) {
            username = 'User' + Math.floor(Math.random() * 10000);
            localStorage.setItem('currentUsername', username);
        }
        
        return username;
    };
    
    /**
     * Show error message on form
     * @param {HTMLElement} form - Form element
     * @param {string} message - Error message
     */
    const showFormError = (form, message) => {
        const errorContainer = form.querySelector('.form-error');
        
        if (!errorContainer) {
            const container = document.createElement('div');
            container.className = 'form-error';
            container.textContent = message;
            
            // Insert after form title
            const formTitle = form.querySelector('.form-title');
            if (formTitle) {
                formTitle.insertAdjacentElement('afterend', container);
            } else {
                form.prepend(container);
            }
        } else {
            errorContainer.textContent = message;
            errorContainer.style.display = 'block';
        }
        
        // Hide after delay
        setTimeout(() => {
            const error = form.querySelector('.form-error');
            if (error) {
                error.style.display = 'none';
            }
        }, 5000);
    };
    
    /**
     * Show success message on form
     * @param {HTMLElement} form - Form element
     * @param {string} message - Success message
     */
    const showFormSuccess = (form, message) => {
        const successContainer = form.querySelector('.form-success');
        
        if (!successContainer) {
            const container = document.createElement('div');
            container.className = 'form-success';
            container.textContent = message;
            
            // Insert after form title
            const formTitle = form.querySelector('.form-title');
            if (formTitle) {
                formTitle.insertAdjacentElement('afterend', container);
            } else {
                form.prepend(container);
            }
        } else {
            successContainer.textContent = message;
            successContainer.style.display = 'block';
        }
        
        // Hide after delay
        setTimeout(() => {
            const success = form.querySelector('.form-success');
            if (success) {
                success.style.display = 'none';
            }
        }, 5000);
    };
    
    /**
     * Initialize all review lists on the page
     */
    const initializeReviewLists = () => {
        const reviewLists = document.querySelectorAll('.review-list');
        
        reviewLists.forEach(list => {
            // Skip if already initialized
            if (list.getAttribute('data-initialized')) return;
            
            // Get game ID
            const gameId = list.getAttribute('data-game-id');
            
            if (!gameId) {
                console.error('Review list is missing game ID attribute');
                return;
            }
            
            // Load and render reviews
            loadAndRenderReviews(list);
            
            // Mark as initialized
            list.setAttribute('data-initialized', 'true');
        });
    };
    
    /**
     * Load and render reviews for a game
     * @param {HTMLElement} listContainer - Review list container
     */
    const loadAndRenderReviews = (listContainer) => {
        const gameId = listContainer.getAttribute('data-game-id');
        const reviews = getGameReviews(gameId);
        
        // Apply current filter if exists
        const sortBy = listContainer.getAttribute('data-sort-by') || 'recent';
        const filteredReviews = sortReviews(reviews, sortBy);
        
        // Clear existing reviews
        listContainer.innerHTML = '';
        
        // Check if there are reviews
        if (filteredReviews.length === 0) {
            const noReviews = document.createElement('div');
            noReviews.className = 'no-reviews-message';
            noReviews.textContent = 'No reviews yet. Be the first to review this game!';
            listContainer.appendChild(noReviews);
            return;
        }
        
        // Render each review
        filteredReviews.forEach(review => {
            const reviewElement = createReviewElement(review);
            listContainer.appendChild(reviewElement);
        });
    };
    
    /**
     * Create HTML element for a review
     * @param {Object} review - Review object
     * @returns {HTMLElement} - Review element
     */
    const createReviewElement = (review) => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review-item';
        reviewElement.setAttribute('data-review-id', review.id);
        
        // Create review header
        const reviewHeader = document.createElement('div');
        reviewHeader.className = 'review-header';
        
        // Username and date
        const userInfo = document.createElement('div');
        userInfo.className = 'review-user-info';
        
        const username = document.createElement('span');
        username.className = 'review-username';
        username.textContent = review.username;
        
        const datePosted = document.createElement('span');
        datePosted.className = 'review-date';
        datePosted.textContent = Utils.formatDate(review.datePosted);
        
        userInfo.appendChild(username);
        userInfo.appendChild(datePosted);
        
        // Star rating
        const ratingContainer = document.createElement('div');
        ratingContainer.className = 'star-rating-container';
        ratingContainer.setAttribute('data-rating', review.rating);
        ratingContainer.setAttribute('data-interactive', 'false');
        ratingContainer.setAttribute('data-star-count', '5');
        
        reviewHeader.appendChild(userInfo);
        reviewHeader.appendChild(ratingContainer);
        
        // Review title
        const reviewTitle = document.createElement('h3');
        reviewTitle.className = 'review-title';
        reviewTitle.textContent = review.title;
        
        // Review content
        const reviewContent = document.createElement('div');
        reviewContent.className = 'review-content';
        reviewContent.textContent = review.content;
        
        // Review actions
        const reviewActions = document.createElement('div');
        reviewActions.className = 'review-actions';
        
        // Helpful/Not Helpful buttons
        const helpfulButton = document.createElement('button');
        helpfulButton.className = 'review-helpful-btn';
        helpfulButton.textContent = `👍 Helpful (${review.helpfulCount})`;
        helpfulButton.setAttribute('type', 'button');
        helpfulButton.addEventListener('click', () => {
            markReviewHelpful(review.id, true);
        });
        
        const notHelpfulButton = document.createElement('button');
        notHelpfulButton.className = 'review-not-helpful-btn';
        notHelpfulButton.textContent = `👎 Not Helpful (${review.notHelpfulCount})`;
        notHelpfulButton.setAttribute('type', 'button');
        notHelpfulButton.addEventListener('click', () => {
            markReviewHelpful(review.id, false);
        });
        
        reviewActions.appendChild(helpfulButton);
        reviewActions.appendChild(notHelpfulButton);
        
        // Add edit/delete if current user is the author
        const currentUserId = getCurrentUserId();
        if (review.userId === currentUserId) {
            const editButton = document.createElement('button');
            editButton.className = 'review-edit-btn';
            editButton.textContent = 'Edit';
            editButton.setAttribute('type', 'button');
            editButton.addEventListener('click', () => {
                openEditForm(review);
            });
            
            const deleteButton = document.createElement('button');
            deleteButton.className = 'review-delete-btn';
            deleteButton.textContent = 'Delete';
            deleteButton.setAttribute('type', 'button');
            deleteButton.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this review?')) {
                    deleteReview(review.id);
                }
            });
            
            reviewActions.appendChild(editButton);
            reviewActions.appendChild(deleteButton);
        }
        
        // Construct review element
        reviewElement.appendChild(reviewHeader);
        reviewElement.appendChild(reviewTitle);
        reviewElement.appendChild(reviewContent);
        reviewElement.appendChild(reviewActions);
        
        // Initialize rating container
        RatingComponents.initializeStarRatings();
        
        return reviewElement;
    };
    
    /**
     * Mark a review as helpful or not helpful
     * @param {string} reviewId - Review ID
     * @param {boolean} isHelpful - Whether the review was marked as helpful
     */
    const markReviewHelpful = (reviewId, isHelpful) => {
        const reviews = getAllReviews();
        const reviewIndex = reviews.findIndex(r => r.id === reviewId);
        
        if (reviewIndex === -1) return;
        
        // Check if user has already voted on this review
        const userId = getCurrentUserId();
        const voteKey = `review_${reviewId}_vote_${userId}`;
        const hasVoted = localStorage.getItem(voteKey);
        
        if (hasVoted) {
            alert('You have already voted on this review.');
            return;
        }
        
        // Update helpful count
        if (isHelpful) {
            reviews[reviewIndex].helpfulCount++;
        } else {
            reviews[reviewIndex].notHelpfulCount++;
        }
        
        // Save vote to prevent multiple votes
        localStorage.setItem(voteKey, isHelpful ? 'helpful' : 'not_helpful');
        
        // Save reviews
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
        
        // Update UI
        const reviewElement = document.querySelector(`.review-item[data-review-id="${reviewId}"]`);
        if (reviewElement) {
            const helpfulBtn = reviewElement.querySelector('.review-helpful-btn');
            const notHelpfulBtn = reviewElement.querySelector('.review-not-helpful-btn');
            
            helpfulBtn.textContent = `👍 Helpful (${reviews[reviewIndex].helpfulCount})`;
            notHelpfulBtn.textContent = `👎 Not Helpful (${reviews[reviewIndex].notHelpfulCount})`;
            
            // Disable buttons after voting
            helpfulBtn.disabled = true;
            notHelpfulBtn.disabled = true;
            
            // Add voted class
            if (isHelpful) {
                helpfulBtn.classList.add('voted');
            } else {
                notHelpfulBtn.classList.add('voted');
            }
        }
    };
    
    /**
     * Open edit form for a review
     * @param {Object} review - Review object
     */
    const openEditForm = (review) => {
        // Find review element
        const reviewElement = document.querySelector(`.review-item[data-review-id="${review.id}"]`);
        
        if (!reviewElement) return;
        
        // Hide review content
        const reviewTitle = reviewElement.querySelector('.review-title');
        const reviewContent = reviewElement.querySelector('.review-content');
        const reviewActions = reviewElement.querySelector('.review-actions');
        
        if (!reviewTitle || !reviewContent || !reviewActions) return;
        
        reviewTitle.style.display = 'none';
        reviewContent.style.display = 'none';
        reviewActions.style.display = 'none';
        
        // Create edit form
        const editForm = document.createElement('form');
        editForm.className = 'review-edit-form';
        
        // Title input
        const titleInput = document.createElement('input');
        titleInput.className = 'review-title-input';
        titleInput.value = review.title;
        titleInput.required = true;
        
        // Content textarea
        const contentTextarea = document.createElement('textarea');
        contentTextarea.className = 'review-content-input';
        contentTextarea.value = review.content;
        contentTextarea.required = true;
        contentTextarea.rows = 5;
        
        // Star rating
        const ratingContainer = reviewElement.querySelector('.star-rating-container');
        const ratingValue = review.rating;
        
        // Add edit form
        const updateButton = document.createElement('button');
        updateButton.className = 'review-update-btn';
        updateButton.textContent = 'Update Review';
        updateButton.setAttribute('type', 'submit');
        
        const cancelButton = document.createElement('button');
        cancelButton.className = 'review-cancel-btn';
        cancelButton.textContent = 'Cancel';
        cancelButton.setAttribute('type', 'button');
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'review-edit-buttons';
        buttonContainer.appendChild(updateButton);
        buttonContainer.appendChild(cancelButton);
        
        editForm.appendChild(titleInput);
        editForm.appendChild(contentTextarea);
        editForm.appendChild(buttonContainer);
        
        // Insert form after the review rating
        reviewElement.appendChild(editForm);
        
        // Add event listeners
        cancelButton.addEventListener('click', () => {
            // Remove edit form
            editForm.remove();
            
            // Show review content
            reviewTitle.style.display = '';
            reviewContent.style.display = '';
            reviewActions.style.display = '';
        });
        
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Update review
            const updatedReview = {
                ...review,
                title: titleInput.value.trim(),
                content: contentTextarea.value.trim(),
                lastUpdated: new Date().toISOString()
            };
            
            // Save updated review
            saveReview(updatedReview);
            
            // Update UI
            reviewTitle.textContent = updatedReview.title;
            reviewContent.textContent = updatedReview.content;
            
            // Show review content
            reviewTitle.style.display = '';
            reviewContent.style.display = '';
            reviewActions.style.display = '';
            
            // Remove edit form
            editForm.remove();
        });
    };
    
    /**
     * Delete a review
     * @param {string} reviewId - Review ID
     */
    const deleteReview = (reviewId) => {
        const reviews = getAllReviews();
        const reviewIndex = reviews.findIndex(r => r.id === reviewId);
        
        if (reviewIndex === -1) return;
        
        // Get game ID for updating summary
        const gameId = reviews[reviewIndex].gameId;
        
        // Remove review
        reviews.splice(reviewIndex, 1);
        
        // Save reviews
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
        
        // Update UI
        const reviewElement = document.querySelector(`.review-item[data-review-id="${reviewId}"]`);
        if (reviewElement) {
            reviewElement.remove();
            
            // Check if there are no more reviews
            const reviewList = document.querySelector(`.review-list[data-game-id="${gameId}"]`);
            if (reviewList && reviewList.children.length === 0) {
                const noReviews = document.createElement('div');
                noReviews.className = 'no-reviews-message';
                noReviews.textContent = 'No reviews yet. Be the first to review this game!';
                reviewList.appendChild(noReviews);
            }
        }
        
        // Update game rating summary
        updateGameRatingSummary(gameId);
    };
    
    /**
     * Update game rating summary
     * @param {string} gameId - Game ID
     */
    const updateGameRatingSummary = (gameId) => {
        const reviews = getGameReviews(gameId);
        const summary = document.querySelector(`.game-rating-summary[data-game-id="${gameId}"]`);
        
        if (!summary) return;
        
        // Calculate average rating
        let averageRating = 0;
        if (reviews.length > 0) {
            const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
            averageRating = totalRating / reviews.length;
        }
        
        // Update summary
        const ratingContainer = summary.querySelector('.star-rating-container');
        const ratingCount = summary.querySelector('.rating-count');
        
        if (ratingContainer) {
            ratingContainer.setAttribute('data-rating', averageRating.toFixed(1));
            RatingComponents.initializeStarRatings();
        }
        
        if (ratingCount) {
            ratingCount.textContent = `(${reviews.length})`;
        }
    };
    
    /**
     * Initialize review filters
     */
    const initializeReviewFilters = () => {
        const reviewFilters = document.querySelectorAll('.review-filter');
        
        reviewFilters.forEach(filter => {
            // Skip if already initialized
            if (filter.getAttribute('data-initialized')) return;
            
            const filterOptions = filter.querySelectorAll('.filter-option');
            
            filterOptions.forEach(option => {
                option.addEventListener('click', () => {
                    // Get sort value
                    const sortBy = option.getAttribute('data-sort');
                    
                    // Update active class
                    filterOptions.forEach(opt => opt.classList.remove('active'));
                    option.classList.add('active');
                    
                    // Find associated review list
                    const reviewListId = filter.getAttribute('data-for');
                    const reviewList = reviewListId ? 
                        document.getElementById(reviewListId) : 
                        filter.closest('.reviews-container').querySelector('.review-list');
                    
                    if (reviewList) {
                        // Set sort attribute and reload
                        reviewList.setAttribute('data-sort-by', sortBy);
                        loadAndRenderReviews(reviewList);
                    }
                });
            });
            
            // Mark as initialized
            filter.setAttribute('data-initialized', 'true');
        });
    };
    
    /**
     * Sort reviews based on filter
     * @param {Array} reviews - Reviews array
     * @param {string} sortBy - Sort method
     * @returns {Array} - Sorted reviews
     */
    const sortReviews = (reviews, sortBy) => {
        const sortedReviews = [...reviews];
        
        switch (sortBy) {
            case 'recent':
                sortedReviews.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));
                break;
            case 'helpful':
                sortedReviews.sort((a, b) => b.helpfulCount - a.helpfulCount);
                break;
            case 'highest':
                sortedReviews.sort((a, b) => b.rating - a.rating);
                break;
            case 'lowest':
                sortedReviews.sort((a, b) => a.rating - b.rating);
                break;
            default:
                // Default is recent
                sortedReviews.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));
        }
        
        return sortedReviews;
    };
    
    // Public API
    return {
        init,
        getAllReviews,
        getGameReviews,
        loadAndRenderReviews
    };
})();

// Initialize review system on page load
document.addEventListener('DOMContentLoaded', ReviewSystem.init);

export default ReviewSystem;