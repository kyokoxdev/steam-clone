/**
 * GameHub - Browse Page
 * Handles functionality for the game browsing page
 */

const BrowsePage = {
    gamesData: [],
    filteredGames: [],
    currentPage: 1,
    gamesPerPage: 12,
    
    init: function() {
        // Load games data
        this.loadGamesData();
        
        // Initialize UI components
        this.initFilters();
        this.initSorting();
        this.initPagination();
        
        console.log('Browse page initialized');
    },
    
    loadGamesData: function() {
        // Get games data from localStorage
        this.gamesData = JSON.parse(localStorage.getItem('gameHubGames')) || [];
        if (this.gamesData.length === 0) {
            console.error('No game data found');
            return;
        }
        
        // Initially, filteredGames is the same as all games
        this.filteredGames = [...this.gamesData];
        
        // Render the initial view
        this.renderGames();
        this.updatePagination();
    },
    
    renderGames: function() {
        const gameGrid = document.querySelector('.game-grid');
        if (!gameGrid) return;
        
        // Clear existing content
        gameGrid.innerHTML = '';
        
        // Calculate slice indexes for current page
        const startIndex = (this.currentPage - 1) * this.gamesPerPage;
        const endIndex = startIndex + this.gamesPerPage;
        const gamesToDisplay = this.filteredGames.slice(startIndex, endIndex);
        
        if (gamesToDisplay.length === 0) {
            // No games match the current filters
            gameGrid.innerHTML = `
                <div class="no-results">
                    <h3>No games found</h3>
                    <p>Try adjusting your filter settings to see more results.</p>
                    <button id="reset-filters" class="btn btn-secondary">Reset Filters</button>
                </div>
            `;
            
            // Add event listener to reset filters button
            const resetBtn = document.getElementById('reset-filters');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    this.resetFilters();
                });
            }
            
            return;
        }
        
        // Render game cards
        gamesToDisplay.forEach(game => {
            const gameCard = this.createGameCard(game);
            gameGrid.appendChild(gameCard);
        });
        
        // Update the result count
        const resultCount = document.querySelector('.result-count');
        if (resultCount) {
            resultCount.textContent = `Showing ${startIndex + 1}-${Math.min(endIndex, this.filteredGames.length)} of ${this.filteredGames.length} games`;
        }
    },
    
    createGameCard: function(game) {
        // Calculate the discounted price if there's a discount
        const discountedPrice = game.discountPercent > 0 
            ? game.price * (1 - game.discountPercent / 100) 
            : null;
        
        // Create the card element
        const card = document.createElement('div');
        card.className = 'game-card';
        card.dataset.gameId = game.id;
        
        // Create the card's HTML structure
        card.innerHTML = `
            <div class="game-card-image">
                <img src="${game.images.thumbnail}" alt="${game.title}" loading="lazy">
                ${game.discountPercent > 0 ? `<div class="discount-badge">-${game.discountPercent}%</div>` : ''}
            </div>
            <div class="game-card-content">
                <h3 class="game-title">${game.title}</h3>
                <div class="game-tags">
                    ${game.genres.slice(0, 3).map(genre => `<span class="tag">${genre}</span>`).join('')}
                </div>
                <div class="game-price">
                    ${game.discountPercent > 0 
                        ? `<span class="original-price">$${game.price.toFixed(2)}</span>
                          <span class="discounted-price">$${discountedPrice.toFixed(2)}</span>`
                        : game.price > 0 
                            ? `<span class="price">$${game.price.toFixed(2)}</span>`
                            : `<span class="free">Free to Play</span>`
                    }
                </div>
            </div>
        `;
        
        // Add event listener to navigate to game details page when clicked
        card.addEventListener('click', () => {
            window.location.href = `game-details.html?id=${game.id}`;
        });
        
        // Add hover event for animation effect
        card.addEventListener('mouseenter', () => {
            card.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hover');
        });
        
        return card;
    },
    
    initFilters: function() {
        // Get all filter checkboxes
        const filterChecks = document.querySelectorAll('.filter-category input[type="checkbox"]');
        const priceRangeSlider = document.getElementById('price-range');
        
        // Add change event listener to checkboxes
        filterChecks.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.applyFilters();
            });
        });
        
        // Handle price range filter if slider exists
        if (priceRangeSlider) {
            const priceOutput = document.getElementById('price-output');
            
            priceRangeSlider.addEventListener('input', function() {
                if (priceOutput) {
                    priceOutput.textContent = `$0 - $${this.value}`;
                }
            });
            
            priceRangeSlider.addEventListener('change', () => {
                this.applyFilters();
            });
        }
        
        // Initialize clear filters button
        const clearFiltersBtn = document.querySelector('.clear-filters-btn');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }
    },
    
    applyFilters: function() {
        // Get selected genre filters
        const selectedGenres = Array.from(
            document.querySelectorAll('.filter-category[data-filter="genre"] input:checked')
        ).map(input => input.value);
        
        // Get selected feature filters
        const selectedFeatures = Array.from(
            document.querySelectorAll('.filter-category[data-filter="feature"] input:checked')
        ).map(input => input.value);
        
        // Get price range if exists
        const priceRangeSlider = document.getElementById('price-range');
        const maxPrice = priceRangeSlider ? parseFloat(priceRangeSlider.value) : 100;
        
        // Get discount filter if exists
        const discountedOnly = document.getElementById('discounted-only')?.checked || false;
        
        // Filter the games based on selections
        this.filteredGames = this.gamesData.filter(game => {
            // Check if game matches genre filter (if any genres are selected)
            const matchesGenre = selectedGenres.length === 0 || 
                game.genres.some(genre => selectedGenres.includes(genre));
            
            // Check if game matches features filter (if any features are selected)
            const matchesFeatures = selectedFeatures.length === 0 || 
                selectedFeatures.every(feature => game.features.includes(feature));
            
            // Check if game matches price filter
            const actualPrice = game.discountPercent > 0 
                ? game.price * (1 - game.discountPercent / 100) 
                : game.price;
            const matchesPrice = actualPrice <= maxPrice;
            
            // Check if game matches discount filter
            const matchesDiscount = !discountedOnly || game.discountPercent > 0;
            
            // Game must match all selected filters
            return matchesGenre && matchesFeatures && matchesPrice && matchesDiscount;
        });
        
        // Reset to first page when filters change
        this.currentPage = 1;
        
        // Re-render games with new filter
        this.renderGames();
        this.updatePagination();
    },
    
    resetFilters: function() {
        // Uncheck all filter checkboxes
        document.querySelectorAll('.filter-category input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Reset price range slider if exists
        const priceRangeSlider = document.getElementById('price-range');
        if (priceRangeSlider) {
            priceRangeSlider.value = priceRangeSlider.getAttribute('max') || 100;
            
            const priceOutput = document.getElementById('price-output');
            if (priceOutput) {
                priceOutput.textContent = `$0 - $${priceRangeSlider.value}`;
            }
        }
        
        // Reset filtered games to all games
        this.filteredGames = [...this.gamesData];
        
        // Reset to first page
        this.currentPage = 1;
        
        // Re-render with reset filters
        this.renderGames();
        this.updatePagination();
    },
    
    initSorting: function() {
        const sortSelect = document.getElementById('sort-select');
        if (!sortSelect) return;
        
        sortSelect.addEventListener('change', () => {
            this.sortGames(sortSelect.value);
        });
    },
    
    sortGames: function(sortOption) {
        switch (sortOption) {
            case 'name-asc':
                this.filteredGames.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'name-desc':
                this.filteredGames.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'price-asc':
                this.filteredGames.sort((a, b) => {
                    const priceA = a.discountPercent > 0 
                        ? a.price * (1 - a.discountPercent / 100) 
                        : a.price;
                    const priceB = b.discountPercent > 0 
                        ? b.price * (1 - b.discountPercent / 100) 
                        : b.price;
                    return priceA - priceB;
                });
                break;
            case 'price-desc':
                this.filteredGames.sort((a, b) => {
                    const priceA = a.discountPercent > 0 
                        ? a.price * (1 - a.discountPercent / 100) 
                        : a.price;
                    const priceB = b.discountPercent > 0 
                        ? b.price * (1 - b.discountPercent / 100) 
                        : b.price;
                    return priceB - priceA;
                });
                break;
            case 'rating-desc':
                this.filteredGames.sort((a, b) => b.rating - a.rating);
                break;
            case 'release-desc':
                this.filteredGames.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
                break;
            case 'release-asc':
                this.filteredGames.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
                break;
            case 'discount-desc':
                this.filteredGames.sort((a, b) => b.discountPercent - a.discountPercent);
                break;
            default:
                // Default: featured/recommended (use rating as proxy)
                this.filteredGames.sort((a, b) => b.rating - a.rating);
        }
        
        // Re-render with sorted games
        this.renderGames();
    },
    
    initPagination: function() {
        const paginationContainer = document.querySelector('.pagination');
        if (!paginationContainer) return;
        
        // Add event listener to pagination container
        paginationContainer.addEventListener('click', (e) => {
            const target = e.target;
            
            // Check if a pagination button was clicked
            if (target.matches('.pagination-btn')) {
                const page = target.dataset.page;
                
                if (page === 'prev') {
                    this.currentPage = Math.max(1, this.currentPage - 1);
                } else if (page === 'next') {
                    const totalPages = Math.ceil(this.filteredGames.length / this.gamesPerPage);
                    this.currentPage = Math.min(totalPages, this.currentPage + 1);
                } else {
                    this.currentPage = parseInt(page);
                }
                
                // Scroll to top of game grid
                const gameGrid = document.querySelector('.game-grid');
                if (gameGrid) {
                    gameGrid.scrollIntoView({ behavior: 'smooth' });
                }
                
                // Re-render games for new page
                this.renderGames();
                this.updatePagination();
            }
        });
        
        // Initialize pagination
        this.updatePagination();
        
        // Add event listener for games per page control if exists
        const perPageSelect = document.getElementById('per-page-select');
        if (perPageSelect) {
            perPageSelect.addEventListener('change', () => {
                this.gamesPerPage = parseInt(perPageSelect.value);
                this.currentPage = 1; // Reset to first page
                this.renderGames();
                this.updatePagination();
            });
        }
    },
    
    updatePagination: function() {
        const paginationContainer = document.querySelector('.pagination');
        if (!paginationContainer) return;
        
        // Calculate total pages
        const totalPages = Math.ceil(this.filteredGames.length / this.gamesPerPage);
        
        // Clear existing buttons
        paginationContainer.innerHTML = '';
        
        // Don't show pagination if only one page
        if (totalPages <= 1) return;
        
        // Add "Previous" button
        const prevBtn = document.createElement('button');
        prevBtn.className = `pagination-btn prev ${this.currentPage === 1 ? 'disabled' : ''}`;
        prevBtn.dataset.page = 'prev';
        prevBtn.textContent = 'Previous';
        prevBtn.disabled = this.currentPage === 1;
        paginationContainer.appendChild(prevBtn);
        
        // Determine which page buttons to show
        let startPage = Math.max(1, this.currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        // Adjust start if end is maxed out
        if (endPage === totalPages) {
            startPage = Math.max(1, endPage - 4);
        }
        
        // Add first page and ellipsis if needed
        if (startPage > 1) {
            const firstBtn = document.createElement('button');
            firstBtn.className = 'pagination-btn';
            firstBtn.dataset.page = '1';
            firstBtn.textContent = '1';
            paginationContainer.appendChild(firstBtn);
            
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                paginationContainer.appendChild(ellipsis);
            }
        }
        
        // Add page buttons
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `pagination-btn ${i === this.currentPage ? 'active' : ''}`;
            pageBtn.dataset.page = i.toString();
            pageBtn.textContent = i.toString();
            paginationContainer.appendChild(pageBtn);
        }
        
        // Add last page and ellipsis if needed
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                paginationContainer.appendChild(ellipsis);
            }
            
            const lastBtn = document.createElement('button');
            lastBtn.className = 'pagination-btn';
            lastBtn.dataset.page = totalPages.toString();
            lastBtn.textContent = totalPages.toString();
            paginationContainer.appendChild(lastBtn);
        }
        
        // Add "Next" button
        const nextBtn = document.createElement('button');
        nextBtn.className = `pagination-btn next ${this.currentPage === totalPages ? 'disabled' : ''}`;
        nextBtn.dataset.page = 'next';
        nextBtn.textContent = 'Next';
        nextBtn.disabled = this.currentPage === totalPages;
        paginationContainer.appendChild(nextBtn);
    }
};

// Initialize module when page loads
document.addEventListener('DOMContentLoaded', function() {
    BrowsePage.init();
});