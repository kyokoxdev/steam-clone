/**
 * GameHub - API Service
 * This module simulates API calls to a backend service
 * It uses local storage to persist data for demonstration purposes
 */

const ApiService = {
    // Base API configuration
    baseUrl: 'https://api.gamehub.example', // Simulated API URL
    
    /**
     * Simulate API request with delay
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     * @param {number} delay - Simulated delay in ms
     * @return {Promise} - Promise resolving to response data
     */
    _request: function(endpoint, options = {}, delay = 500) {
        // Default options
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        // Merge options
        const requestOptions = { ...defaultOptions, ...options };
        
        // Convert body to JSON string if it exists and is an object
        if (requestOptions.body && typeof requestOptions.body === 'object') {
            requestOptions.body = JSON.stringify(requestOptions.body);
        }
        
        console.log(`[API] ${requestOptions.method} request to ${endpoint}`);
        
        // Return promise that resolves after the specified delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    // Handle different endpoints and methods
                    const response = this._handleEndpoint(endpoint, requestOptions);
                    resolve(response);
                } catch (error) {
                    reject({
                        error: true,
                        message: error.message || 'An error occurred',
                        status: error.status || 500
                    });
                }
            }, delay);
        });
    },
    
    /**
     * Handle different API endpoints with mock data
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     * @return {Object} - Response data
     */
    _handleEndpoint: function(endpoint, options) {
        // Simulated API responses based on endpoint and method
        if (endpoint.startsWith('/games')) {
            return this._handleGamesEndpoint(endpoint, options);
        } else if (endpoint.startsWith('/user')) {
            return this._handleUserEndpoint(endpoint, options);
        } else if (endpoint.startsWith('/cart')) {
            return this._handleCartEndpoint(endpoint, options);
        } else if (endpoint.startsWith('/search')) {
            return this._handleSearchEndpoint(endpoint, options);
        } else {
            throw new Error('Endpoint not found');
        }
    },
    
    /**
     * Handle games-related endpoints
     */
    _handleGamesEndpoint: function(endpoint, options) {
        // Load games from localStorage or use default empty array
        const allGames = JSON.parse(localStorage.getItem('gameHubGames')) || [];
        
        // GET /games - List all games
        if (endpoint === '/games' && options.method === 'GET') {
            // Parse query parameters
            const url = new URL(endpoint, window.location.origin);
            const params = {};
            const searchParams = options.searchParams || {};
            
            Object.keys(searchParams).forEach(key => {
                params[key] = searchParams[key];
            });
            
            // Apply filters
            let filteredGames = [...allGames];
            
            // Filter by genre if specified
            if (params.genre) {
                filteredGames = filteredGames.filter(game => 
                    game.genres && game.genres.includes(params.genre)
                );
            }
            
            // Filter by price range
            if (params.minPrice !== undefined) {
                filteredGames = filteredGames.filter(game => 
                    game.price >= parseFloat(params.minPrice)
                );
            }
            
            if (params.maxPrice !== undefined) {
                filteredGames = filteredGames.filter(game => 
                    game.price <= parseFloat(params.maxPrice)
                );
            }
            
            // Apply sorting
            if (params.sort) {
                switch(params.sort) {
                    case 'price_asc':
                        filteredGames.sort((a, b) => a.price - b.price);
                        break;
                    case 'price_desc':
                        filteredGames.sort((a, b) => b.price - a.price);
                        break;
                    case 'name_asc':
                        filteredGames.sort((a, b) => a.title.localeCompare(b.title));
                        break;
                    case 'name_desc':
                        filteredGames.sort((a, b) => b.title.localeCompare(a.title));
                        break;
                    case 'release_date':
                        filteredGames.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
                        break;
                    case 'rating':
                        filteredGames.sort((a, b) => b.rating - a.rating);
                        break;
                }
            }
            
            // Apply pagination
            const page = parseInt(params.page) || 1;
            const limit = parseInt(params.limit) || 12;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedGames = filteredGames.slice(startIndex, endIndex);
            
            return {
                data: paginatedGames,
                meta: {
                    total: filteredGames.length,
                    page: page,
                    limit: limit,
                    totalPages: Math.ceil(filteredGames.length / limit)
                }
            };
        }
        
        // GET /games/:id - Get game by ID
        if (endpoint.match(/^\/games\/[\w-]+$/) && options.method === 'GET') {
            const gameId = endpoint.split('/')[2];
            const game = allGames.find(g => g.id === gameId);
            
            if (!game) {
                throw { status: 404, message: 'Game not found' };
            }
            
            return { data: game };
        }
        
        throw new Error('Endpoint not implemented');
    },
    
    /**
     * Handle user-related endpoints
     */
    _handleUserEndpoint: function(endpoint, options) {
        // Load users from localStorage
        const allUsers = JSON.parse(localStorage.getItem('gameHubUsers')) || [];
        
        // POST /user/login - Login user
        if (endpoint === '/user/login' && options.method === 'POST') {
            const { username, password } = JSON.parse(options.body);
            
            // Find user by username
            const user = allUsers.find(u => u.username === username);
            
            // Check if user exists and password matches
            if (!user || user.password !== password) { // In a real app, use proper password hashing
                throw { status: 401, message: 'Invalid username or password' };
            }
            
            // Create user session
            const session = {
                userId: user.id,
                username: user.username,
                token: Utils.generateRandomString(32),
                expires: new Date(Date.now() + 3600000).toISOString() // 1 hour
            };
            
            // Store session
            localStorage.setItem('gameHubSession', JSON.stringify(session));
            
            return {
                data: {
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        profileName: user.profileName,
                        avatar: user.avatar
                    },
                    token: session.token
                }
            };
        }
        
        // POST /user/register - Register new user
        if (endpoint === '/user/register' && options.method === 'POST') {
            const userData = JSON.parse(options.body);
            
            // Check if username already exists
            if (allUsers.some(u => u.username === userData.username)) {
                throw { status: 409, message: 'Username already exists' };
            }
            
            // Check if email already exists
            if (allUsers.some(u => u.email === userData.email)) {
                throw { status: 409, message: 'Email already exists' };
            }
            
            // Create new user
            const newUser = {
                id: Utils.generateRandomString(16),
                username: userData.username,
                email: userData.email,
                password: userData.password, // In a real app, hash the password
                profileName: userData.profileName || userData.username,
                avatar: userData.avatar || '/assets/images/default-avatar.jpg',
                joinDate: new Date().toISOString(),
                ownedGames: [],
                wishlist: [],
                friends: [],
                cart: []
            };
            
            // Add user to list
            allUsers.push(newUser);
            
            // Save updated users list
            localStorage.setItem('gameHubUsers', JSON.stringify(allUsers));
            
            return {
                data: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                    profileName: newUser.profileName,
                    avatar: newUser.avatar
                }
            };
        }
        
        // GET /user/profile - Get current user profile
        if (endpoint === '/user/profile' && options.method === 'GET') {
            // Check for auth token in headers
            const authHeader = options.headers['Authorization'];
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw { status: 401, message: 'Unauthorized' };
            }
            
            // Extract token
            const token = authHeader.split(' ')[1];
            
            // Get session
            const session = JSON.parse(localStorage.getItem('gameHubSession'));
            
            // Validate session
            if (!session || session.token !== token || new Date(session.expires) < new Date()) {
                throw { status: 401, message: 'Session expired' };
            }
            
            // Find user
            const user = allUsers.find(u => u.id === session.userId);
            
            if (!user) {
                throw { status: 404, message: 'User not found' };
            }
            
            return {
                data: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    profileName: user.profileName,
                    avatar: user.avatar,
                    joinDate: user.joinDate,
                    ownedGames: user.ownedGames,
                    wishlist: user.wishlist
                }
            };
        }
        
        throw new Error('Endpoint not implemented');
    },
    
    /**
     * Handle cart-related endpoints
     */
    _handleCartEndpoint: function(endpoint, options) {
        // Get current user session
        const session = JSON.parse(localStorage.getItem('gameHubSession'));
        
        // Check if user is logged in
        if (!session) {
            throw { status: 401, message: 'Unauthorized' };
        }
        
        // Load users
        const allUsers = JSON.parse(localStorage.getItem('gameHubUsers')) || [];
        
        // Find current user
        const userIndex = allUsers.findIndex(u => u.id === session.userId);
        
        if (userIndex === -1) {
            throw { status: 404, message: 'User not found' };
        }
        
        const user = allUsers[userIndex];
        
        // GET /cart - Get cart items
        if (endpoint === '/cart' && options.method === 'GET') {
            // Load games for detailed information
            const allGames = JSON.parse(localStorage.getItem('gameHubGames')) || [];
            
            // Get full game details for cart items
            const cartItems = user.cart.map(cartItem => {
                const game = allGames.find(g => g.id === cartItem.gameId);
                
                if (!game) {
                    return null;
                }
                
                return {
                    id: cartItem.id,
                    game: {
                        id: game.id,
                        title: game.title,
                        price: game.price,
                        discountPercent: game.discountPercent || 0,
                        image: game.images.thumbnail
                    },
                    addedAt: cartItem.addedAt
                };
            }).filter(Boolean);
            
            return {
                data: cartItems,
                meta: {
                    totalItems: cartItems.length,
                    totalPrice: cartItems.reduce((total, item) => {
                        const discountedPrice = item.game.price * (1 - (item.game.discountPercent / 100));
                        return total + discountedPrice;
                    }, 0)
                }
            };
        }
        
        // POST /cart - Add item to cart
        if (endpoint === '/cart' && options.method === 'POST') {
            const { gameId } = JSON.parse(options.body);
            
            // Check if game already in cart
            if (user.cart.some(item => item.gameId === gameId)) {
                throw { status: 409, message: 'Game already in cart' };
            }
            
            // Add game to cart
            const cartItem = {
                id: Utils.generateRandomString(16),
                gameId: gameId,
                addedAt: new Date().toISOString()
            };
            
            user.cart.push(cartItem);
            
            // Update user data
            allUsers[userIndex] = user;
            localStorage.setItem('gameHubUsers', JSON.stringify(allUsers));
            
            return {
                data: cartItem,
                message: 'Item added to cart'
            };
        }
        
        // DELETE /cart/:id - Remove item from cart
        if (endpoint.match(/^\/cart\/[\w-]+$/) && options.method === 'DELETE') {
            const cartItemId = endpoint.split('/')[2];
            
            // Find cart item index
            const cartItemIndex = user.cart.findIndex(item => item.id === cartItemId);
            
            if (cartItemIndex === -1) {
                throw { status: 404, message: 'Cart item not found' };
            }
            
            // Remove item from cart
            user.cart.splice(cartItemIndex, 1);
            
            // Update user data
            allUsers[userIndex] = user;
            localStorage.setItem('gameHubUsers', JSON.stringify(allUsers));
            
            return {
                message: 'Item removed from cart'
            };
        }
        
        // POST /cart/checkout - Checkout cart
        if (endpoint === '/cart/checkout' && options.method === 'POST') {
            const checkoutData = JSON.parse(options.body);
            
            // Load games for detailed information
            const allGames = JSON.parse(localStorage.getItem('gameHubGames')) || [];
            
            // Get cart items with game details
            const cartItems = user.cart.map(cartItem => {
                const game = allGames.find(g => g.id === cartItem.gameId);
                
                if (!game) {
                    return null;
                }
                
                return {
                    id: cartItem.id,
                    game: {
                        id: game.id,
                        title: game.title,
                        price: game.price,
                        discountPercent: game.discountPercent || 0
                    }
                };
            }).filter(Boolean);
            
            // Calculate total price
            const totalPrice = cartItems.reduce((total, item) => {
                const discountedPrice = item.game.price * (1 - (item.game.discountPercent / 100));
                return total + discountedPrice;
            }, 0);
            
            // Create order
            const order = {
                id: Utils.generateRandomString(16),
                userId: user.id,
                items: cartItems,
                totalPrice: totalPrice,
                paymentMethod: checkoutData.paymentMethod,
                billingAddress: checkoutData.billingAddress,
                status: 'completed',
                createdAt: new Date().toISOString()
            };
            
            // Add games to user's library
            cartItems.forEach(item => {
                if (!user.ownedGames.includes(item.game.id)) {
                    user.ownedGames.push(item.game.id);
                }
            });
            
            // Clear user's cart
            user.cart = [];
            
            // Update user data
            allUsers[userIndex] = user;
            localStorage.setItem('gameHubUsers', JSON.stringify(allUsers));
            
            // Save order history
            const orders = JSON.parse(localStorage.getItem('gameHubOrders')) || [];
            orders.push(order);
            localStorage.setItem('gameHubOrders', JSON.stringify(orders));
            
            return {
                data: order,
                message: 'Checkout successful'
            };
        }
        
        throw new Error('Endpoint not implemented');
    },
    
    /**
     * Handle search-related endpoints
     */
    _handleSearchEndpoint: function(endpoint, options) {
        // GET /search - Search for games
        if (endpoint === '/search' && options.method === 'GET') {
            // Parse query parameters
            const searchParams = options.searchParams || {};
            const query = searchParams.q || '';
            const page = parseInt(searchParams.page) || 1;
            const limit = parseInt(searchParams.limit) || 12;
            
            // Load games
            const allGames = JSON.parse(localStorage.getItem('gameHubGames')) || [];
            
            // Filter games by search query
            const filteredGames = allGames.filter(game => {
                const titleMatch = game.title.toLowerCase().includes(query.toLowerCase());
                const devMatch = game.developer && game.developer.toLowerCase().includes(query.toLowerCase());
                const pubMatch = game.publisher && game.publisher.toLowerCase().includes(query.toLowerCase());
                
                return titleMatch || devMatch || pubMatch;
            });
            
            // Apply pagination
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedGames = filteredGames.slice(startIndex, endIndex);
            
            return {
                data: paginatedGames,
                meta: {
                    total: filteredGames.length,
                    page: page,
                    limit: limit,
                    totalPages: Math.ceil(filteredGames.length / limit),
                    query: query
                }
            };
        }
        
        throw new Error('Endpoint not implemented');
    },
    
    // Public API methods
    
    /**
     * Get all games with optional filtering
     * @param {Object} params - Query parameters for filtering
     * @return {Promise} - Promise resolving to games data
     */
    getGames: function(params = {}) {
        return this._request('/games', {
            method: 'GET',
            searchParams: params
        });
    },
    
    /**
     * Get a single game by ID
     * @param {string} gameId - Game ID
     * @return {Promise} - Promise resolving to game data
     */
    getGameById: function(gameId) {
        return this._request(`/games/${gameId}`, { method: 'GET' });
    },
    
    /**
     * Search for games
     * @param {string} query - Search query
     * @param {Object} params - Additional query parameters
     * @return {Promise} - Promise resolving to search results
     */
    searchGames: function(query, params = {}) {
        return this._request('/search', {
            method: 'GET',
            searchParams: { q: query, ...params }
        });
    },
    
    /**
     * Login user
     * @param {string} username - Username
     * @param {string} password - Password
     * @return {Promise} - Promise resolving to user data and token
     */
    login: function(username, password) {
        return this._request('/user/login', {
            method: 'POST',
            body: { username, password }
        });
    },
    
    /**
     * Register new user
     * @param {Object} userData - User registration data
     * @return {Promise} - Promise resolving to new user data
     */
    register: function(userData) {
        return this._request('/user/register', {
            method: 'POST',
            body: userData
        });
    },
    
    /**
     * Get current user profile
     * @param {string} token - Authentication token
     * @return {Promise} - Promise resolving to user profile data
     */
    getCurrentUser: function(token) {
        return this._request('/user/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },
    
    /**
     * Get cart items
     * @return {Promise} - Promise resolving to cart data
     */
    getCart: function() {
        return this._request('/cart', { method: 'GET' });
    },
    
    /**
     * Add item to cart
     * @param {string} gameId - Game ID to add to cart
     * @return {Promise} - Promise resolving to cart data
     */
    addToCart: function(gameId) {
        return this._request('/cart', {
            method: 'POST',
            body: { gameId }
        });
    },
    
    /**
     * Remove item from cart
     * @param {string} cartItemId - Cart item ID to remove
     * @return {Promise} - Promise resolving to cart data
     */
    removeFromCart: function(cartItemId) {
        return this._request(`/cart/${cartItemId}`, { method: 'DELETE' });
    },
    
    /**
     * Checkout cart
     * @param {Object} checkoutData - Checkout data
     * @return {Promise} - Promise resolving to order data
     */
    checkout: function(checkoutData) {
        return this._request('/cart/checkout', {
            method: 'POST',
            body: checkoutData
        });
    }
};

// Make API service available globally for now
window.ApiService = ApiService;

// Export for module usage (future implementation)
// export default ApiService;