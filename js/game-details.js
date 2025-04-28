/**
 * GameHub - Game Details Page
 * Handles the display and interaction for individual game details pages
 */

GameHub.gameDetails = {
    init: function() {
        // Get game ID from URL
        const urlParams = GameHub.utils.getUrlParams();
        const gameId = urlParams.id;
        
        if (!gameId) {
            // No game ID specified, redirect to home
            window.location.href = 'index.html';
            return;
        }
        
        // Load game data and render page
        this.loadGameData(gameId)
            .then(game => {
                if (game) {
                    this.renderGameDetails(game);
                    this.initEvents(game);
                    
                    // Load and display reviews
                    this.loadReviews(gameId);
                    
                    // Load similar games
                    this.loadSimilarGames(game);
                } else {
                    this.showGameNotFound();
                }
            })
            .catch(error => {
                console.error('Error loading game details:', error);
                this.showGameNotFound();
            });
    },
    
    loadGameData: function(gameId) {
        return new Promise((resolve) => {
            // In a real app, this would be an API call
            // For now, we'll use the mock data from window.gameData
            
            setTimeout(() => {
                // Get games from local storage or use the mock data
                const allGames = JSON.parse(localStorage.getItem('gameHubGames')) || window.gameData || [];
                const game = allGames.find(g => g.id === gameId);
                
                resolve(game);
            }, 300); // Simulate network delay
        });
    },
    
    renderGameDetails: function(game) {
        const container = document.querySelector('.game-details-container');
        if (!container) return;
        
        // Calculate actual price with discount
        const discountedPrice = game.discountPercent > 0 
            ? game.price * (1 - (game.discountPercent / 100))
            : game.price;
        
        // Update page title
        document.title = `${game.title} - GameHub`;
        
        // Prepare genre and tag links
        const genreLinks = game.genres.map(genre => 
            `<a href="search-results.html?genre=${encodeURIComponent(genre)}" class="genre-tag">${genre}</a>`
        ).join('');
        
        const tagLinks = game.tags.map(tag => 
            `<a href="search-results.html?tag=${encodeURIComponent(tag)}" class="game-tag">${tag}</a>`
        ).join('');
        
        const featureList = game.features.map(feature => 
            `<li class="feature-item">${feature}</li>`
        ).join('');
        
        // Generate screenshot gallery HTML
        const screenshotGallery = game.images.screenshots.map((screenshot, index) => `
            <div class="screenshot-thumbnail${index === 0 ? ' active' : ''}" data-index="${index}">
                <img src="${screenshot}" alt="${game.title} Screenshot ${index + 1}">
            </div>
        `).join('');
        
        // Main content HTML
        container.innerHTML = `
            <div class="game-header">
                <div class="game-header-bg" style="background-image: url('${game.images.header}')"></div>
                <div class="container">
                    <h1 class="game-title">${game.title}</h1>
                    <div class="game-developer-publisher">
                        <span>By <a href="search-results.html?developer=${encodeURIComponent(game.developer)}">${game.developer}</a></span>
                        <span class="separator">|</span>
                        <span>Published by <a href="search-results.html?publisher=${encodeURIComponent(game.publisher)}">${game.publisher}</a></span>
                    </div>
                </div>
            </div>
            
            <div class="container game-content">
                <div class="game-content-main">
                    <div class="game-media-container">
                        <div class="game-showcase">
                            <div class="main-media">
                                <img src="${game.images.screenshots[0]}" alt="${game.title}" class="active-screenshot">
                            </div>
                            <div class="screenshot-gallery">
                                ${screenshotGallery}
                            </div>
                        </div>
                    </div>
                    
                    <div class="game-description">
                        <h2>About This Game</h2>
                        <div class="description-text">
                            ${game.description}
                        </div>
                    </div>
                    
                    <div class="game-features">
                        <h2>Key Features</h2>
                        <ul class="features-list">
                            ${featureList}
                        </ul>
                    </div>
                    
                    <div class="game-system-requirements">
                        <h2>System Requirements</h2>
                        <div class="system-requirements-container">
                            <div class="requirements-column">
                                <h3>Minimum</h3>
                                <ul class="requirements-list">
                                    <li><strong>OS:</strong> ${game.systemRequirements.minimum.os}</li>
                                    <li><strong>Processor:</strong> ${game.systemRequirements.minimum.processor}</li>
                                    <li><strong>Memory:</strong> ${game.systemRequirements.minimum.memory}</li>
                                    <li><strong>Graphics:</strong> ${game.systemRequirements.minimum.graphics}</li>
                                    <li><strong>Storage:</strong> ${game.systemRequirements.minimum.storage}</li>
                                </ul>
                            </div>
                            <div class="requirements-column">
                                <h3>Recommended</h3>
                                <ul class="requirements-list">
                                    <li><strong>OS:</strong> ${game.systemRequirements.recommended.os}</li>
                                    <li><strong>Processor:</strong> ${game.systemRequirements.recommended.processor}</li>
                                    <li><strong>Memory:</strong> ${game.systemRequirements.recommended.memory}</li>
                                    <li><strong>Graphics:</strong> ${game.systemRequirements.recommended.graphics}</li>
                                    <li><strong>Storage:</strong> ${game.systemRequirements.recommended.storage}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="game-reviews-container">
                        <h2>User Reviews</h2>
                        <div class="reviews-summary">
                            <div class="rating-score">
                                <span class="score">${game.rating.toFixed(1)}</span>
                                <div class="rating-stars">
                                    ${this.generateStarRating(game.rating)}
                                </div>
                                <span class="review-count">${game.reviewCount} reviews</span>
                            </div>
                        </div>
                        <div class="reviews-list">
                            <div class="loading-spinner">Loading reviews...</div>
                        </div>
                        <div class="add-review">
                            <h3>Write a Review</h3>
                            <form class="review-form" id="reviewForm">
                                <div class="rating-input">
                                    <label>Your Rating:</label>
                                    <div class="star-rating">
                                        <input type="radio" id="star5" name="rating" value="5" /><label for="star5"></label>
                                        <input type="radio" id="star4" name="rating" value="4" /><label for="star4"></label>
                                        <input type="radio" id="star3" name="rating" value="3" /><label for="star3"></label>
                                        <input type="radio" id="star2" name="rating" value="2" /><label for="star2"></label>
                                        <input type="radio" id="star1" name="rating" value="1" /><label for="star1"></label>
                                    </div>
                                </div>
                                <div class="review-text-input">
                                    <label for="reviewText">Your Review:</label>
                                    <textarea id="reviewText" name="reviewText" rows="4" placeholder="Write your review here..."></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary">Submit Review</button>
                            </form>
                        </div>
                    </div>
                </div>
                
                <div class="game-content-sidebar">
                    <div class="game-purchase-box">
                        <div class="game-thumbnail">
                            <img src="${game.images.thumbnail}" alt="${game.title}">
                        </div>
                        <div class="game-pricing">
                            ${game.discountPercent > 0 ? `
                                <div class="discount-badge">-${game.discountPercent}%</div>
                                <div class="original-price">${GameHub.utils.formatPrice(game.price)}</div>
                                <div class="discounted-price">${GameHub.utils.formatPrice(discountedPrice)}</div>
                            ` : `
                                <div class="normal-price">${GameHub.utils.formatPrice(game.price)}</div>
                            `}
                        </div>
                        <div class="game-purchase-actions">
                            <button class="btn btn-primary btn-block add-to-cart-btn" data-game-id="${game.id}">
                                <i class="fa fa-shopping-cart"></i> Add to Cart
                            </button>
                            <button class="btn btn-secondary btn-block add-to-wishlist-btn" data-game-id="${game.id}">
                                <i class="fa fa-heart"></i> Add to Wishlist
                            </button>
                        </div>
                    </div>
                    
                    <div class="game-info-box">
                        <div class="release-date">
                            <strong>Release Date:</strong> ${GameHub.utils.formatDate(game.releaseDate)}
                        </div>
                        <div class="genres">
                            <strong>Genres:</strong>
                            <div class="genre-tags">${genreLinks}</div>
                        </div>
                        <div class="tags">
                            <strong>Tags:</strong>
                            <div class="game-tags">${tagLinks}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="container">
                <div class="similar-games">
                    <h2>Similar Games</h2>
                    <div class="similar-games-grid">
                        <div class="loading-spinner">Loading similar games...</div>
                    </div>
                </div>
            </div>
        `;
    },
    
    loadReviews: function(gameId) {
        const reviewsList = document.querySelector('.reviews-list');
        if (!reviewsList) return;
        
        // In a real app, this would be an API call
        // For now, we'll use the mock data
        setTimeout(() => {
            // Get reviews from mock data
            const allReviews = window.reviewData || [];
            const gameReviews = allReviews.filter(review => review.gameId === gameId);
            
            if (gameReviews.length === 0) {
                reviewsList.innerHTML = '<p class="no-reviews">No reviews yet. Be the first to review this game!</p>';
                return;
            }
            
            // Render reviews
            const reviewsHtml = gameReviews.map(review => {
                // Find the user
                const allUsers = window.userData || [];
                const user = allUsers.find(u => u.id === review.userId) || { 
                    username: 'Unknown User', 
                    avatar: 'img/avatars/default.jpg' 
                };
                
                return `
                    <div class="review-item">
                        <div class="review-user">
                            <img src="${user.avatar}" alt="${user.username}" class="user-avatar">
                            <div class="user-info">
                                <div class="username">${user.username}</div>
                                <div class="review-date">${GameHub.utils.formatDate(review.date)}</div>
                            </div>
                        </div>
                        <div class="review-content">
                            <div class="review-rating">
                                ${this.generateStarRating(review.rating)}
                                <span class="rating-value">${review.rating.toFixed(1)}</span>
                            </div>
                            <div class="review-text">${review.text}</div>
                            <div class="review-actions">
                                <button class="review-helpful-btn" data-review-id="${review.id}">
                                    <i class="fa fa-thumbs-up"></i> Helpful (${review.helpfulCount || 0})
                                </button>
                                <button class="review-report-btn" data-review-id="${review.id}">
                                    <i class="fa fa-flag"></i> Report
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
            
            reviewsList.innerHTML = reviewsHtml;
            
            // Add event listeners for review actions
            reviewsList.querySelectorAll('.review-helpful-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    btn.classList.toggle('active');
                    const currentCount = parseInt(btn.textContent.match(/\d+/)[0], 10);
                    const newCount = btn.classList.contains('active') ? currentCount + 1 : currentCount - 1;
                    btn.innerHTML = `<i class="fa fa-thumbs-up"></i> Helpful (${newCount})`;
                });
            });
        }, 500); // Simulate network delay
    },
    
    loadSimilarGames: function(game) {
        const similarGamesGrid = document.querySelector('.similar-games-grid');
        if (!similarGamesGrid) return;
        
        // In a real app, this would use a recommendation algorithm
        // For now, just show games with at least one matching genre or tag
        setTimeout(() => {
            const allGames = JSON.parse(localStorage.getItem('gameHubGames')) || window.gameData || [];
            
            // Find games with similar genres or tags
            const similarGames = allGames.filter(g => 
                g.id !== game.id && (
                    g.genres.some(genre => game.genres.includes(genre)) ||
                    g.tags.some(tag => game.tags.includes(tag))
                )
            ).slice(0, 4); // Limit to 4 games
            
            if (similarGames.length === 0) {
                similarGamesGrid.innerHTML = '<p class="no-similar-games">No similar games found.</p>';
                return;
            }
            
            // Render similar games
            similarGamesGrid.innerHTML = similarGames.map(similarGame => {
                // Calculate actual price with discount
                const discountedPrice = similarGame.discountPercent > 0 
                    ? similarGame.price * (1 - (similarGame.discountPercent / 100))
                    : similarGame.price;
                
                return `
                    <div class="game-card">
                        <a href="game-details.html?id=${similarGame.id}" class="game-card-link">
                            <div class="game-card-image">
                                <img src="${similarGame.images.thumbnail}" alt="${similarGame.title}">
                                ${similarGame.discountPercent > 0 ? `
                                    <div class="discount-badge">-${similarGame.discountPercent}%</div>
                                ` : ''}
                            </div>
                            <div class="game-card-content">
                                <h3 class="game-card-title">${similarGame.title}</h3>
                                <div class="game-card-price">
                                    ${similarGame.discountPercent > 0 ? `
                                        <span class="original-price">${GameHub.utils.formatPrice(similarGame.price)}</span>
                                        <span class="discounted-price">${GameHub.utils.formatPrice(discountedPrice)}</span>
                                    ` : `
                                        <span class="normal-price">${GameHub.utils.formatPrice(similarGame.price)}</span>
                                    `}
                                </div>
                            </div>
                        </a>
                        <button class="add-to-cart-btn" data-game-id="${similarGame.id}">
                            <i class="fa fa-cart-plus"></i>
                        </button>
                    </div>
                `;
            }).join('');
            
            // Add event listeners for Add to Cart buttons
            similarGamesGrid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const gameId = btn.dataset.gameId;
                    const game = allGames.find(g => g.id === gameId);
                    
                    if (game) {
                        // Calculate actual price with discount
                        const priceWithDiscount = game.discountPercent > 0 
                            ? game.price * (1 - (game.discountPercent / 100))
                            : game.price;
                            
                        GameHub.cart.addToCart(
                            game.id, 
                            game.title, 
                            priceWithDiscount, 
                            game.images.thumbnail
                        );
                    }
                });
            });
        }, 700); // Simulate network delay
    },
    
    initEvents: function(game) {
        // Screenshot gallery navigation
        const screenshotThumbnails = document.querySelectorAll('.screenshot-thumbnail');
        const activeScreenshot = document.querySelector('.active-screenshot');
        
        if (screenshotThumbnails.length > 0 && activeScreenshot) {
            screenshotThumbnails.forEach(thumbnail => {
                thumbnail.addEventListener('click', () => {
                    // Update active class
                    screenshotThumbnails.forEach(t => t.classList.remove('active'));
                    thumbnail.classList.add('active');
                    
                    // Update main image
                    const index = parseInt(thumbnail.dataset.index, 10);
                    activeScreenshot.src = game.images.screenshots[index];
                });
            });
        }
        
        // Add to cart button
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                // Calculate actual price with discount
                const priceWithDiscount = game.discountPercent > 0 
                    ? game.price * (1 - (game.discountPercent / 100))
                    : game.price;
                    
                GameHub.cart.addToCart(
                    game.id, 
                    game.title, 
                    priceWithDiscount, 
                    game.images.thumbnail
                );
            });
        }
        
        // Add to wishlist button
        const wishlistBtn = document.querySelector('.add-to-wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', () => {
                // In a real app, this would add to user's wishlist
                wishlistBtn.classList.toggle('wishlisted');
                
                if (wishlistBtn.classList.contains('wishlisted')) {
                    wishlistBtn.innerHTML = '<i class="fa fa-heart"></i> Wishlisted';
                    GameHub.utils.showNotification(`${game.title} added to your wishlist`, 'success');
                } else {
                    wishlistBtn.innerHTML = '<i class="fa fa-heart"></i> Add to Wishlist';
                    GameHub.utils.showNotification(`${game.title} removed from your wishlist`, 'info');
                }
            });
        }
        
        // Review form submission
        const reviewForm = document.getElementById('reviewForm');
        if (reviewForm) {
            reviewForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const ratingInput = reviewForm.querySelector('input[name="rating"]:checked');
                const reviewText = reviewForm.querySelector('#reviewText').value.trim();
                
                if (!ratingInput) {
                    GameHub.utils.showNotification('Please select a rating', 'error');
                    return;
                }
                
                if (!reviewText) {
                    GameHub.utils.showNotification('Please write a review', 'error');
                    return;
                }
                
                // In a real app, this would submit to an API
                GameHub.utils.showNotification('Your review has been submitted', 'success');
                
                // Reset form
                reviewForm.reset();
                
                // Refresh reviews (in a real app this would fetch from server)
                this.loadReviews(game.id);
            });
        }
    },
    
    showGameNotFound: function() {
        const container = document.querySelector('.game-details-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="container">
                <div class="game-not-found">
                    <h1>Game Not Found</h1>
                    <p>The game you're looking for doesn't exist or has been removed.</p>
                    <a href="index.html" class="btn btn-primary">Return to Home</a>
                </div>
            </div>
        `;
    },
    
    generateStarRating: function(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        let starsHtml = '';
        
        // Add full stars
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fa fa-star"></i>';
        }
        
        // Add half star if needed
        if (halfStar) {
            starsHtml += '<i class="fa fa-star-half-o"></i>';
        }
        
        // Add empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="fa fa-star-o"></i>';
        }
        
        return starsHtml;
    }
};