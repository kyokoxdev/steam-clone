/**
 * Parental Controls JavaScript
 * Handles functionality for parental control settings
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize toggle elements
    initializeToggles();
    
    // Set up form submission handlers
    setupFormHandlers();
    
    // Load saved settings from localStorage
    loadSavedSettings();
});

/**
 * Initialize toggle and checkbox interactions
 */
function initializeToggles() {
    // Family View toggle
    const familyViewToggle = document.getElementById('family-view-toggle');
    const pinSection = document.getElementById('pin-section');
    
    if (familyViewToggle && pinSection) {
        familyViewToggle.addEventListener('change', () => {
            pinSection.style.display = familyViewToggle.checked ? 'block' : 'none';
        });
    }
    
    // Spending limit toggle
    const restrictSpendingCheckbox = document.getElementById('restrict-spending');
    const spendingLimits = document.getElementById('spending-limits');
    
    if (restrictSpendingCheckbox && spendingLimits) {
        restrictSpendingCheckbox.addEventListener('change', () => {
            spendingLimits.style.display = restrictSpendingCheckbox.checked ? 'block' : 'none';
        });
    }
    
    // Time limits toggle
    const timeLimit = document.getElementById('enable-time-limits');
    const timeLimitOptions = document.getElementById('time-limit-options');
    
    if (timeLimit && timeLimitOptions) {
        timeLimit.addEventListener('change', () => {
            timeLimitOptions.style.display = timeLimit.checked ? 'block' : 'none';
        });
    }
    
    // Curfew toggle
    const enableBedtime = document.getElementById('enable-bedtime');
    const curfewOptions = document.getElementById('curfew-options');
    
    if (enableBedtime && curfewOptions) {
        enableBedtime.addEventListener('change', () => {
            curfewOptions.style.display = enableBedtime.checked ? 'block' : 'none';
        });
    }
}

/**
 * Set up form submission handlers
 */
function setupFormHandlers() {
    // PIN form handler
    const pinForm = document.getElementById('pin-form');
    
    if (pinForm) {
        pinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const currentPin = document.getElementById('current-pin').value;
            const newPin = document.getElementById('new-pin').value;
            const confirmPin = document.getElementById('confirm-pin').value;
            
            // If there's an existing PIN, validate it
            const savedPin = localStorage.getItem('parental_pin');
            if (savedPin && savedPin !== currentPin) {
                showNotification('Current PIN is incorrect', 'error');
                return;
            }
            
            // Validate new PIN
            if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
                showNotification('PIN must be 4 digits', 'error');
                return;
            }
            
            // Confirm PIN match
            if (newPin !== confirmPin) {
                showNotification('PINs do not match', 'error');
                return;
            }
            
            // Save PIN
            localStorage.setItem('parental_pin', newPin);
            localStorage.setItem('family_view_enabled', 'true');
            
            // Reset form
            pinForm.reset();
            
            showNotification('PIN saved successfully', 'success');
        });
    }
    
    // Content filter form handler
    const contentFilterForm = document.getElementById('content-filter-form');
    
    if (contentFilterForm) {
        contentFilterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect all settings
            const settings = {
                filters: {
                    adult: document.getElementById('filter-adult').checked,
                    violence: document.getElementById('filter-violence').checked,
                    horror: document.getElementById('filter-horror').checked
                },
                maxRating: document.getElementById('max-rating').value,
                requirePinForPurchase: document.getElementById('require-pin-purchase').checked,
                spendingLimit: {
                    enabled: document.getElementById('restrict-spending').checked,
                    amount: document.getElementById('spending-amount').value
                },
                timeLimit: {
                    enabled: document.getElementById('enable-time-limits').checked,
                    weekday: document.getElementById('weekday-hours').value,
                    weekend: document.getElementById('weekend-hours').value,
                    bedtime: {
                        enabled: document.getElementById('enable-bedtime').checked,
                        start: document.getElementById('curfew-start').value,
                        end: document.getElementById('curfew-end').value
                    }
                }
            };
            
            // Save settings to localStorage
            localStorage.setItem('parental_settings', JSON.stringify(settings));
            
            showNotification('Parental control settings saved', 'success');
        });
        
        // Reset button handler
        contentFilterForm.querySelector('button[type="reset"]').addEventListener('click', () => {
            // Confirm reset
            if (confirm('Are you sure you want to reset all parental control settings to defaults?')) {
                localStorage.removeItem('parental_settings');
                loadSavedSettings(); // Reload default settings
                showNotification('Settings reset to defaults', 'info');
            }
        });
    }
}

/**
 * Load saved settings from localStorage
 */
function loadSavedSettings() {
    // Load Family View setting
    const familyViewEnabled = localStorage.getItem('family_view_enabled') === 'true';
    const familyViewToggle = document.getElementById('family-view-toggle');
    const pinSection = document.getElementById('pin-section');
    
    if (familyViewToggle) {
        familyViewToggle.checked = familyViewEnabled;
        if (pinSection) {
            pinSection.style.display = familyViewEnabled ? 'block' : 'none';
        }
    }
    
    // Load parental control settings
    const savedSettings = localStorage.getItem('parental_settings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // Apply filters
        if (settings.filters) {
            document.getElementById('filter-adult').checked = settings.filters.adult;
            document.getElementById('filter-violence').checked = settings.filters.violence;
            document.getElementById('filter-horror').checked = settings.filters.horror;
        }
        
        // Apply max rating
        if (settings.maxRating) {
            document.getElementById('max-rating').value = settings.maxRating;
        }
        
        // Apply purchase settings
        document.getElementById('require-pin-purchase').checked = settings.requirePinForPurchase;
        
        // Apply spending limit
        const restrictSpending = document.getElementById('restrict-spending');
        const spendingLimits = document.getElementById('spending-limits');
        
        if (settings.spendingLimit && restrictSpending && spendingLimits) {
            restrictSpending.checked = settings.spendingLimit.enabled;
            spendingLimits.style.display = settings.spendingLimit.enabled ? 'block' : 'none';
            
            if (settings.spendingLimit.amount) {
                document.getElementById('spending-amount').value = settings.spendingLimit.amount;
            }
        }
        
        // Apply time limit settings
        const timeLimit = document.getElementById('enable-time-limits');
        const timeLimitOptions = document.getElementById('time-limit-options');
        
        if (settings.timeLimit && timeLimit && timeLimitOptions) {
            timeLimit.checked = settings.timeLimit.enabled;
            timeLimitOptions.style.display = settings.timeLimit.enabled ? 'block' : 'none';
            
            if (settings.timeLimit.weekday) {
                document.getElementById('weekday-hours').value = settings.timeLimit.weekday;
            }
            
            if (settings.timeLimit.weekend) {
                document.getElementById('weekend-hours').value = settings.timeLimit.weekend;
            }
            
            // Apply bedtime settings
            const enableBedtime = document.getElementById('enable-bedtime');
            const curfewOptions = document.getElementById('curfew-options');
            
            if (settings.timeLimit.bedtime && enableBedtime && curfewOptions) {
                enableBedtime.checked = settings.timeLimit.bedtime.enabled;
                curfewOptions.style.display = settings.timeLimit.bedtime.enabled ? 'block' : 'none';
                
                if (settings.timeLimit.bedtime.start) {
                    document.getElementById('curfew-start').value = settings.timeLimit.bedtime.start;
                }
                
                if (settings.timeLimit.bedtime.end) {
                    document.getElementById('curfew-end').value = settings.timeLimit.bedtime.end;
                }
            }
        }
    }
}

/**
 * Show notification to user
 * @param {string} message - Message to display
 * @param {string} type - Notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Check if notification container exists, create if not
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'notification-close';
    closeButton.innerHTML = '&times;';
    closeButton.setAttribute('aria-label', 'Close notification');
    closeButton.addEventListener('click', () => {
        notification.remove();
    });
    
    notification.appendChild(closeButton);
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}