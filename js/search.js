/**
 * GameHub - Search Module
 * Handles search functionality across the site
 */

const Search = {
    recentSearches: [],
    maxRecentSearches: 5,

    init: function() {
        this.loadRecentSearches();
        this.initSearchBar();
        this.initSearchSuggestions();
        console.log('Search module initialized');
    },

    loadRecentSearches: function() {
        // Load recent searches from localStorage
        const storedSearches = localStorage.getItem('gameHubRecentSearches');
        this.recentSearches = storedSearches ? JSON.parse(storedSearches) : [];
    },

    saveRecentSearches: function() {
        // Save recent searches to localStorage
        localStorage.setItem('gameHubRecentSearches', JSON.stringify(this.recentSearches));
    },

    addRecentSearch: function(query) {
        // Don't add empty queries
        if (!query.trim()) return;

        // Remove this query if it already exists (to move it to the top)
        this.recentSearches = this.recentSearches.filter(item => item.toLowerCase() !== query.toLowerCase());

        // Add the new query to the beginning
        this.recentSearches.unshift(query);

        // Limit the number of recent searches
        if (this.recentSearches.length > this.maxRecentSearches) {
            this.recentSearches = this.recentSearches.slice(0, this.maxRecentSearches);
        }

        // Save to localStorage
        this.saveRecentSearches();
    },

    clearRecentSearches: function() {
        this.recentSearches = [];
        this.saveRecentSearches();
    },

    initSearchBar: function() {
        const searchForm = document.querySelector('.search-form');
        const searchInput = document.querySelector('.search-input');
        
        if (!searchForm || !searchInput) return;

        // Handle search form submission
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            
            if (query) {
                // Add to recent searches
                this.addRecentSearch(query);
                
                // Navigate to search results page with query parameter
                window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
            }
        });

        // Check if we're on the search results page
        if (window.location.pathname.includes('search-results.html')) {
            this.loadSearchResults();
        }
    },

    initSearchSuggestions: function() {
        const searchInput = document.querySelector('.search-input');
        const suggestionsContainer = document.querySelector('.search-suggestions');
        
        if (!searchInput || !suggestionsContainer) return;

        // Create a suggestions container if it doesn't exist
        if (!suggestionsContainer) {
            const container = document.createElement('div');
            container.className = 'search-suggestions';
            searchInput.parentNode.appendChild(container);
            suggestionsContainer = container;
        }

        // Show suggestions when input is focused
        searchInput.addEventListener('focus', () => {
            this.showSuggestions(searchInput, suggestionsContainer);
        });

        // Update suggestions as user types
        searchInput.addEventListener('input', () => {
            this.updateSuggestions(searchInput, suggestionsContainer);
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
                suggestionsContainer.innerHTML = '';
                suggestionsContainer.classList.remove('show');
            }
        });

        // Allow keyboard navigation within suggestions
        searchInput.addEventListener('keydown', (e) => {
            if (!suggestionsContainer.classList.contains('show')) return;

            const suggestions = suggestionsContainer.querySelectorAll('.suggestion-item');
            let focusedIndex = Array.from(suggestions).findIndex(item => item.classList.contains('focused'));

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    if (focusedIndex < suggestions.length - 1) {
                        if (focusedIndex >= 0) suggestions[focusedIndex].classList.remove('focused');
                        suggestions[focusedIndex + 1].classList.add('focused');
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    if (focusedIndex > 0) {
                        suggestions[focusedIndex].classList.remove('focused');
                        suggestions[focusedIndex - 1].classList.add('focused');
                    }
                    break;
                case 'Enter':
                    const focusedItem = suggestionsContainer.querySelector('.suggestion-item.focused');
                    if (focusedItem) {
                        e.preventDefault();
                        searchInput.value = focusedItem.textContent.trim();
                        suggestionsContainer.innerHTML = '';
                        suggestionsContainer.classList.remove('show');
                        searchInput.form.dispatchEvent(new Event('submit'));
                    }
                    break;
                case 'Escape':
                    suggestionsContainer.innerHTML = '';
                    suggestionsContainer.classList.remove('show');
                    break;
            }
        });
    },

    showSuggestions: function(searchInput, suggestionsContainer) {
        const query = searchInput.value.trim().toLowerCase();
        
        // Show recent searches if input is empty
        if (!query) {
            this.showRecentSearches(suggestionsContainer);
            return;
        }
        
        this.updateSuggestions(searchInput, suggestionsContainer);
    },

    showRecentSearches: function(suggestionsContainer) {
        if (this.recentSearches.length === 0) return;

        suggestionsContainer.innerHTML = '';
        
        // Add heading
        const heading = document.createElement('div');
        heading.className = 'suggestion-heading';
        heading.innerHTML = `
            <span>Recent Searches</span>
            <button class="clear-searches-btn">Clear</button>
        `;
        suggestionsContainer.appendChild(heading);
        
        // Add recent searches
        this.recentSearches.forEach(search => {
            const item = document.createElement('div');
            item.className = 'suggestion-item recent';
            item.innerHTML = `
                <i class="search-history-icon"></i>
                <span>${search}</span>
            `;
            suggestionsContainer.appendChild(item);
            
            // Add click handler
            item.addEventListener('click', () => {
                const searchInput = document.querySelector('.search-input');
                if (searchInput) {
                    searchInput.value = search;
                    searchInput.form.dispatchEvent(new Event('submit'));
                }
            });
        });
        
        // Add clear button handler
        const clearBtn = suggestionsContainer.querySelector('.clear-searches-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.clearRecentSearches();
                suggestionsContainer.innerHTML = '';
            });
        }
        
        suggestionsContainer.classList.add('show');
    },

    updateSuggestions: function(searchInput, suggestionsContainer) {
        const query = searchInput.value.trim().toLowerCase();
        
        if (!query) {
            this.showRecentSearches(suggestionsContainer);
            return;
        }
        
        // Get games data from localStorage
        const gamesData = JSON.parse(localStorage.getItem('gameHubGames')) || [];
        if (gamesData.length === 0) return;
        
        // Filter games that match the query
        const matchingGames = gamesData.filter(game => {
            // Match by game title
            if (game.title.toLowerCase().includes(query)) return true;
            
            // Match by genre
            if (game.genres.some(genre => genre.toLowerCase().includes(query))) return true;
            
            // Match by tag
            if (game.tags.some(tag => tag.toLowerCase().includes(query))) return true;
            
            // Match by developer or publisher
            if (game.developer.toLowerCase().includes(query) || 
                game.publisher.toLowerCase().includes(query)) return true;
            
            return false;
        });
        
        // Limit results
        const maxResults = 5;
        const limitedResults = matchingGames.slice(0, maxResults);
        
        // Display matching games as suggestions
        suggestionsContainer.innerHTML = '';
        
        if (limitedResults.length > 0) {
            // Add game suggestions
            limitedResults.forEach(game => {
                const item = document.createElement('div');
                item.className = 'suggestion-item game';
                item.innerHTML = `
                    <img src="${game.images.thumbnail}" alt="${game.title}" class="suggestion-thumbnail">
                    <div class="suggestion-details">
                        <span class="suggestion-title">${game.title}</span>
                        <span class="suggestion-info">${game.genres.slice(0, 2).join(', ')}</span>
                    </div>
                `;
                suggestionsContainer.appendChild(item);
                
                // Add click handler to navigate to game details
                item.addEventListener('click', () => {
                    window.location.href = `pages/game-details.html?id=${game.id}`;
                });
            });
            
            // Add "View all results" option
            const viewAllItem = document.createElement('div');
            viewAllItem.className = 'suggestion-item view-all';
            viewAllItem.innerHTML = `<span>View all results for "${query}"</span>`;
            suggestionsContainer.appendChild(viewAllItem);
            
            // Add click handler for view all
            viewAllItem.addEventListener('click', () => {
                const searchInput = document.querySelector('.search-input');
                if (searchInput) {
                    // Add to recent searches
                    this.addRecentSearch(query);
                    
                    // Navigate to search results
                    window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
                }
            });
            
            suggestionsContainer.classList.add('show');
        } else {
            // No results found
            const noResults = document.createElement('div');
            noResults.className = 'suggestion-item no-results';
            noResults.textContent = `No games found for "${query}"`;
            suggestionsContainer.appendChild(noResults);
            
            suggestionsContainer.classList.add('show');
        }
    },

    loadSearchResults: function() {
        // Parse search query from URL
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        
        if (!query) return;
        
        // Display the search query
        const searchQueryDisplay = document.querySelector('.search-query');
        if (searchQueryDisplay) {
            searchQueryDisplay.textContent = query;
        }
        
        // Update the search input with the query
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.value = query;
        }
        
        // Get games data from localStorage
        const gamesData = JSON.parse(localStorage.getItem('gameHubGames')) || [];
        if (gamesData.length === 0) {
            this.showNoResults(query);
            return;
        }
        
        // Filter games that match the query
        const matchingGames = gamesData.filter(game => {
            // Convert query and game properties to lowercase for case-insensitive comparison
            const queryLower = query.toLowerCase();
            
            // Match by game title
            if (game.title.toLowerCase().includes(queryLower)) return true;
            
            // Match by genre
            if (game.genres.some(genre => genre.toLowerCase().includes(queryLower))) return true;
            
            // Match by tag
            if (game.tags.some(tag => tag.toLowerCase().includes(queryLower))) return true;
            
            // Match by developer or publisher
            if (game.developer.toLowerCase().includes(queryLower) || 
                game.publisher.toLowerCase().includes(queryLower)) return true;
            
            // Match by description (less weight)
            if (game.description.toLowerCase().includes(queryLower)) return true;
            
            return false;
        });
        
        // Display search results
        const resultsContainer = document.querySelector('.search-results-container');
        if (!resultsContainer) return;
        
        if (matchingGames.length === 0) {
            this.showNoResults(query);
            return;
        }
        
        // Display result count
        const resultCount = document.querySelector('.result-count');
        if (resultCount) {
            resultCount.textContent = `${matchingGames.length} games found`;
        }
        
        // Clear results container
        resultsContainer.innerHTML = '';
        
        // Create results grid
        const resultsGrid = document.createElement('div');
        resultsGrid.className = 'game-grid search-results-grid';
        resultsContainer.appendChild(resultsGrid);
        
        // Populate results
        matchingGames.forEach(game => {
            const gameCard = this.createGameCard(game);
            resultsGrid.appendChild(gameCard);
        });
    },

    showNoResults: function(query) {
        const resultsContainer = document.querySelector('.search-results-container');
        if (!resultsContainer) return;
        
        resultsContainer.innerHTML = `
            <div class="no-results-message">
                <h3>No results found for "${query}"</h3>
                <p>We couldn't find any games matching your search terms.</p>
                <div class="no-results-suggestions">
                    <h4>Suggestions:</h4>
                    <ul>
                        <li>Check your spelling</li>
                        <li>Try more general terms</li>
                        <li>Try different keywords</li>
                        <li>Try searching by genre or tag</li>
                    </ul>
                </div>
                <a href="index.html" class="btn btn-primary">Return to Store</a>
            </div>
        `;
        
        // Update result count
        const resultCount = document.querySelector('.result-count');
        if (resultCount) {
            resultCount.textContent = '0 games found';
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
        
        // Add hover effect
        card.addEventListener('mouseenter', () => {
            card.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hover');
        });
        
        return card;
    }
};

// Initialize module when page loads
document.addEventListener('DOMContentLoaded', function() {
    Search.init();
});