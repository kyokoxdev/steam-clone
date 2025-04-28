/**
 * GameHub - Library Module
 * Handles user game library functionality
 */

const Library = {
    libraryGames: [],
    allGames: [],
    
    init: function() {
        // Load games data
        this.loadGamesData();
        
        // If on library page, initialize library-specific elements
        if (document.querySelector('.library-page')) {
            this.loadUserLibrary();
            this.renderLibraryPage();
            this.initLibraryEvents();
        }
        
        console.log('Library module initialized');
    },
    
    loadGamesData: function() {
        // Load all games data from localStorage
        const gamesData = localStorage.getItem('gameHubGames');
        
        if (gamesData) {
            try {
                this.allGames = JSON.parse(gamesData);
                console.log(`Games data loaded: ${this.allGames.length} games`);
            } catch (error) {
                console.error('Failed to parse games data from storage', error);
                this.allGames = [];
            }
        } else {
            this.allGames = [];
        }
    },
    
    loadUserLibrary: function() {
        // Get current user
        const currentUser = JSON.parse(localStorage.getItem('gameHubCurrentUser'));
        
        if (!currentUser) {
            // Not logged in, show login prompt
            this.showLoginPrompt();
            return;
        }
        
        // Load user's library from storage
        const users = JSON.parse(localStorage.getItem('gameHubUsers') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex === -1) {
            console.error('User not found in storage');
            return;
        }
        
        // Get the user's library game IDs
        const libraryGameIds = users[userIndex].library || [];
        
        // Match library IDs with game data
        this.libraryGames = [];
        
        libraryGameIds.forEach(gameId => {
            const gameData = this.allGames.find(game => game.id === gameId);
            
            if (gameData) {
                // Add game to library with additional properties
                this.libraryGames.push({
                    ...gameData,
                    installed: Math.random() > 0.5, // Random for demo
                    lastPlayed: this.getRandomLastPlayed(),
                    playtime: Math.floor(Math.random() * 100) // Random playtime for demo
                });
            }
        });
        
        console.log(`Library loaded: ${this.libraryGames.length} games`);
    },
    
    getRandomLastPlayed: function() {
        // Generate a random date in the last 30 days
        const now = new Date();
        const daysAgo = Math.floor(Math.random() * 30);
        now.setDate(now.getDate() - daysAgo);
        return now.toISOString();
    },
    
    showLoginPrompt: function() {
        const libraryContainer = document.querySelector('.library-container');
        if (!libraryContainer) return;
        
        libraryContainer.innerHTML = `
            <div class="login-prompt">
                <div class="login-prompt-icon"></div>
                <h2>Sign in to access your library</h2>
                <p>Your game library will show all your purchased games.</p>
                <a href="../pages/login.html" class="btn btn-primary">Sign In</a>
            </div>
        `;
    },
    
    renderLibraryPage: function() {
        const libraryContainer = document.querySelector('.library-container');
        if (!libraryContainer) return;
        
        // User must be logged in to view library
        const currentUser = JSON.parse(localStorage.getItem('gameHubCurrentUser'));
        if (!currentUser) {
            this.showLoginPrompt();
            return;
        }
        
        if (this.libraryGames.length === 0) {
            // Library is empty
            libraryContainer.innerHTML = `
                <div class="empty-library">
                    <div class="empty-library-icon"></div>
                    <h2>Your library is empty</h2>
                    <p>Games you purchase will appear in your library.</p>
                    <a href="../pages/browse.html" class="btn btn-primary">Browse Games</a>
                </div>
            `;
        } else {
            // Build library header
            let libraryHTML = `
                <div class="library-header">
                    <div class="library-title">
                        <h1>Your Game Library</h1>
                    </div>
                    <div class="library-actions">
                        <div class="library-view-toggle">
                            <button class="view-btn grid-view-btn active" data-view="grid">
                                <span class="grid-icon"></span>
                            </button>
                            <button class="view-btn list-view-btn" data-view="list">
                                <span class="list-icon"></span>
                            </button>
                        </div>
                        <div class="sort-controls">
                            <label for="library-sort">Sort by:</label>
                            <select id="library-sort" class="library-sort-select">
                                <option value="name-asc">Name (A to Z)</option>
                                <option value="name-desc">Name (Z to A)</option>
                                <option value="recently-played">Recently Played</option>
                                <option value="playtime-desc">Most Played</option>
                                <option value="size-desc">Size</option>
                            </select>
                        </div>
                        <div class="filter-controls">
                            <label for="library-filter">Filter:</label>
                            <select id="library-filter" class="library-filter-select">
                                <option value="all">All Games</option>
                                <option value="installed">Installed</option>
                                <option value="not-installed">Not Installed</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="library-search">
                    <input type="text" class="library-search-input" placeholder="Search library...">
                </div>
            `;
            
            // Build library games grid (default view)
            libraryHTML += '<div class="library-games-container grid-view">';
            
            // Add each library game
            this.libraryGames.forEach(game => {
                libraryHTML += `
                    <div class="library-game" data-game-id="${game.id}" data-installed="${game.installed}">
                        <div class="library-game-cover">
                            <img src="${game.images.thumbnail}" alt="${game.title}">
                            <div class="game-status ${game.installed ? 'installed' : 'not-installed'}">
                                ${game.installed ? 'Installed' : 'Not Installed'}
                            </div>
                        </div>
                        <div class="library-game-details">
                            <h3 class="library-game-title">${game.title}</h3>
                            <div class="library-game-meta">
                                <span class="last-played">Last played: ${this.formatLastPlayed(game.lastPlayed)}</span>
                                <span class="playtime">${game.playtime} hours played</span>
                            </div>
                            <div class="library-game-actions">
                                ${game.installed 
                                    ? `<button class="play-btn" data-game-id="${game.id}">Play</button>
                                       <button class="uninstall-btn" data-game-id="${game.id}">Uninstall</button>`
                                    : `<button class="install-btn" data-game-id="${game.id}">Install</button>`
                                }
                            </div>
                        </div>
                    </div>
                `;
            });
            
            libraryHTML += '</div>';
            
            libraryContainer.innerHTML = libraryHTML;
        }
    },
    
    initLibraryEvents: function() {
        const libraryContainer = document.querySelector('.library-container');
        if (!libraryContainer) return;
        
        // View toggle (grid/list)
        const viewToggleButtons = libraryContainer.querySelectorAll('.view-btn');
        if (viewToggleButtons.length > 0) {
            viewToggleButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Remove active class from all buttons
                    viewToggleButtons.forEach(btn => btn.classList.remove('active'));
                    
                    // Add active class to clicked button
                    button.classList.add('active');
                    
                    // Get view type
                    const viewType = button.getAttribute('data-view');
                    
                    // Update games container class
                    const gamesContainer = libraryContainer.querySelector('.library-games-container');
                    if (gamesContainer) {
                        gamesContainer.className = `library-games-container ${viewType}-view`;
                    }
                });
            });
        }
        
        // Sort select change
        const sortSelect = libraryContainer.querySelector('#library-sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                this.sortLibrary(sortSelect.value);
            });
        }
        
        // Filter select change
        const filterSelect = libraryContainer.querySelector('#library-filter');
        if (filterSelect) {
            filterSelect.addEventListener('change', () => {
                this.filterLibrary(filterSelect.value);
            });
        }
        
        // Library search
        const searchInput = libraryContainer.querySelector('.library-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.searchLibrary(searchInput.value);
            });
        }
        
        // Library game buttons (install, uninstall, play)
        libraryContainer.addEventListener('click', (e) => {
            // Play button clicked
            if (e.target.matches('.play-btn')) {
                const gameId = e.target.getAttribute('data-game-id');
                this.playGame(gameId);
            }
            
            // Install button clicked
            if (e.target.matches('.install-btn')) {
                const gameId = e.target.getAttribute('data-game-id');
                this.installGame(gameId);
            }
            
            // Uninstall button clicked
            if (e.target.matches('.uninstall-btn')) {
                const gameId = e.target.getAttribute('data-game-id');
                this.uninstallGame(gameId);
            }
        });
    },
    
    sortLibrary: function(sortOption) {
        switch (sortOption) {
            case 'name-asc': // Name A to Z
                this.libraryGames.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'name-desc': // Name Z to A
                this.libraryGames.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'recently-played': // Recently played
                this.libraryGames.sort((a, b) => new Date(b.lastPlayed) - new Date(a.lastPlayed));
                break;
            case 'playtime-desc': // Most played
                this.libraryGames.sort((a, b) => b.playtime - a.playtime);
                break;
            case 'size-desc': // Size (random for demo)
                this.libraryGames.sort(() => Math.random() - 0.5);
                break;
        }
        
        // Re-render the library
        this.renderLibraryPage();
    },
    
    filterLibrary: function(filterOption) {
        const gamesContainer = document.querySelector('.library-games-container');
        if (!gamesContainer) return;
        
        // Show/hide games based on filter
        const games = gamesContainer.querySelectorAll('.library-game');
        
        games.forEach(game => {
            const isInstalled = game.getAttribute('data-installed') === 'true';
            
            switch (filterOption) {
                case 'all':
                    game.style.display = '';
                    break;
                case 'installed':
                    game.style.display = isInstalled ? '' : 'none';
                    break;
                case 'not-installed':
                    game.style.display = !isInstalled ? '' : 'none';
                    break;
            }
        });
    },
    
    searchLibrary: function(query) {
        const gamesContainer = document.querySelector('.library-games-container');
        if (!gamesContainer) return;
        
        query = query.toLowerCase().trim();
        
        // Show/hide games based on search query
        const games = gamesContainer.querySelectorAll('.library-game');
        
        games.forEach(game => {
            const gameTitle = game.querySelector('.library-game-title').textContent.toLowerCase();
            
            if (query === '' || gameTitle.includes(query)) {
                game.style.display = '';
            } else {
                game.style.display = 'none';
            }
        });
    },
    
    playGame: function(gameId) {
        // Find the game in library
        const game = this.libraryGames.find(g => g.id === gameId);
        
        if (!game) {
            console.error('Game not found in library');
            return;
        }
        
        // Create a full-screen game launch simulation
        const launchOverlay = document.createElement('div');
        launchOverlay.className = 'game-launch-overlay';
        launchOverlay.innerHTML = `
            <div class="launch-content">
                <div class="launch-game-info">
                    <img src="${game.images.thumbnail}" alt="${game.title}" class="launch-game-image">
                    <h2>Launching ${game.title}</h2>
                </div>
                <div class="launch-progress">
                    <div class="launch-progress-bar"></div>
                </div>
                <div class="launch-status">Preparing to launch...</div>
            </div>
        `;
        
        document.body.appendChild(launchOverlay);
        
        // Simulate launch progress
        let progress = 0;
        const progressBar = launchOverlay.querySelector('.launch-progress-bar');
        const statusText = launchOverlay.querySelector('.launch-status');
        
        const updateProgress = () => {
            progress += Math.random() * 15;
            
            if (progress >= 100) {
                progress = 100;
                progressBar.style.width = '100%';
                statusText.textContent = 'Game launched!';
                
                // Simulate game opening
                setTimeout(() => {
                    launchOverlay.classList.add('fade-out');
                    
                    // Remove overlay after animation
                    setTimeout(() => {
                        launchOverlay.remove();
                        
                        // Update last played time
                        this.updateLastPlayed(gameId);
                    }, 1000);
                }, 500);
                
                return;
            }
            
            progressBar.style.width = `${progress}%`;
            
            // Update status messages based on progress
            if (progress < 30) {
                statusText.textContent = 'Preparing to launch...';
            } else if (progress < 60) {
                statusText.textContent = 'Verifying game files...';
            } else if (progress < 90) {
                statusText.textContent = 'Starting game...';
            } else {
                statusText.textContent = 'Almost there...';
            }
            
            setTimeout(updateProgress, 200);
        };
        
        // Start progress simulation
        setTimeout(updateProgress, 500);
    },
    
    installGame: function(gameId) {
        // Find the game element
        const gameElement = document.querySelector(`.library-game[data-game-id="${gameId}"]`);
        if (!gameElement) return;
        
        // Create installation progress element
        const actionsElement = gameElement.querySelector('.library-game-actions');
        actionsElement.innerHTML = `
            <div class="install-progress">
                <div class="install-progress-text">Installing: 0%</div>
                <div class="install-progress-bar">
                    <div class="install-progress-fill"></div>
                </div>
            </div>
        `;
        
        // Find progress elements
        const progressFill = actionsElement.querySelector('.install-progress-fill');
        const progressText = actionsElement.querySelector('.install-progress-text');
        
        // Simulate installation progress
        let progress = 0;
        
        const updateProgress = () => {
            progress += Math.random() * 5;
            
            if (progress >= 100) {
                progress = 100;
                progressFill.style.width = '100%';
                progressText.textContent = 'Installed';
                
                // Update installed status
                gameElement.setAttribute('data-installed', 'true');
                
                // Mark as installed in our data
                const gameIndex = this.libraryGames.findIndex(g => g.id === gameId);
                if (gameIndex !== -1) {
                    this.libraryGames[gameIndex].installed = true;
                }
                
                // Update game status element
                const statusElement = gameElement.querySelector('.game-status');
                if (statusElement) {
                    statusElement.className = 'game-status installed';
                    statusElement.textContent = 'Installed';
                }
                
                // Replace with play and uninstall buttons after a delay
                setTimeout(() => {
                    actionsElement.innerHTML = `
                        <button class="play-btn" data-game-id="${gameId}">Play</button>
                        <button class="uninstall-btn" data-game-id="${gameId}">Uninstall</button>
                    `;
                }, 1000);
                
                return;
            }
            
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `Installing: ${Math.floor(progress)}%`;
            
            setTimeout(updateProgress, 200);
        };
        
        // Start progress simulation
        setTimeout(updateProgress, 500);
    },
    
    uninstallGame: function(gameId) {
        // Find the game element
        const gameElement = document.querySelector(`.library-game[data-game-id="${gameId}"]`);
        if (!gameElement) return;
        
        // Show confirmation dialog
        if (!confirm('Are you sure you want to uninstall this game?')) {
            return;
        }
        
        // Create uninstallation progress element
        const actionsElement = gameElement.querySelector('.library-game-actions');
        actionsElement.innerHTML = `
            <div class="uninstall-progress">
                <div class="uninstall-progress-text">Uninstalling...</div>
            </div>
        `;
        
        // Simulate uninstallation delay
        setTimeout(() => {
            // Update installed status
            gameElement.setAttribute('data-installed', 'false');
            
            // Mark as not installed in our data
            const gameIndex = this.libraryGames.findIndex(g => g.id === gameId);
            if (gameIndex !== -1) {
                this.libraryGames[gameIndex].installed = false;
            }
            
            // Update game status element
            const statusElement = gameElement.querySelector('.game-status');
            if (statusElement) {
                statusElement.className = 'game-status not-installed';
                statusElement.textContent = 'Not Installed';
            }
            
            // Replace with install button
            actionsElement.innerHTML = `
                <button class="install-btn" data-game-id="${gameId}">Install</button>
            `;
            
            // Show notification
            Utils.showNotification('Game uninstalled successfully', 'info');
        }, 2000);
    },
    
    updateLastPlayed: function(gameId) {
        // Update last played time in our data
        const gameIndex = this.libraryGames.findIndex(g => g.id === gameId);
        if (gameIndex !== -1) {
            this.libraryGames[gameIndex].lastPlayed = new Date().toISOString();
            
            // Increment playtime (for demo)
            this.libraryGames[gameIndex].playtime += 1;
            
            // Update the UI
            const gameElement = document.querySelector(`.library-game[data-game-id="${gameId}"]`);
            if (gameElement) {
                const lastPlayedElement = gameElement.querySelector('.last-played');
                const playtimeElement = gameElement.querySelector('.playtime');
                
                if (lastPlayedElement) {
                    lastPlayedElement.textContent = `Last played: ${this.formatLastPlayed(this.libraryGames[gameIndex].lastPlayed)}`;
                }
                
                if (playtimeElement) {
                    playtimeElement.textContent = `${this.libraryGames[gameIndex].playtime} hours played`;
                }
            }
        }
    },
    
    formatLastPlayed: function(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            // Format in hours/minutes if today
            const hours = date.getHours();
            const minutes = date.getMinutes();
            return `Today at ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            // Day name if within a week
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return days[date.getDay()];
        } else {
            // Full date otherwise
            return date.toLocaleDateString('en-US', { 
                year: 'numeric',
                month: 'short', 
                day: 'numeric'
            });
        }
    }
};

// Initialize module when page loads
document.addEventListener('DOMContentLoaded', function() {
    Library.init();
});