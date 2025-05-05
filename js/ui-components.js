/**
 * GameHub - UI Components
 * Reusable UI components for the GameHub application
 */

const UIComponents = {
    /**
     * Create a game card element
     * @param {Object} game - Game data object
     * @param {string} size - Card size ('small', 'medium', 'large')
     * @param {boolean} showPrice - Whether to show price information
     * @return {HTMLElement} - Game card element
     */
    createGameCard: function(game, size = 'medium', showPrice = true) {
        const card = document.createElement('div');
        card.className = `game-card game-card-${size}`;
        card.dataset.gameId = game.id;
        
        // Calculate discounted price if on sale
        const actualPrice = GameData.getGamePrice(game);
        const isOnSale = game.discountPercent > 0;
        const priceFormatted = Utils.formatCurrency(actualPrice, 'USD');
        const originalPriceFormatted = Utils.formatCurrency(game.price, 'USD');
        
        // Create special tags display (New, Popular, On Sale)
        let tagHtml = '';
        if (game.isNew) {
            tagHtml += '<span class="game-tag tag-new">New</span>';
        }
        if (game.isPopular) {
            tagHtml += '<span class="game-tag tag-popular">Popular</span>';
        }
        if (isOnSale) {
            tagHtml += `<span class="game-tag tag-discount">-${game.discountPercent}%</span>`;
        }
        
        // Construct card HTML based on size
        if (size === 'small') {
            card.innerHTML = `
                <a href="game-details.html?id=${game.id}" class="game-card-link">
                    <div class="game-card-image">
                        <img src="${game.images.thumbnail}" alt="${game.title}" loading="lazy">
                        <div class="game-tags">${tagHtml}</div>
                    </div>
                    <div class="game-card-content">
                        <h3 class="game-title">${game.title}</h3>
                        ${showPrice ? `
                            <div class="game-price ${isOnSale ? 'game-price-discount' : ''}">
                                ${isOnSale ? `<span class="original-price">${originalPriceFormatted}</span>` : ''}
                                <span class="current-price">${priceFormatted}</span>
                            </div>
                        ` : ''}
                    </div>
                </a>
            `;
        } else if (size === 'large') {
            // Truncate description for large cards
            const shortDesc = Utils.truncateString(game.description, 150);
            
            card.innerHTML = `
                <a href="game-details.html?id=${game.id}" class="game-card-link">
                    <div class="game-card-image">
                        <img src="${game.images.header}" alt="${game.title}" loading="lazy">
                        <div class="game-tags">${tagHtml}</div>
                    </div>
                    <div class="game-card-content">
                        <h3 class="game-title">${game.title}</h3>
                        <p class="game-description">${shortDesc}</p>
                        <div class="game-meta">
                            <span class="game-developer">${game.developer}</span>
                            <span class="game-rating">
                                <i class="fas fa-star"></i> ${game.rating.toFixed(1)}
                            </span>
                        </div>
                        ${showPrice ? `
                            <div class="game-price ${isOnSale ? 'game-price-discount' : ''}">
                                ${isOnSale ? `<span class="original-price">${originalPriceFormatted}</span>` : ''}
                                <span class="current-price">${priceFormatted}</span>
                            </div>
                        ` : ''}
                    </div>
                </a>
                <div class="game-card-actions">
                    <button class="btn btn-wishlist" data-game-id="${game.id}" title="Add to wishlist">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="btn btn-cart" data-game-id="${game.id}" title="Add to cart">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            `;
        } else { // medium (default)
            card.innerHTML = `
                <a href="game-details.html?id=${game.id}" class="game-card-link">
                    <div class="game-card-image">
                        <img src="${game.images.thumbnail}" alt="${game.title}" loading="lazy">
                        <div class="game-tags">${tagHtml}</div>
                    </div>
                    <div class="game-card-content">
                        <h3 class="game-title">${game.title}</h3>
                        <div class="game-meta">
                            <span class="game-developer">${game.developer}</span>
                        </div>
                        ${showPrice ? `
                            <div class="game-price ${isOnSale ? 'game-price-discount' : ''}">
                                ${isOnSale ? `<span class="original-price">${originalPriceFormatted}</span>` : ''}
                                <span class="current-price">${priceFormatted}</span>
                            </div>
                        ` : ''}
                    </div>
                </a>
                <div class="game-card-actions">
                    <button class="btn btn-wishlist" data-game-id="${game.id}" title="Add to wishlist">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="btn btn-cart" data-game-id="${game.id}" title="Add to cart">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            `;
        }
        
        // Add event listeners to action buttons
        this.addGameCardEventListeners(card);
        
        return card;
    },
    
    /**
     * Add event listeners to game card elements
     * @param {HTMLElement} cardElement - Game card element
     */
    addGameCardEventListeners: function(cardElement) {
        // Get action buttons
        const wishlistBtn = cardElement.querySelector('.btn-wishlist');
        const cartBtn = cardElement.querySelector('.btn-cart');
        
        // Add to wishlist button event
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                
                const gameId = this.dataset.gameId;
                if (UserData.isLoggedIn) {
                    // Check if the game is in the wishlist already
                    const isInWishlist = UserData.currentUser.wishlist.includes(gameId);
                    
                    if (isInWishlist) {
                        const result = UserData.removeFromWishlist(gameId);
                        if (result.success) {
                            this.classList.remove('active');
                            UIComponents.showNotification('Game removed from wishlist', 'success');
                        }
                    } else {
                        const result = UserData.addToWishlist(gameId);
                        if (result.success) {
                            this.classList.add('active');
                            UIComponents.showNotification('Game added to wishlist', 'success');
                        } else {
                            UIComponents.showNotification(result.message, 'error');
                        }
                    }
                } else {
                    UIComponents.showLoginModal('Please log in to add games to your wishlist');
                }
            });
            
            // Update wishlist button visual state based on user data
            if (UserData.isLoggedIn && UserData.currentUser.wishlist.includes(wishlistBtn.dataset.gameId)) {
                wishlistBtn.classList.add('active');
            }
        }
        
        // Add to cart button event
        if (cartBtn) {
            cartBtn.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                
                const gameId = this.dataset.gameId;
                if (UserData.isLoggedIn) {
                    // Check if the game is in the cart or owned already
                    const isInCart = UserData.currentUser.cart.includes(gameId);
                    const isOwned = UserData.currentUser.ownedGames.includes(gameId);
                    
                    if (isInCart) {
                        UIComponents.showNotification('Game is already in your cart', 'info');
                    } else if (isOwned) {
                        UIComponents.showNotification('You already own this game', 'info');
                    } else {
                        const result = UserData.addToCart(gameId);
                        if (result.success) {
                            this.classList.add('active');
                            UIComponents.showNotification('Game added to cart', 'success');
                            UIComponents.updateCartCounter();
                        } else {
                            UIComponents.showNotification(result.message, 'error');
                        }
                    }
                } else {
                    UIComponents.showLoginModal('Please log in to add games to your cart');
                }
            });
            
            // Update cart button visual state based on user data
            if (UserData.isLoggedIn) {
                if (UserData.currentUser.cart.includes(cartBtn.dataset.gameId)) {
                    cartBtn.classList.add('active');
                    cartBtn.title = 'Game is in your cart';
                } else if (UserData.currentUser.ownedGames.includes(cartBtn.dataset.gameId)) {
                    cartBtn.classList.add('owned');
                    cartBtn.disabled = true;
                    cartBtn.title = 'You own this game';
                    cartBtn.innerHTML = '<i class="fas fa-check"></i>';
                }
            }
        }
    },
    
    /**
     * Create a game grid with filtering and sorting controls
     * @param {string} containerId - ID of container element
     * @param {Array} games - Array of game objects
     * @param {Object} options - Configuration options
     */
    createGameGrid: function(containerId, games, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const defaultOptions = {
            cardSize: 'medium',
            showFilters: true,
            showSorting: true,
            showPrice: true,
            columns: {
                mobile: 1,
                tablet: 2,
                desktop: 4
            }
        };
        
        // Merge default options with provided options
        const config = { ...defaultOptions, ...options };
        
        // Create grid container
        const gridContainer = document.createElement('div');
        gridContainer.className = 'game-grid-container';
        
        // Add filter and sort controls if enabled
        if (config.showFilters || config.showSorting) {
            const controlsDiv = document.createElement('div');
            controlsDiv.className = 'game-grid-controls';
            
            // Add filtering controls
            if (config.showFilters) {
                const filtersDiv = document.createElement('div');
                filtersDiv.className = 'game-filters';
                
                // Get unique genres and tags
                const genres = GameData.getAllGenres();
                
                // Create genre filter
                const genreSelect = document.createElement('select');
                genreSelect.className = 'filter-select';
                genreSelect.id = `${containerId}-genre-filter`;
                
                genreSelect.innerHTML = `
                    <option value="">All Genres</option>
                    ${genres.map(genre => `<option value="${genre}">${genre}</option>`).join('')}
                `;
                
                // Create price range filter
                const priceRangeDiv = document.createElement('div');
                priceRangeDiv.className = 'price-range-filter';
                priceRangeDiv.innerHTML = `
                    <label>Price Range:</label>
                    <div class="price-inputs">
                        <input type="number" id="${containerId}-min-price" placeholder="Min" min="0" step="5">
                        <span>-</span>
                        <input type="number" id="${containerId}-max-price" placeholder="Max" min="0" step="5">
                    </div>
                `;
                
                // Create filter for on sale items
                const onSaleCheckbox = document.createElement('div');
                onSaleCheckbox.className = 'filter-checkbox';
                onSaleCheckbox.innerHTML = `
                    <label>
                        <input type="checkbox" id="${containerId}-on-sale-filter">
                        On Sale
                    </label>
                `;
                
                // Add filter elements to filters div
                filtersDiv.appendChild(genreSelect);
                filtersDiv.appendChild(priceRangeDiv);
                filtersDiv.appendChild(onSaleCheckbox);
                
                // Add filters to controls
                controlsDiv.appendChild(filtersDiv);
            }
            
            // Add sorting controls
            if (config.showSorting) {
                const sortingDiv = document.createElement('div');
                sortingDiv.className = 'game-sorting';
                
                // Create sort by select
                const sortSelect = document.createElement('select');
                sortSelect.className = 'sort-select';
                sortSelect.id = `${containerId}-sort`;
                
                sortSelect.innerHTML = `
                    <option value="releaseDate">Release Date</option>
                    <option value="title">Title</option>
                    <option value="price">Price</option>
                    <option value="rating">Rating</option>
                `;
                
                // Create sort direction toggle
                const sortDirButton = document.createElement('button');
                sortDirButton.className = 'sort-direction-btn';
                sortDirButton.id = `${containerId}-sort-dir`;
                sortDirButton.innerHTML = '<i class="fas fa-sort-down"></i>';
                sortDirButton.title = 'Sort Descending';
                sortDirButton.dataset.direction = 'desc';
                
                // Add sort elements to sorting div
                sortingDiv.appendChild(document.createTextNode('Sort By: '));
                sortingDiv.appendChild(sortSelect);
                sortingDiv.appendChild(sortDirButton);
                
                // Add sorting to controls
                controlsDiv.appendChild(sortingDiv);
            }
            
            // Add controls to container
            gridContainer.appendChild(controlsDiv);
        }
        
        // Create the game grid
        const gameGrid = document.createElement('div');
        gameGrid.className = 'game-grid';
        gameGrid.style.setProperty('--grid-columns-mobile', config.columns.mobile);
        gameGrid.style.setProperty('--grid-columns-tablet', config.columns.tablet);
        gameGrid.style.setProperty('--grid-columns-desktop', config.columns.desktop);
        
        // Add game cards to grid
        this.renderGameCards(gameGrid, games, config.cardSize, config.showPrice);
        
        // Add grid to container
        gridContainer.appendChild(gameGrid);
        
        // Add everything to the main container
        container.appendChild(gridContainer);
        
        // Set up event listeners for filtering and sorting
        if (config.showFilters || config.showSorting) {
            this.setupGridControls(containerId, games, gameGrid, config);
        }
    },
    
    /**
     * Render game cards into a grid
     * @param {HTMLElement} gridContainer - Grid container element
     * @param {Array} games - Array of game objects
     * @param {string} cardSize - Card size
     * @param {boolean} showPrice - Whether to show price
     */
    renderGameCards: function(gridContainer, games, cardSize, showPrice) {
        // Clear existing content
        gridContainer.innerHTML = '';
        
        if (games.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = 'No games found matching your criteria.';
            gridContainer.appendChild(noResults);
            return;
        }
        
        // Add each game card to the grid
        games.forEach(game => {
            const card = this.createGameCard(game, cardSize, showPrice);
            gridContainer.appendChild(card);
        });
    },
    
    /**
     * Set up event listeners for grid filtering and sorting
     * @param {string} containerId - ID of container element
     * @param {Array} games - Array of game objects
     * @param {HTMLElement} gridElement - Grid element
     * @param {Object} config - Configuration options
     */
    setupGridControls: function(containerId, games, gridElement, config) {
        // Get filter elements if they exist
        const genreFilter = document.getElementById(`${containerId}-genre-filter`);
        const minPriceInput = document.getElementById(`${containerId}-min-price`);
        const maxPriceInput = document.getElementById(`${containerId}-max-price`);
        const onSaleFilter = document.getElementById(`${containerId}-on-sale-filter`);
        
        // Get sort elements if they exist
        const sortSelect = document.getElementById(`${containerId}-sort`);
        const sortDirButton = document.getElementById(`${containerId}-sort-dir`);
        
        // Function to apply filters and sorting
        const updateGrid = () => {
            // Start with all games
            let filteredGames = [...games];
            
            // Apply filters if they exist
            if (genreFilter && genreFilter.value) {
                filteredGames = filteredGames.filter(game => 
                    game.genres.some(genre => genre === genreFilter.value)
                );
            }
            
            if (minPriceInput && minPriceInput.value !== '') {
                const minPrice = parseFloat(minPriceInput.value);
                filteredGames = filteredGames.filter(game => 
                    GameData.getGamePrice(game) >= minPrice
                );
            }
            
            if (maxPriceInput && maxPriceInput.value !== '') {
                const maxPrice = parseFloat(maxPriceInput.value);
                filteredGames = filteredGames.filter(game => 
                    GameData.getGamePrice(game) <= maxPrice
                );
            }
            
            if (onSaleFilter && onSaleFilter.checked) {
                filteredGames = filteredGames.filter(game => game.discountPercent > 0);
            }
            
            // Apply sorting if sort controls exist
            if (sortSelect) {
                const sortBy = sortSelect.value;
                const ascending = sortDirButton ? sortDirButton.dataset.direction === 'asc' : false;
                
                filteredGames = GameData.sortGames(filteredGames, sortBy, ascending);
            }
            
            // Re-render the grid with filtered and sorted games
            this.renderGameCards(gridElement, filteredGames, config.cardSize, config.showPrice);
        };
        
        // Set up event listeners for all controls
        if (genreFilter) {
            genreFilter.addEventListener('change', updateGrid);
        }
        
        if (minPriceInput) {
            minPriceInput.addEventListener('input', Utils.debounce(updateGrid, 300));
        }
        
        if (maxPriceInput) {
            maxPriceInput.addEventListener('input', Utils.debounce(updateGrid, 300));
        }
        
        if (onSaleFilter) {
            onSaleFilter.addEventListener('change', updateGrid);
        }
        
        if (sortSelect) {
            sortSelect.addEventListener('change', updateGrid);
        }
        
        if (sortDirButton) {
            sortDirButton.addEventListener('click', function() {
                // Toggle direction
                if (this.dataset.direction === 'desc') {
                    this.dataset.direction = 'asc';
                    this.innerHTML = '<i class="fas fa-sort-up"></i>';
                    this.title = 'Sort Ascending';
                } else {
                    this.dataset.direction = 'desc';
                    this.innerHTML = '<i class="fas fa-sort-down"></i>';
                    this.title = 'Sort Descending';
                }
                
                updateGrid();
            });
        }
    },
    
    /**
     * Create a game carousel for featured games
     * @param {string} containerId - ID of container element
     * @param {Array} games - Array of game objects
     * @param {Object} options - Configuration options
     */
    createGameCarousel: function(containerId, games, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const defaultOptions = {
            cardSize: 'medium',
            showPrice: true,
            autoplay: true,
            autoplaySpeed: 5000,
            slidesToShow: 1
        };
        
        // Merge default options with provided options
        const config = { ...defaultOptions, ...options };
        
        // Create carousel container
        const carouselContainer = document.createElement('div');
        carouselContainer.className = 'game-carousel';
        carouselContainer.id = `${containerId}-carousel`;
        
        // Create slides container
        const slidesContainer = document.createElement('div');
        slidesContainer.className = 'carousel-slides';
        
        // Add game slides
        games.forEach((game, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.dataset.index = index;
            
            if (config.cardSize === 'hero') {
                // Hero style for featured games
                slide.innerHTML = `
                    <div class="hero-slide" style="background-image: url('${game.images.header}');">
                        <div class="hero-content">
                            <img src="${game.images.logo}" alt="${game.title}" class="hero-logo">
                            <div class="hero-details">
                                <p class="hero-description">${Utils.truncateString(game.description, 200)}</p>
                                <div class="hero-meta">
                                    <span class="game-developer">${game.developer}</span>
                                    <span class="game-genres">${game.genres.join(', ')}</span>
                                </div>
                                ${config.showPrice ? `
                                    <div class="game-price ${game.discountPercent > 0 ? 'game-price-discount' : ''}">
                                        ${game.discountPercent > 0 ? 
                                            `<span class="original-price">${Utils.formatCurrency(game.price, 'USD')}</span>` : 
                                            ''}
                                        <span class="current-price">${Utils.formatCurrency(GameData.getGamePrice(game), 'USD')}</span>
                                    </div>
                                ` : ''}
                                <div class="hero-actions">
                                    <a href="game-details.html?id=${game.id}" class="btn btn-primary">View Details</a>
                                    <button class="btn btn-secondary btn-cart" data-game-id="${game.id}">
                                        <i class="fas fa-shopping-cart"></i> Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                // Regular card in carousel
                slide.appendChild(this.createGameCard(game, config.cardSize, config.showPrice));
            }
            
            slidesContainer.appendChild(slide);
        });
        
        // Add slides to carousel
        carouselContainer.appendChild(slidesContainer);
        
        // Create carousel controls
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'carousel-controls';
        
        // Create prev/next buttons
        const prevButton = document.createElement('button');
        prevButton.className = 'carousel-prev';
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevButton.setAttribute('aria-label', 'Previous slide');
        
        const nextButton = document.createElement('button');
        nextButton.className = 'carousel-next';
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextButton.setAttribute('aria-label', 'Next slide');
        
        // Create indicators
        const indicators = document.createElement('div');
        indicators.className = 'carousel-indicators';
        
        for (let i = 0; i < games.length; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'carousel-indicator';
            indicator.dataset.slideIndex = i;
            if (i === 0) indicator.classList.add('active');
            indicators.appendChild(indicator);
        }
        
        // Add controls to container
        controlsContainer.appendChild(prevButton);
        controlsContainer.appendChild(indicators);
        controlsContainer.appendChild(nextButton);
        
        // Add controls to carousel
        carouselContainer.appendChild(controlsContainer);
        
        // Add carousel to container
        container.appendChild(carouselContainer);
        
        // Initialize carousel functionality
        this.initializeCarousel(`${containerId}-carousel`, config);
    },
    
    /**
     * Initialize carousel functionality
     * @param {string} carouselId - ID of carousel element
     * @param {Object} config - Configuration options
     */
    initializeCarousel: function(carouselId, config) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;
        
        const slidesContainer = carousel.querySelector('.carousel-slides');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevButton = carousel.querySelector('.carousel-prev');
        const nextButton = carousel.querySelector('.carousel-next');
        const indicators = carousel.querySelectorAll('.carousel-indicator');
        
        let currentIndex = 0;
        let autoplayInterval;
        
        // Function to go to a specific slide
        const goToSlide = (index) => {
            // Handle index bounds
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            
            // Update current index
            currentIndex = index;
            
            // Move slides container
            slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update indicators
            indicators.forEach((indicator, i) => {
                if (i === currentIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        };
        
        // Set up click handlers for prev/next buttons
        prevButton.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
            resetAutoplay();
        });
        
        nextButton.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
            resetAutoplay();
        });
        
        // Set up click handlers for indicators
        indicators.forEach((indicator) => {
            indicator.addEventListener('click', () => {
                goToSlide(parseInt(indicator.dataset.slideIndex));
                resetAutoplay();
            });
        });
        
        // Set up autoplay if enabled
        const startAutoplay = () => {
            if (config.autoplay) {
                autoplayInterval = setInterval(() => {
                    goToSlide(currentIndex + 1);
                }, config.autoplaySpeed);
            }
        };
        
        const resetAutoplay = () => {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
                startAutoplay();
            }
        };
        
        // Initialize carousel
        goToSlide(0);
        startAutoplay();
        
        // Pause autoplay on hover
        carousel.addEventListener('mouseenter', () => {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
            }
        });
        
        carousel.addEventListener('mouseleave', () => {
            startAutoplay();
        });
    },
    
    /**
     * Create a modal dialog
     * @param {string} id - Modal ID
     * @param {string} title - Modal title
     * @param {string} content - Modal content
     * @param {Object} options - Configuration options
     * @return {HTMLElement} - Modal element
     */
    createModal: function(id, title, content, options = {}) {
        // Remove existing modal with same ID if it exists
        const existingModal = document.getElementById(id);
        if (existingModal) {
            existingModal.remove();
        }
        
        const defaultOptions = {
            size: 'medium', // small, medium, large
            showClose: true,
            closeOnOverlayClick: true,
            buttons: []
        };
        
        // Merge default options with provided options
        const config = { ...defaultOptions, ...options };
        
        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal-container';
        modalContainer.id = id;
        modalContainer.setAttribute('aria-modal', 'true');
        modalContainer.setAttribute('role', 'dialog');
        
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = `modal-content modal-${config.size}`;
        
        // Create modal header
        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';
        
        const modalTitle = document.createElement('h2');
        modalTitle.className = 'modal-title';
        modalTitle.textContent = title;
        
        modalHeader.appendChild(modalTitle);
        
        // Add close button if enabled
        if (config.showClose) {
            const closeButton = document.createElement('button');
            closeButton.className = 'modal-close';
            closeButton.innerHTML = '&times;';
            closeButton.setAttribute('aria-label', 'Close modal');
            
            closeButton.addEventListener('click', () => {
                this.closeModal(id);
            });
            
            modalHeader.appendChild(closeButton);
        }
        
        // Create modal body
        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body';
        
        // Add content to modal body
        if (typeof content === 'string') {
            modalBody.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            modalBody.appendChild(content);
        }
        
        // Create modal footer if buttons are provided
        const modalFooter = document.createElement('div');
        modalFooter.className = 'modal-footer';
        
        if (config.buttons && config.buttons.length > 0) {
            config.buttons.forEach(button => {
                const btn = document.createElement('button');
                btn.className = `btn ${button.className || ''}`;
                btn.textContent = button.text;
                
                if (button.id) {
                    btn.id = button.id;
                }
                
                if (button.onClick) {
                    btn.addEventListener('click', (e) => {
                        button.onClick(e);
                    });
                }
                
                if (button.closeModal) {
                    btn.addEventListener('click', () => {
                        this.closeModal(id);
                    });
                }
                
                modalFooter.appendChild(btn);
            });
        }
        
        // Assemble modal content
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        
        if (config.buttons && config.buttons.length > 0) {
            modalContent.appendChild(modalFooter);
        }
        
        // Add event listener to close modal when clicking overlay
        if (config.closeOnOverlayClick) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeModal(id);
                }
            });
        }
        
        // Assemble modal container
        modalContainer.appendChild(overlay);
        modalContainer.appendChild(modalContent);
        
        // Add modal to document
        document.body.appendChild(modalContainer);
        
        // Return modal element
        return modalContainer;
    },
    
    /**
     * Open a modal dialog
     * @param {string} id - Modal ID
     */
    openModal: function(id) {
        const modal = document.getElementById(id);
        if (!modal) return;
        
        // Add active class to show modal
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        
        // Focus the first focusable element
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
        
        // Trap focus within modal
        modal.addEventListener('keydown', this.trapFocus);
    },
    
    /**
     * Close a modal dialog
     * @param {string} id - Modal ID
     */
    closeModal: function(id) {
        const modal = document.getElementById(id);
        if (!modal) return;
        
        // Remove active class to hide modal
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        
        // Remove keyboard trap
        modal.removeEventListener('keydown', this.trapFocus);
    },
    
    /**
     * Trap focus within modal for accessibility
     * @param {Event} e - Keyboard event
     */
    trapFocus: function(e) {
        if (e.key !== 'Tab') return;
        
        const modal = e.currentTarget;
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // If shift + tab pressed and first element is active, move to last element
        if (e.shiftKey && document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
        }
        // If tab pressed and last element is active, move to first element
        else if (!e.shiftKey && document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
        }
    },
    
    /**
     * Show a login modal
     * @param {string} message - Optional message to display
     */
    showLoginModal: function(message = '') {
        // Create login form
        const loginForm = document.createElement('div');
        loginForm.className = 'login-form';
        
        loginForm.innerHTML = `
            ${message ? `<p class="login-message">${message}</p>` : ''}
            <form id="modal-login-form">
                <div class="form-group">
                    <label for="login-username">Username or Email</label>
                    <input type="text" id="login-username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="login-password">Password</label>
                    <input type="password" id="login-password" name="password" required>
                </div>
                <div class="form-group checkbox">
                    <label>
                        <input type="checkbox" id="login-remember" name="remember">
                        Remember me
                    </label>
                </div>
                <div class="form-error" id="login-error"></div>
            </form>
            <p class="modal-switch-text">
                Don't have an account? <a href="#" id="switch-to-register">Register</a>
            </p>
        `;
        
        // Create modal with login form
        const modal = this.createModal('login-modal', 'Login to Your Account', loginForm, {
            size: 'small',
            buttons: [
                {
                    text: 'Login',
                    className: 'btn-primary',
                    onClick: () => {
                        const username = document.getElementById('login-username').value;
                        const password = document.getElementById('login-password').value;
                        const remember = document.getElementById('login-remember').checked;
                        
                        if (!username || !password) {
                            document.getElementById('login-error').textContent = 'Please enter your username and password';
                            return;
                        }
                        
                        const result = UserData.login(username, password, remember);
                        
                        if (result.success) {
                            this.closeModal('login-modal');
                            this.showNotification('You have successfully logged in', 'success');
                        } else {
                            document.getElementById('login-error').textContent = result.message;
                        }
                    }
                },
                {
                    text: 'Cancel',
                    className: 'btn-secondary',
                    closeModal: true
                }
            ]
        });
        
        // Add event listener to switch to register form
        const switchLink = document.getElementById('switch-to-register');
        switchLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.closeModal('login-modal');
            this.showRegisterModal();
        });
        
        // Open modal
        this.openModal('login-modal');
    },
    
    /**
     * Show a registration modal
     */
    showRegisterModal: function() {
        // Create registration form
        const registerForm = document.createElement('div');
        registerForm.className = 'register-form';
        
        registerForm.innerHTML = `
            <form id="modal-register-form">
                <div class="form-group">
                    <label for="register-username">Username</label>
                    <input type="text" id="register-username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="register-email">Email</label>
                    <input type="email" id="register-email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="register-display-name">Display Name</label>
                    <input type="text" id="register-display-name" name="displayName">
                </div>
                <div class="form-group">
                    <label for="register-password">Password</label>
                    <input type="password" id="register-password" name="password" required>
                </div>
                <div class="form-group">
                    <label for="register-confirm-password">Confirm Password</label>
                    <input type="password" id="register-confirm-password" name="confirmPassword" required>
                </div>
                <div class="form-error" id="register-error"></div>
            </form>
            <p class="modal-switch-text">
                Already have an account? <a href="#" id="switch-to-login">Login</a>
            </p>
        `;
        
        // Create modal with registration form
        const modal = this.createModal('register-modal', 'Create an Account', registerForm, {
            size: 'small',
            buttons: [
                {
                    text: 'Register',
                    className: 'btn-primary',
                    onClick: () => {
                        const username = document.getElementById('register-username').value;
                        const email = document.getElementById('register-email').value;
                        const displayName = document.getElementById('register-display-name').value || username;
                        const password = document.getElementById('register-password').value;
                        const confirmPassword = document.getElementById('register-confirm-password').value;
                        
                        // Validate form
                        if (!username || !email || !password) {
                            document.getElementById('register-error').textContent = 'Please fill out all required fields';
                            return;
                        }
                        
                        if (password !== confirmPassword) {
                            document.getElementById('register-error').textContent = 'Passwords do not match';
                            return;
                        }
                        
                        if (!Utils.isValidEmail(email)) {
                            document.getElementById('register-error').textContent = 'Please enter a valid email address';
                            return;
                        }
                        
                        const result = UserData.register({
                            username,
                            email,
                            displayName,
                            password
                        });
                        
                        if (result.success) {
                            this.closeModal('register-modal');
                            this.showNotification('Account created successfully', 'success');
                        } else {
                            document.getElementById('register-error').textContent = result.message;
                        }
                    }
                },
                {
                    text: 'Cancel',
                    className: 'btn-secondary',
                    closeModal: true
                }
            ]
        });
        
        // Add event listener to switch to login form
        const switchLink = document.getElementById('switch-to-login');
        switchLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.closeModal('register-modal');
            this.showLoginModal();
        });
        
        // Open modal
        this.openModal('register-modal');
    },
    
    /**
     * Show a notification message
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, info, warning)
     * @param {number} duration - Duration in milliseconds
     */
    showNotification: function(message, type = 'info', duration = 3000) {
        // Create notification container if it doesn't exist
        let notificationContainer = document.getElementById('notification-container');
        
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notification-container';
            document.body.appendChild(notificationContainer);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // Add notification content
        notification.innerHTML = `
            <div class="notification-content">
                <i class="notification-icon fas ${this.getNotificationIcon(type)}"></i>
                <p class="notification-message">${message}</p>
            </div>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        `;
        
        // Add notification to container
        notificationContainer.appendChild(notification);
        
        // Add show class after a short delay for animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Set up close button
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            this.closeNotification(notification);
        });
        
        // Auto close after duration
        setTimeout(() => {
            this.closeNotification(notification);
        }, duration);
        
        return notification;
    },
    
    /**
     * Close a notification
     * @param {HTMLElement} notification - Notification element
     */
    closeNotification: function(notification) {
        // Remove show class for animation
        notification.classList.remove('show');
        
        // Remove element after animation completes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    },
    
    /**
     * Get icon class for notification type
     * @param {string} type - Notification type
     * @return {string} - Icon class
     */
    getNotificationIcon: function(type) {
        switch (type) {
            case 'success':
                return 'fa-check-circle';
            case 'error':
                return 'fa-exclamation-circle';
            case 'warning':
                return 'fa-exclamation-triangle';
            case 'info':
            default:
                return 'fa-info-circle';
        }
    },
    
    /**
     * Update cart counter in the header
     */
    updateCartCounter: function() {
        const cartCounters = document.querySelectorAll('.cart-counter');
        
        cartCounters.forEach(counter => {
            if (UserData.isLoggedIn && UserData.currentUser.cart.length > 0) {
                counter.textContent = UserData.currentUser.cart.length;
                counter.classList.add('active');
            } else {
                counter.textContent = '0';
                counter.classList.remove('active');
            }
        });
    },
    
    /**
     * Initialize UI components
     */
    init: function() {
        // Update cart counter
        this.updateCartCounter();
        
        // Initialize login/register buttons
        const loginButtons = document.querySelectorAll('.login-button');
        loginButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginModal();
            });
        });
        
        const registerButtons = document.querySelectorAll('.register-button');
        registerButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.showRegisterModal();
            });
        });
        
        const logoutButtons = document.querySelectorAll('.logout-button');
        logoutButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                UserData.logout();
                this.showNotification('You have been logged out', 'info');
            });
        });
    }
};

/**
 * Enhanced Game Card Component
 * Adds better accessibility features to game cards
 */

function enhanceGameCardAccessibility() {
    // Select all game cards
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach((card, index) => {
        // Give each card a unique ID if it doesn't have one
        if (!card.id) {
            card.id = `game-card-${index}`;
        }
        
        // Add appropriate role
        card.setAttribute('role', 'article');
        
        // Make the entire card keyboard focusable if it doesn't have a focusable child
        const hasLinkOrButton = card.querySelector('a, button');
        if (!hasLinkOrButton) {
            card.setAttribute('tabindex', '0');
            
            // Add keyboard event to trigger click on Enter or Space
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    // Find the game title and use it for the link, or default to details page
                    const gameTitle = card.querySelector('.game-title');
                    if (gameTitle) {
                        window.location.href = `pages/game-details.html?game=${encodeURIComponent(gameTitle.textContent)}`;
                    }
                }
            });
        }
        
        // Improve image alt text
        const image = card.querySelector('img');
        if (image && (!image.alt || image.alt === 'Game title')) {
            const gameTitle = card.querySelector('.game-title');
            if (gameTitle) {
                image.alt = `${gameTitle.textContent} cover art`;
            }
        }
        
        // Add price information for screen readers
        const priceElement = card.querySelector('.price, .sale-price');
        if (priceElement) {
            const originalPrice = card.querySelector('.original-price');
            if (originalPrice) {
                // For sale items, make the discount information clear to screen readers
                const discountBadge = card.querySelector('.discount-badge');
                if (discountBadge) {
                    const srPriceInfo = document.createElement('span');
                    srPriceInfo.className = 'sr-only';
                    srPriceInfo.textContent = `Original price ${originalPrice.textContent}, now ${priceElement.textContent}. ${discountBadge.textContent} off.`;
                    priceElement.parentNode.appendChild(srPriceInfo);
                }
            }
        }
        
        // Add New Release info for screen readers
        const newBadge = card.querySelector('.new-badge');
        if (newBadge) {
            const srNewInfo = document.createElement('span');
            srNewInfo.className = 'sr-only';
            srNewInfo.textContent = 'New Release';
            newBadge.parentNode.appendChild(srNewInfo);
        }
    });
}

// Add to GameHub namespace if it exists
if (typeof GameHub !== 'undefined') {
    // Add to UI components module if it exists
    if (GameHub.UI) {
        GameHub.UI.enhanceGameCardAccessibility = enhanceGameCardAccessibility;
        
        // Call during initialization if the UI module has an init function
        const originalInit = GameHub.UI.init || function() {};
        GameHub.UI.init = function() {
            originalInit.apply(this, arguments);
            enhanceGameCardAccessibility();
        };
    } else {
        // Otherwise add directly to GameHub
        GameHub.enhanceGameCardAccessibility = enhanceGameCardAccessibility;
        
        // Call during initialization
        const originalInit = GameHub.init || function() {};
        GameHub.init = function() {
            originalInit.apply(this, arguments);
            enhanceGameCardAccessibility();
        };
    }
} else {
    // If no GameHub object, just call on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', enhanceGameCardAccessibility);
}

// Make UIComponents available globally for now
window.UIComponents = UIComponents;

// Initialize on document load
document.addEventListener('DOMContentLoaded', function() {
    UIComponents.init();
});

// Export for module usage (future implementation)
// export default UIComponents;