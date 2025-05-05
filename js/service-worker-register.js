/**
 * Service Worker Registration
 * Registers the service worker for offline functionality and caching
 */

// Check if service workers are supported
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Register the service worker
        navigator.serviceWorker.register('/service-worker.js')
            .then(function(registration) {
                console.log('Service Worker registered with scope:', registration.scope);
                
                // Check for updates to the service worker
                registration.addEventListener('updatefound', function() {
                    // If an update is found, get the new service worker
                    const newWorker = registration.installing;
                    
                    // Add a listener to track its state
                    newWorker.addEventListener('statechange', function() {
                        // If the new service worker is installed, notify the user
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch(function(error) {
                console.error('Service Worker registration failed:', error);
            });
            
        // Listen for the user being offline
        window.addEventListener('offline', function() {
            console.log('User is offline');
            showOfflineNotification();
        });
        
        // Listen for the user being online again
        window.addEventListener('online', function() {
            console.log('User is back online');
            showOnlineNotification();
            
            // Trigger background sync if supported
            if (navigator.serviceWorker.controller && 'sync' in window.registration) {
                navigator.serviceWorker.ready.then(function(registration) {
                    // Sync cart and wishlist operations that were done offline
                    registration.sync.register('sync-cart');
                    registration.sync.register('sync-wishlist');
                });
            }
        });
    });
}

/**
 * Show a notification when a new service worker is available
 */
function showUpdateNotification() {
    // Check if the UI notification system is available
    if (typeof UIComponents !== 'undefined' && UIComponents.showNotification) {
        UIComponents.showNotification(
            'A new version is available! Refresh to update.',
            'info',
            10000
        );
        
        // Add refresh button to the notification
        const notification = document.querySelector('.notification');
        if (notification) {
            const refreshButton = document.createElement('button');
            refreshButton.className = 'notification-action';
            refreshButton.textContent = 'Refresh Now';
            refreshButton.addEventListener('click', function() {
                window.location.reload();
            });
            
            notification.querySelector('.notification-content').appendChild(refreshButton);
        }
    } else {
        // Fallback if the UI system isn't available
        console.log('New version available! Refresh to update.');
    }
}

/**
 * Show a notification when the user goes offline
 */
function showOfflineNotification() {
    if (typeof UIComponents !== 'undefined' && UIComponents.showNotification) {
        UIComponents.showNotification(
            'You are offline. Some features may be limited.',
            'warning',
            5000
        );
    }
}

/**
 * Show a notification when the user comes back online
 */
function showOnlineNotification() {
    if (typeof UIComponents !== 'undefined' && UIComponents.showNotification) {
        UIComponents.showNotification(
            'You are back online!',
            'success',
            3000
        );
    }
}

/**
 * Store operations for background sync when offline
 * @param {string} type - Type of operation ('cart' or 'wishlist')
 * @param {string} action - Action to perform ('add' or 'remove')
 * @param {string} gameId - ID of the game
 */
function storeOfflineOperation(type, action, gameId) {
    // Get existing operations from localStorage
    const key = `offline-${type}-operations`;
    const existingOperations = localStorage.getItem(key);
    const operations = existingOperations ? JSON.parse(existingOperations) : [];
    
    // Add the new operation
    operations.push({
        type,
        action,
        gameId,
        timestamp: new Date().toISOString()
    });
    
    // Save back to localStorage
    localStorage.setItem(key, JSON.stringify(operations));
    
    // If online, trigger a sync right away
    if (navigator.onLine && 'serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(function(registration) {
            if ('sync' in registration) {
                registration.sync.register(`sync-${type}`);
            }
        });
    }
}