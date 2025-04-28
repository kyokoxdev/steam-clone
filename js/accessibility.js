/**
 * GameHub - Accessibility Module
 * Handles accessibility features across the website
 */

const Accessibility = {
    init: function() {
        // Initialize focus management
        this.initFocusManagement();
        
        // Initialize keyboard navigation helpers
        this.initKeyboardNavigation();
        
        // Add ARIA attributes dynamically
        this.initAriaAttributes();
        
        // Set up skip links
        this.initSkipLinks();
        
        // Initialize high contrast mode toggle
        this.initHighContrastMode();
        
        console.log('Accessibility module initialized');
    },
    
    initFocusManagement: function() {
        // Add a visible focus indicator class
        document.addEventListener('keydown', function(e) {
            // If Tab key is pressed, add a class to the body
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-user');
                
                // Remove the class when mouse is used
                document.addEventListener('mousedown', function() {
                    document.body.classList.remove('keyboard-user');
                }, { once: true });
            }
        });
        
        // Fix focus on modal dialogs
        const modalOpeners = document.querySelectorAll('[data-modal-open]');
        
        modalOpeners.forEach(opener => {
            opener.addEventListener('click', function() {
                const modalId = this.getAttribute('data-modal-open');
                const modal = document.getElementById(modalId);
                
                if (modal) {
                    // Get first focusable element
                    const focusableElements = modal.querySelectorAll(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    );
                    
                    if (focusableElements.length) {
                        // Store the element that had focus before opening modal
                        modal.dataset.previousFocus = document.activeElement.id || 'body';
                        
                        // Focus the first focusable element in the modal
                        setTimeout(() => {
                            focusableElements[0].focus();
                        }, 100);
                    }
                    
                    // Trap focus inside modal
                    modal.addEventListener('keydown', function(e) {
                        if (e.key === 'Tab') {
                            // Get all focusable elements
                            const focusable = Array.from(
                                modal.querySelectorAll(
                                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                                )
                            ).filter(el => el.offsetWidth > 0 && el.offsetHeight > 0);
                            
                            // If no focusable elements, do nothing
                            if (focusable.length === 0) return;
                            
                            const firstFocusable = focusable[0];
                            const lastFocusable = focusable[focusable.length - 1];
                            
                            // If shift+tab on first element, go to last element
                            if (e.shiftKey && document.activeElement === firstFocusable) {
                                e.preventDefault();
                                lastFocusable.focus();
                            // If tab on last element, go to first element
                            } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                                e.preventDefault();
                                firstFocusable.focus();
                            }
                        }
                    });
                }
            });
        });
        
        // Restore focus when modal closed
        const modalClosers = document.querySelectorAll('[data-modal-close]');
        
        modalClosers.forEach(closer => {
            closer.addEventListener('click', function() {
                const modalId = this.getAttribute('data-modal-close');
                const modal = document.getElementById(modalId);
                
                if (modal && modal.dataset.previousFocus) {
                    // Get the element that had focus before opening modal
                    const previousFocus = modal.dataset.previousFocus === 'body' 
                        ? document.body 
                        : document.getElementById(modal.dataset.previousFocus);
                    
                    // Restore focus
                    if (previousFocus) {
                        setTimeout(() => {
                            if (previousFocus === document.body) {
                                // If previous focus was body, focus the first focusable element in the document
                                const firstFocusable = document.querySelector(
                                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                                );
                                if (firstFocusable) firstFocusable.focus();
                            } else {
                                previousFocus.focus();
                            }
                        }, 100);
                    }
                    
                    // Clear the stored element
                    delete modal.dataset.previousFocus;
                }
            });
        });
    },
    
    initKeyboardNavigation: function() {
        // Add keyboard shortcuts for common actions
        document.addEventListener('keydown', function(e) {
            // Only process if no modifier keys are pressed in input fields
            const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
            
            if (!isInput) {
                // Search shortcut (/)
                if (e.key === '/') {
                    e.preventDefault();
                    const searchInput = document.querySelector('#search-input');
                    if (searchInput) searchInput.focus();
                }
                
                // Home page shortcut (Alt+H)
                if (e.altKey && e.key === 'h') {
                    e.preventDefault();
                    window.location.href = 'index.html';
                }
                
                // Store page shortcut (Alt+S)
                if (e.altKey && e.key === 's') {
                    e.preventDefault();
                    window.location.href = 'browse.html';
                }
                
                // Library shortcut (Alt+L)
                if (e.altKey && e.key === 'l') {
                    e.preventDefault();
                    window.location.href = 'library.html';
                }
                
                // Profile shortcut (Alt+P)
                if (e.altKey && e.key === 'p') {
                    e.preventDefault();
                    window.location.href = 'profile.html';
                }
                
                // Escape key closes modals and dropdowns
                if (e.key === 'Escape') {
                    // Close any open modals
                    const openModals = document.querySelectorAll('.modal.show');
                    openModals.forEach(modal => {
                        const closeBtn = modal.querySelector('[data-modal-close]');
                        if (closeBtn) closeBtn.click();
                    });
                    
                    // Close any open dropdowns
                    const openDropdowns = document.querySelectorAll('.dropdown-menu.show');
                    openDropdowns.forEach(dropdown => {
                        dropdown.classList.remove('show');
                        
                        // Find the trigger and update its aria-expanded attribute
                        const trigger = document.querySelector(`[aria-controls="${dropdown.id}"]`);
                        if (trigger) trigger.setAttribute('aria-expanded', 'false');
                    });
                }
            }
        });
        
        // Make dropdown menus keyboard accessible
        const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
        
        dropdownTriggers.forEach(trigger => {
            // Ensure the dropdown menu has an ID
            const dropdownMenu = trigger.nextElementSibling;
            if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
                if (!dropdownMenu.id) {
                    dropdownMenu.id = 'dropdown-' + Math.random().toString(36).substring(2, 9);
                }
                
                // Add ARIA attributes
                trigger.setAttribute('aria-haspopup', 'true');
                trigger.setAttribute('aria-expanded', 'false');
                trigger.setAttribute('aria-controls', dropdownMenu.id);
                
                // Make it keyboard accessible
                trigger.addEventListener('keydown', function(e) {
                    // Open on Enter or Space
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.click();
                    } 
                    // Open and focus first item on Arrow Down
                    else if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        
                        // Show dropdown
                        dropdownMenu.classList.add('show');
                        this.setAttribute('aria-expanded', 'true');
                        
                        // Focus first item
                        const firstItem = dropdownMenu.querySelector('a, button');
                        if (firstItem) firstItem.focus();
                    }
                });
                
                // Update ARIA attributes when menu shown/hidden via click
                trigger.addEventListener('click', function() {
                    const isExpanded = this.getAttribute('aria-expanded') === 'true';
                    this.setAttribute('aria-expanded', (!isExpanded).toString());
                });
                
                // Keyboard navigation within dropdown
                dropdownMenu.addEventListener('keydown', function(e) {
                    const items = Array.from(this.querySelectorAll('a, button'));
                    const currentIndex = items.indexOf(document.activeElement);
                    
                    // Handle arrow keys
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        
                        if (currentIndex < items.length - 1) {
                            items[currentIndex + 1].focus();
                        } else {
                            // Wrap to first item
                            items[0].focus();
                        }
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        
                        if (currentIndex > 0) {
                            items[currentIndex - 1].focus();
                        } else {
                            // Wrap to last item
                            items[items.length - 1].focus();
                        }
                    } else if (e.key === 'Escape') {
                        e.preventDefault();
                        
                        // Close dropdown
                        dropdownMenu.classList.remove('show');
                        trigger.setAttribute('aria-expanded', 'false');
                        
                        // Return focus to trigger
                        trigger.focus();
                    } else if (e.key === 'Tab' && !e.shiftKey && currentIndex === items.length - 1) {
                        // If tabbing from last item, close dropdown
                        dropdownMenu.classList.remove('show');
                        trigger.setAttribute('aria-expanded', 'false');
                    } else if (e.key === 'Tab' && e.shiftKey && currentIndex === 0) {
                        // If shift-tabbing from first item, close dropdown
                        dropdownMenu.classList.remove('show');
                        trigger.setAttribute('aria-expanded', 'false');
                    }
                });
            }
        });
    },
    
    initAriaAttributes: function() {
        // Add aria-label to buttons that only have icons
        document.querySelectorAll('button:not([aria-label])').forEach(button => {
            if (!button.textContent.trim() && button.querySelector('i, svg, img')) {
                let label = '';
                
                // Try to determine button purpose
                if (button.classList.contains('close-btn') || button.classList.contains('btn-close')) {
                    label = 'Close';
                } else if (button.classList.contains('search-btn')) {
                    label = 'Search';
                } else if (button.classList.contains('cart-btn')) {
                    label = 'View Cart';
                } else if (button.classList.contains('wishlist-btn')) {
                    label = 'Add to Wishlist';
                } else if (button.classList.contains('menu-toggle')) {
                    label = 'Toggle Menu';
                } else {
                    // Check for title attribute
                    label = button.getAttribute('title') || 'Button';
                }
                
                button.setAttribute('aria-label', label);
            }
        });
        
        // Add aria-current to current page in navigation
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('nav a').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath) {
                link.setAttribute('aria-current', 'page');
            }
        });
        
        // Add ARIA attributes to tabs
        const tabSets = document.querySelectorAll('[role="tablist"]');
        
        tabSets.forEach(tabSet => {
            const tabs = tabSet.querySelectorAll('[role="tab"]');
            const panels = [];
            
            // Find associated panels and set up relationships
            tabs.forEach(tab => {
                const tabId = tab.id || 'tab-' + Math.random().toString(36).substring(2, 9);
                const panelId = tab.getAttribute('aria-controls') || tab.getAttribute('data-tab-target');
                const panel = document.getElementById(panelId);
                
                if (!tab.id) tab.id = tabId;
                
                if (panel) {
                    panels.push(panel);
                    
                    // Set role and aria attributes for panel
                    panel.setAttribute('role', 'tabpanel');
                    panel.setAttribute('aria-labelledby', tabId);
                    
                    // Check if tab is selected
                    const isSelected = tab.classList.contains('active') || tab.getAttribute('aria-selected') === 'true';
                    
                    // Set attributes based on selection state
                    tab.setAttribute('aria-selected', isSelected.toString());
                    tab.setAttribute('tabindex', isSelected ? '0' : '-1');
                    
                    // Show/hide panel based on selection state
                    if (!isSelected) {
                        panel.setAttribute('hidden', 'true');
                    } else {
                        panel.removeAttribute('hidden');
                    }
                    
                    // Handle keyboard navigation for tab
                    tab.addEventListener('keydown', function(e) {
                        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                            e.preventDefault();
                            
                            // Find all tabs in this tablist
                            const allTabs = Array.from(tabSet.querySelectorAll('[role="tab"]'));
                            const currentIndex = allTabs.indexOf(this);
                            let newIndex;
                            
                            if (e.key === 'ArrowLeft') {
                                newIndex = currentIndex > 0 ? currentIndex - 1 : allTabs.length - 1;
                            } else {
                                newIndex = currentIndex < allTabs.length - 1 ? currentIndex + 1 : 0;
                            }
                            
                            // Move focus to the new tab
                            allTabs[newIndex].focus();
                            allTabs[newIndex].click(); // Activate the tab
                        }
                    });
                }
            });
        });
        
        // Add proper attributes to live regions
        document.querySelectorAll('.notification-container').forEach(container => {
            container.setAttribute('aria-live', 'polite');
            container.setAttribute('role', 'log');
            container.setAttribute('aria-relevant', 'additions');
        });
        
        // Add proper attributes to search results
        const searchResults = document.querySelector('#search-results');
        if (searchResults) {
            searchResults.setAttribute('aria-live', 'polite');
            searchResults.setAttribute('role', 'region');
            searchResults.setAttribute('aria-label', 'Search results');
        }
    },
    
    initSkipLinks: function() {
        // Create skip link if it doesn't exist
        if (!document.querySelector('.skip-link')) {
            const skipLink = document.createElement('a');
            skipLink.className = 'skip-link';
            skipLink.href = '#main-content';
            skipLink.textContent = 'Skip to main content';
            
            // Insert at the beginning of the body
            document.body.insertBefore(skipLink, document.body.firstChild);
            
            // Ensure the main content area has an id
            const mainContent = document.querySelector('main') || document.querySelector('.main-content');
            if (mainContent && !mainContent.id) {
                mainContent.id = 'main-content';
            }
        }
    },
    
    initHighContrastMode: function() {
        // Check if high contrast mode is enabled in localStorage
        const highContrastEnabled = localStorage.getItem('highContrastMode') === 'true';
        
        if (highContrastEnabled) {
            document.body.classList.add('high-contrast');
        }
        
        // Add high contrast toggle button if it doesn't exist
        if (!document.querySelector('#high-contrast-toggle')) {
            // Create the toggle button
            const toggleButton = document.createElement('button');
            toggleButton.id = 'high-contrast-toggle';
            toggleButton.className = 'accessibility-toggle';
            toggleButton.setAttribute('aria-pressed', highContrastEnabled.toString());
            toggleButton.innerHTML = '<span class="accessibility-icon">A</span> <span class="accessibility-label">High Contrast</span>';
            
            // Add event listener
            toggleButton.addEventListener('click', function() {
                // Toggle high contrast mode
                document.body.classList.toggle('high-contrast');
                
                // Update button state
                const isEnabled = document.body.classList.contains('high-contrast');
                this.setAttribute('aria-pressed', isEnabled.toString());
                
                // Save preference to localStorage
                localStorage.setItem('highContrastMode', isEnabled.toString());
                
                // Announce change to screen readers
                const announcement = document.createElement('div');
                announcement.className = 'sr-only';
                announcement.setAttribute('aria-live', 'assertive');
                announcement.textContent = isEnabled ? 'High contrast mode enabled' : 'High contrast mode disabled';
                document.body.appendChild(announcement);
                
                // Remove announcement after it's been read
                setTimeout(() => {
                    document.body.removeChild(announcement);
                }, 1000);
            });
            
            // Create accessibility controls container if it doesn't exist
            let accessibilityControls = document.querySelector('.accessibility-controls');
            if (!accessibilityControls) {
                accessibilityControls = document.createElement('div');
                accessibilityControls.className = 'accessibility-controls';
                document.body.appendChild(accessibilityControls);
            }
            
            // Add the button to the controls
            accessibilityControls.appendChild(toggleButton);
        }
    },
    
    // Add this method to check and fix heading hierarchy
    checkHeadingHierarchy: function() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let previousLevel = 0;
        let issues = [];
        
        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.substring(1));
            
            // First heading should preferably be h1
            if (index === 0 && level !== 1) {
                issues.push(`First heading is ${heading.tagName}, should be H1`);
            }
            
            // Check if heading levels are skipped (e.g., h2 followed by h4)
            if (previousLevel > 0 && level > previousLevel && level - previousLevel > 1) {
                issues.push(`Heading level skipped: ${heading.tagName} follows H${previousLevel}`);
            }
            
            previousLevel = level;
        });
        
        return issues;
    },
    
    // Add this method to announce dynamic content changes
    announceToScreenReader: function(message, priority = 'polite') {
        let announcer = document.getElementById('screen-reader-announcer');
        
        // Create announcer element if it doesn't exist
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'screen-reader-announcer';
            announcer.className = 'sr-only';
            announcer.setAttribute('aria-live', priority);
            document.body.appendChild(announcer);
        }
        
        // Update the priority if needed
        if (announcer.getAttribute('aria-live') !== priority) {
            announcer.setAttribute('aria-live', priority);
        }
        
        // Add the message - use this technique to ensure it's announced even if the text doesn't change
        announcer.textContent = '';
        setTimeout(() => {
            announcer.textContent = message;
        }, 50);
        
        // Clear after a reasonable amount of time
        setTimeout(() => {
            announcer.textContent = '';
        }, 3000);
    }
};

// Initialize module when page loads
document.addEventListener('DOMContentLoaded', function() {
    Accessibility.init();
    
    // Expose to global namespace for use in other modules
    window.Accessibility = Accessibility;
});