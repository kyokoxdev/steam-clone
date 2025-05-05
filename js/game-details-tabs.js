/**
 * Game Details Tabs
 * Handles the tabbed interface functionality for game detail pages
 */

// Initialize the tabbed interface when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initGameDetailsTabs();
});

/**
 * Initialize the tabbed interface on game details page
 */
function initGameDetailsTabs() {
  const tabsContainer = document.querySelector('.game-details-tabs');
  
  // If there's no tabs container on this page, exit early
  if (!tabsContainer) return;
  
  const tabNavItems = tabsContainer.querySelectorAll('.tabs-nav-item');
  const tabContents = tabsContainer.querySelectorAll('.tab-content');
  
  // Initialize the first tab as active
  if (tabNavItems.length > 0 && !tabsContainer.querySelector('.tabs-nav-item.active')) {
    tabNavItems[0].classList.add('active');
    
    const firstTabId = tabNavItems[0].getAttribute('data-tab');
    const firstTabContent = tabsContainer.querySelector(`.tab-content[data-tab="${firstTabId}"]`);
    
    if (firstTabContent) {
      firstTabContent.classList.add('active');
    }
  }
  
  // Add click event listeners to each tab nav item
  tabNavItems.forEach(navItem => {
    navItem.addEventListener('click', () => {
      const tabId = navItem.getAttribute('data-tab');
      
      // Remove active class from all nav items and tab contents
      tabNavItems.forEach(item => item.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked nav item and its corresponding content
      navItem.classList.add('active');
      
      const activeContent = tabsContainer.querySelector(`.tab-content[data-tab="${tabId}"]`);
      if (activeContent) {
        activeContent.classList.add('active');
      }
      
      // Update URL hash for direct linking
      window.location.hash = tabId;
    });
  });
  
  // Check if there's a hash in the URL to open a specific tab
  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    const tabToActivate = tabsContainer.querySelector(`.tabs-nav-item[data-tab="${hash}"]`);
    
    if (tabToActivate) {
      tabToActivate.click();
    }
  }
  
  // Initialize tab-specific features
  initSystemRequirementsTab();
  initReviewsTab();
  initRelatedContentTab();
}

/**
 * Initialize functionality specific to the system requirements tab
 */
function initSystemRequirementsTab() {
  const systemCheckButton = document.querySelector('.system-check-button');
  
  if (systemCheckButton) {
    systemCheckButton.addEventListener('click', () => {
      // Simulate system requirements check
      simulateSystemCheck();
    });
  }
}

/**
 * Simulate checking the user's system against game requirements
 */
function simulateSystemCheck() {
  // Show loading state
  const button = document.querySelector('.system-check-button');
  const originalText = button.textContent;
  button.textContent = 'Checking your system...';
  button.disabled = true;
  
  // Simulate an async operation
  setTimeout(() => {
    // Create the results modal
    const modal = document.createElement('div');
    modal.className = 'system-check-modal modal';
    
    // Generate some random "compatibility" results
    const components = ['OS', 'Processor', 'Memory', 'Graphics', 'Storage'];
    const results = components.map(component => {
      const isCompatible = Math.random() > 0.3; // 70% chance of being compatible
      return {
        component,
        compatible: isCompatible,
        message: isCompatible ? 
          `Your ${component} meets or exceeds the requirements.` : 
          `Your ${component} doesn't meet the minimum requirements.`
      };
    });
    
    // Create modal content
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>System Compatibility Check</h3>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <div class="system-check-results">
            ${results.map(result => `
              <div class="check-result ${result.compatible ? 'compatible' : 'incompatible'}">
                <div class="result-icon">
                  <i class="${result.compatible ? 'fas fa-check' : 'fas fa-times'}"></i>
                </div>
                <div class="result-info">
                  <div class="result-component">${result.component}</div>
                  <div class="result-message">${result.message}</div>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="overall-result ${results.every(r => r.compatible) ? 'compatible' : 'incompatible'}">
            <div class="result-icon">
              <i class="${results.every(r => r.compatible) ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle'}"></i>
            </div>
            <div class="result-message">
              ${results.every(r => r.compatible) ? 
                'Your system meets all the requirements for this game.' : 
                'Your system doesn\'t meet all requirements for this game.'}
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-close-button">Close</button>
        </div>
      </div>
    `;
    
    // Add modal to page
    document.body.appendChild(modal);
    
    // Handle modal close
    const closeButtons = modal.querySelectorAll('.modal-close, .modal-close-button');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        modal.classList.add('fade-out');
        setTimeout(() => {
          document.body.removeChild(modal);
        }, 300);
      });
    });
    
    // Reset button state
    button.textContent = originalText;
    button.disabled = false;
    
    // Show modal with animation
    setTimeout(() => {
      modal.classList.add('show');
    }, 50);
  }, 2000);
}

/**
 * Initialize functionality specific to the reviews tab
 */
function initReviewsTab() {
  // Set up review sorting
  const sortSelect = document.querySelector('.tab-reviews .sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      const sortValue = e.target.value;
      sortReviews(sortValue);
    });
  }
  
  // Set up voting functionality on reviews
  const voteButtons = document.querySelectorAll('.tab-reviews .vote-button');
  voteButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const isUpvote = button.classList.contains('upvote');
      const reviewId = button.closest('.review-card').getAttribute('data-review-id');
      
      // Toggle voted class
      const wasVoted = button.classList.contains('voted');
      
      // Remove voted class from both buttons in the same review
      const allButtons = button.closest('.review-votes').querySelectorAll('.vote-button');
      allButtons.forEach(btn => btn.classList.remove('voted'));
      
      // If it wasn't already voted, add the voted class
      if (!wasVoted) {
        button.classList.add('voted');
      }
      
      // Update vote count
      updateReviewVotes(reviewId, isUpvote, !wasVoted);
    });
  });
  
  // Set up write review button
  const writeReviewButton = document.querySelector('.tab-reviews .write-review-button');
  if (writeReviewButton) {
    writeReviewButton.addEventListener('click', () => {
      showReviewForm();
    });
  }
}

/**
 * Sort reviews based on the selected criteria
 * @param {string} sortValue - The sort criteria value
 */
function sortReviews(sortValue) {
  const reviewsList = document.querySelector('.tab-reviews .reviews-list');
  if (!reviewsList) return;
  
  const reviews = Array.from(reviewsList.querySelectorAll('.review-card'));
  
  // Sort the reviews based on the selected criteria
  reviews.sort((a, b) => {
    const aData = {
      date: new Date(a.querySelector('.review-date').getAttribute('data-date')),
      helpful: parseInt(a.querySelector('.helpful-count').textContent),
      rating: parseInt(a.getAttribute('data-rating')),
    };
    
    const bData = {
      date: new Date(b.querySelector('.review-date').getAttribute('data-date')),
      helpful: parseInt(b.querySelector('.helpful-count').textContent),
      rating: parseInt(b.getAttribute('data-rating')),
    };
    
    switch (sortValue) {
      case 'recent':
        return bData.date - aData.date; // Newest first
      case 'oldest':
        return aData.date - bData.date; // Oldest first
      case 'helpful':
        return bData.helpful - aData.helpful; // Most helpful first
      case 'rating-high':
        return bData.rating - aData.rating; // Highest rating first
      case 'rating-low':
        return aData.rating - bData.rating; // Lowest rating first
      default:
        return 0;
    }
  });
  
  // Clear the reviews list
  reviewsList.innerHTML = '';
  
  // Append the sorted reviews
  reviews.forEach(review => {
    reviewsList.appendChild(review);
  });
  
  // Add animation
  reviews.forEach(review => {
    review.style.opacity = '0';
    setTimeout(() => {
      review.style.opacity = '1';
      review.style.transition = 'opacity 0.3s ease';
    }, 50);
  });
}

/**
 * Update the vote count for a review
 * @param {string} reviewId - The ID of the review
 * @param {boolean} isUpvote - Whether it's an upvote or downvote
 * @param {boolean} isAdding - Whether to add or remove the vote
 */
function updateReviewVotes(reviewId, isUpvote, isAdding) {
  const reviewCard = document.querySelector(`.review-card[data-review-id="${reviewId}"]`);
  if (!reviewCard) return;
  
  const helpfulCountEl = reviewCard.querySelector('.helpful-count');
  const unhelpfulCountEl = reviewCard.querySelector('.unhelpful-count');
  
  if (isUpvote && helpfulCountEl) {
    let count = parseInt(helpfulCountEl.textContent);
    helpfulCountEl.textContent = isAdding ? count + 1 : count - 1;
  } else if (!isUpvote && unhelpfulCountEl) {
    let count = parseInt(unhelpfulCountEl.textContent);
    unhelpfulCountEl.textContent = isAdding ? count + 1 : count - 1;
  }
}

/**
 * Show the review form for writing a new review
 */
function showReviewForm() {
  const reviewFormModal = document.createElement('div');
  reviewFormModal.className = 'review-form-modal modal';
  
  reviewFormModal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Write a Review</h3>
        <button class="modal-close">×</button>
      </div>
      <div class="modal-body">
        <form class="review-form">
          <div class="form-group">
            <label>Your Rating</label>
            <div class="star-rating">
              <input type="radio" id="star5" name="rating" value="5"><label for="star5"></label>
              <input type="radio" id="star4" name="rating" value="4"><label for="star4"></label>
              <input type="radio" id="star3" name="rating" value="3"><label for="star3"></label>
              <input type="radio" id="star2" name="rating" value="2"><label for="star2"></label>
              <input type="radio" id="star1" name="rating" value="1"><label for="star1"></label>
            </div>
          </div>
          <div class="form-group">
            <label for="review-title">Review Title</label>
            <input type="text" id="review-title" placeholder="Summarize your thoughts" maxlength="100">
          </div>
          <div class="form-group">
            <label for="review-content">Your Review</label>
            <textarea id="review-content" rows="6" placeholder="Write your review here..." maxlength="5000"></textarea>
            <div class="char-counter">0/5000</div>
          </div>
          <div class="form-checkbox">
            <input type="checkbox" id="review-recommend">
            <label for="review-recommend">I recommend this game</label>
          </div>
          <div class="form-info">
            <p>Your review will be visible to other users. By submitting, you confirm that you have played this game and agree to our review guidelines.</p>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="cancel-button">Cancel</button>
        <button class="submit-review-button">Submit Review</button>
      </div>
    </div>
  `;
  
  // Add modal to page
  document.body.appendChild(reviewFormModal);
  
  // Set up character counter
  const textarea = reviewFormModal.querySelector('#review-content');
  const charCounter = reviewFormModal.querySelector('.char-counter');
  
  textarea.addEventListener('input', () => {
    const count = textarea.value.length;
    charCounter.textContent = `${count}/5000`;
  });
  
  // Handle modal close
  const closeButtons = reviewFormModal.querySelectorAll('.modal-close, .cancel-button');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      reviewFormModal.classList.add('fade-out');
      setTimeout(() => {
        document.body.removeChild(reviewFormModal);
      }, 300);
    });
  });
  
  // Handle review submission
  const submitButton = reviewFormModal.querySelector('.submit-review-button');
  submitButton.addEventListener('click', () => {
    const rating = reviewFormModal.querySelector('input[name="rating"]:checked')?.value || 0;
    const title = reviewFormModal.querySelector('#review-title').value;
    const content = reviewFormModal.querySelector('#review-content').value;
    const recommended = reviewFormModal.querySelector('#review-recommend').checked;
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    if (!title) {
      alert('Please enter a review title');
      return;
    }
    
    if (!content || content.length < 50) {
      alert('Please write a review with at least 50 characters');
      return;
    }
    
    // Simulate successful submission
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    setTimeout(() => {
      // Add the new review to the page (in a real app, this would come from the server)
      addNewReview({
        id: 'new-' + Date.now(),
        title,
        content,
        rating: parseInt(rating),
        date: new Date(),
        recommended,
        helpful: 0,
        unhelpful: 0,
        // In a real app, this would be the current user's data
        reviewer: {
          name: 'You',
          avatar: '/assets/images/avatar-default.jpg'
        }
      });
      
      // Close the modal
      reviewFormModal.classList.add('fade-out');
      setTimeout(() => {
        document.body.removeChild(reviewFormModal);
      }, 300);
      
      // Show a success notification
      showNotification('success', 'Your review has been submitted successfully!');
    }, 1500);
  });
  
  // Show modal with animation
  setTimeout(() => {
    reviewFormModal.classList.add('show');
  }, 50);
}

/**
 * Add a new review to the reviews list
 * @param {Object} review - The review data
 */
function addNewReview(review) {
  const reviewsList = document.querySelector('.tab-reviews .reviews-list');
  if (!reviewsList) return;
  
  const reviewCard = document.createElement('div');
  reviewCard.className = 'review-card';
  reviewCard.setAttribute('data-review-id', review.id);
  reviewCard.setAttribute('data-rating', review.rating);
  
  // Format date
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = review.date.toLocaleDateString(undefined, dateOptions);
  
  // Generate stars HTML
  const stars = Array(5).fill('').map((_, i) => {
    return i < review.rating ? 
      '<i class="fas fa-star"></i>' : 
      '<i class="far fa-star"></i>';
  }).join('');
  
  reviewCard.innerHTML = `
    <div class="review-header">
      <div class="reviewer-info">
        <div class="reviewer-avatar">
          <img src="${review.reviewer.avatar}" alt="${review.reviewer.name}">
        </div>
        <div class="reviewer-details">
          <div class="reviewer-name">${review.reviewer.name}</div>
          <div class="review-date" data-date="${review.date.toISOString()}">${formattedDate}</div>
        </div>
      </div>
      <div class="review-rating">
        ${stars}
        ${review.recommended ? '<span class="recommended">Recommended</span>' : ''}
      </div>
    </div>
    <h4 class="review-title">${review.title}</h4>
    <div class="review-body">
      ${review.content}
    </div>
    <div class="review-footer">
      <div class="review-votes">
        <button class="vote-button upvote">
          <i class="fas fa-thumbs-up"></i>
          <span class="vote-count helpful-count">${review.helpful}</span>
        </button>
        <button class="vote-button downvote">
          <i class="fas fa-thumbs-down"></i>
          <span class="vote-count unhelpful-count">${review.unhelpful}</span>
        </button>
      </div>
      <div class="review-flags">
        <button class="flag-button">
          <i class="fas fa-flag"></i>
        </button>
      </div>
    </div>
  `;
  
  // Add the review to the top of the list
  if (reviewsList.firstChild) {
    reviewsList.insertBefore(reviewCard, reviewsList.firstChild);
  } else {
    reviewsList.appendChild(reviewCard);
  }
  
  // Add highlighting animation
  reviewCard.style.backgroundColor = 'rgba(102, 192, 244, 0.2)';
  setTimeout(() => {
    reviewCard.style.transition = 'background-color 1.5s ease';
    reviewCard.style.backgroundColor = '';
  }, 100);
  
  // Add event listeners to the new review's vote buttons
  const voteButtons = reviewCard.querySelectorAll('.vote-button');
  voteButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const isUpvote = button.classList.contains('upvote');
      const reviewId = reviewCard.getAttribute('data-review-id');
      
      // Toggle voted class
      const wasVoted = button.classList.contains('voted');
      
      // Remove voted class from both buttons in the same review
      const allButtons = button.closest('.review-votes').querySelectorAll('.vote-button');
      allButtons.forEach(btn => btn.classList.remove('voted'));
      
      // If it wasn't already voted, add the voted class
      if (!wasVoted) {
        button.classList.add('voted');
      }
      
      // Update vote count
      updateReviewVotes(reviewId, isUpvote, !wasVoted);
    });
  });
  
  // Update the review count in the tab
  updateReviewCount();
}

/**
 * Update the review count in the reviews tab badge
 */
function updateReviewCount() {
  const reviewsList = document.querySelector('.tab-reviews .reviews-list');
  const reviewsTab = document.querySelector('.tabs-nav-item[data-tab="reviews"] .badge');
  
  if (reviewsList && reviewsTab) {
    const count = reviewsList.querySelectorAll('.review-card').length;
    reviewsTab.textContent = count;
  }
}

/**
 * Initialize functionality specific to the related content tab
 */
function initRelatedContentTab() {
  // Add hover effects for related game cards
  const relatedGameCards = document.querySelectorAll('.tab-related .related-game-card');
  
  relatedGameCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.querySelector('.related-game-image img').style.transform = 'scale(1.05)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.querySelector('.related-game-image img').style.transform = '';
    });
  });
}

/**
 * Show a notification message
 * @param {string} type - The type of notification ('success', 'error', 'info')
 * @param {string} message - The message to display
 */
function showNotification(type, message) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  const icon = type === 'success' ? 'check-circle' :
              type === 'error' ? 'exclamation-circle' : 
              'info-circle';
  
  notification.innerHTML = `
    <div class="notification-icon">
      <i class="fas fa-${icon}"></i>
    </div>
    <div class="notification-message">${message}</div>
    <button class="notification-close">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  // Add to notifications container or create one if it doesn't exist
  let notificationsContainer = document.querySelector('.notifications-container');
  
  if (!notificationsContainer) {
    notificationsContainer = document.createElement('div');
    notificationsContainer.className = 'notifications-container';
    document.body.appendChild(notificationsContainer);
  }
  
  notificationsContainer.appendChild(notification);
  
  // Show with animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Add close button event
  const closeButton = notification.querySelector('.notification-close');
  closeButton.addEventListener('click', () => {
    hideNotification(notification);
  });
  
  // Auto hide after 5 seconds
  setTimeout(() => {
    hideNotification(notification);
  }, 5000);
}

/**
 * Hide a notification
 * @param {HTMLElement} notification - The notification element to hide
 */
function hideNotification(notification) {
  notification.classList.add('hiding');
  
  notification.addEventListener('transitionend', () => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
      
      // Remove the container if it's empty
      const container = document.querySelector('.notifications-container');
      if (container && !container.hasChildNodes()) {
        container.parentNode.removeChild(container);
      }
    }
  });
}