/**
 * GameHub - UI Module
 * Handles UI effects, animations, and notifications
 */

const UI = {
    init: function() {
        // Initialize fade-in animations
        this.initFadeInAnimations();
        
        // Initialize hover effects
        this.initHoverEffects();
        
        // Initialize loading spinners
        this.initLoadingSpinners();
        
        // Add classes for micro-interactions
        this.initMicroInteractions();
        
        console.log('UI module initialized');
    },
    
    initFadeInAnimations: function() {
        // Set up Intersection Observer for fade-in animations
        const fadeElements = document.querySelectorAll('.fade-in');
        
        if (fadeElements.length === 0) return;
        
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        });
        
        // Observe all fade-in elements
        fadeElements.forEach(el => {
            fadeObserver.observe(el);
        });
    },
    
    initHoverEffects: function() {
        // Add hover effect to game cards
        const gameCards = document.querySelectorAll('.game-card');
        
        gameCards.forEach(card => {
            // Skip if already initialized
            if (card.dataset.hoverInitialized === 'true') return;
            
            card.addEventListener('mouseenter', function() {
                this.classList.add('hover');
            });
            
            card.addEventListener('mouseleave', function() {
                this.classList.remove('hover');
            });
            
            // Mark as initialized
            card.dataset.hoverInitialized = 'true';
        });
        
        // Add hover effect to buttons
        const buttons = document.querySelectorAll('.btn:not(.hover-initialized)');
        
        buttons.forEach(button => {
            // Create ripple effect on click
            button.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
            
            // Mark as initialized
            button.classList.add('hover-initialized');
        });
    },
    
    initLoadingSpinners: function() {
        // Add loading spinners to elements with data-loading="true"
        const loadingElements = document.querySelectorAll('[data-loading="true"]');
        
        loadingElements.forEach(el => {
            // Create spinner element if it doesn't exist
            if (!el.querySelector('.spinner')) {
                const spinner = document.createElement('div');
                spinner.className = 'spinner';
                
                // Create spinner inner elements
                for (let i = 0; i < 12; i++) {
                    const dot = document.createElement('div');
                    spinner.appendChild(dot);
                }
                
                // Add spinner to element
                el.appendChild(spinner);
                
                // Add loading class to element
                el.classList.add('is-loading');
            }
        });
    },
    
    // Add loading spinner to an element
    showLoading: function(element) {
        if (!element) return;
        
        // Create spinner element
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        
        // Create spinner inner elements
        for (let i = 0; i < 12; i++) {
            const dot = document.createElement('div');
            spinner.appendChild(dot);
        }
        
        // Store original content and add loading state
        element.dataset.originalContent = element.innerHTML;
        element.innerHTML = '';
        element.appendChild(spinner);
        element.classList.add('is-loading');
    },
    
    // Remove loading spinner from an element
    hideLoading: function(element) {
        if (!element || !element.classList.contains('is-loading')) return;
        
        // Restore original content
        if (element.dataset.originalContent) {
            element.innerHTML = element.dataset.originalContent;
            delete element.dataset.originalContent;
        } else {
            element.innerHTML = '';
        }
        
        element.classList.remove('is-loading');
    },
    
    // Show skeleton loading for content areas
    showSkeleton: function(container, type = 'card', count = 4) {
        if (!container) return;
        
        let skeletonHTML = '';
        
        // Store original content
        container.dataset.originalContent = container.innerHTML;
        
        // Create different skeleton types
        switch (type) {
            case 'card':
                for (let i = 0; i < count; i++) {
                    skeletonHTML += `
                        <div class="skeleton-card">
                            <div class="skeleton-image"></div>
                            <div class="skeleton-title"></div>
                            <div class="skeleton-text"></div>
                            <div class="skeleton-price"></div>
                        </div>
                    `;
                }
                break;
                
            case 'list':
                for (let i = 0; i < count; i++) {
                    skeletonHTML += `
                        <div class="skeleton-list-item">
                            <div class="skeleton-image small"></div>
                            <div class="skeleton-content">
                                <div class="skeleton-title"></div>
                                <div class="skeleton-text"></div>
                            </div>
                        </div>
                    `;
                }
                break;
                
            case 'text':
                for (let i = 0; i < count; i++) {
                    skeletonHTML += `
                        <div class="skeleton-text-block">
                            <div class="skeleton-title"></div>
                            <div class="skeleton-text"></div>
                            <div class="skeleton-text"></div>
                            <div class="skeleton-text short"></div>
                        </div>
                    `;
                }
                break;
                
            case 'detail':
                skeletonHTML = `
                    <div class="skeleton-detail">
                        <div class="skeleton-header">
                            <div class="skeleton-image large"></div>
                            <div class="skeleton-header-content">
                                <div class="skeleton-title large"></div>
                                <div class="skeleton-text"></div>
                                <div class="skeleton-text"></div>
                            </div>
                        </div>
                        <div class="skeleton-body">
                            <div class="skeleton-text"></div>
                            <div class="skeleton-text"></div>
                            <div class="skeleton-text"></div>
                            <div class="skeleton-text short"></div>
                        </div>
                    </div>
                `;
                break;
        }
        
        // Add skeleton HTML to container
        container.innerHTML = skeletonHTML;
        container.classList.add('skeleton-container');
    },
    
    // Hide skeleton loading and restore content
    hideSkeleton: function(container) {
        if (!container || !container.classList.contains('skeleton-container')) return;
        
        // Restore original content with fade-in
        if (container.dataset.originalContent) {
            // Create temporary div for smooth transition
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = container.dataset.originalContent;
            tempDiv.style.opacity = 0;
            
            // Replace skeleton with original content
            container.innerHTML = '';
            container.appendChild(tempDiv);
            
            // Trigger reflow for animation
            void tempDiv.offsetWidth;
            
            // Fade in the content
            tempDiv.style.transition = 'opacity 0.3s ease-in-out';
            tempDiv.style.opacity = 1;
            
            // Clean up after transition
            setTimeout(() => {
                container.innerHTML = container.dataset.originalContent;
                delete container.dataset.originalContent;
            }, 300);
        }
        
        container.classList.remove('skeleton-container');
    },
    
    initMicroInteractions: function() {
        // Add micro-interactions to various elements
        
        // Add subtle scale effect to cards
        document.querySelectorAll('.game-card:not(.micro-initialized)').forEach(card => {
            card.classList.add('micro-interaction', 'micro-initialized');
        });
        
        // Add hover scale to buttons
        document.querySelectorAll('.btn:not(.micro-initialized)').forEach(btn => {
            btn.classList.add('micro-interaction', 'micro-initialized');
        });
        
        // Add input field focus effects
        document.querySelectorAll('input:not(.micro-initialized), textarea:not(.micro-initialized)').forEach(input => {
            input.classList.add('input-focus-effect', 'micro-initialized');
            
            // Create input highlight element if not in a .form-group
            if (!input.closest('.form-group') && !input.nextElementSibling?.classList.contains('input-highlight')) {
                const highlight = document.createElement('div');
                highlight.className = 'input-highlight';
                input.parentNode.insertBefore(highlight, input.nextSibling);
            }
        });
    },
    
    // Show smooth page transitions
    pageTransition: function(callback) {
        // Create page transition overlay
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        document.body.appendChild(overlay);
        
        // Animate overlay
        setTimeout(() => {
            overlay.classList.add('visible');
            
            // Execute callback after animation
            setTimeout(() => {
                if (typeof callback === 'function') {
                    callback();
                }
                
                // Remove overlay with fade-out animation
                setTimeout(() => {
                    overlay.classList.remove('visible');
                    
                    // Remove overlay after animation
                    setTimeout(() => {
                        overlay.remove();
                    }, 500);
                }, 100);
            }, 400);
        }, 10);
    },
    
    // Toast notification system
    notifications: {
        container: null,
        
        init: function() {
            // Create notification container if it doesn't exist
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.className = 'notification-container';
                document.body.appendChild(this.container);
            }
        },
        
        show: function(message, type = 'info', duration = 4000) {
            // Initialize container
            this.init();
            
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            
            // Add icon based on type
            let icon = '';
            switch (type) {
                case 'success':
                    icon = '<i class="notification-icon success"></i>';
                    break;
                case 'error':
                    icon = '<i class="notification-icon error"></i>';
                    break;
                case 'warning':
                    icon = '<i class="notification-icon warning"></i>';
                    break;
                default:
                    icon = '<i class="notification-icon info"></i>';
            }
            
            // Set notification content
            notification.innerHTML = `
                ${icon}
                <div class="notification-content">${message}</div>
                <button class="notification-close">&times;</button>
                <div class="notification-progress"></div>
            `;
            
            // Add to container
            this.container.appendChild(notification);
            
            // Add close button event
            const closeBtn = notification.querySelector('.notification-close');
            closeBtn.addEventListener('click', () => {
                this.dismiss(notification);
            });
            
            // Animate in
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);
            
            // Set progress bar animation
            const progress = notification.querySelector('.notification-progress');
            progress.style.transition = `width ${duration}ms linear`;
            
            // Trigger reflow to ensure transition works
            void progress.offsetWidth;
            
            // Start progress animation
            progress.style.width = '0%';
            
            // Auto dismiss after duration
            const dismissTimeout = setTimeout(() => {
                this.dismiss(notification);
            }, duration);
            
            // Store timeout ID
            notification.dataset.timeoutId = dismissTimeout;
            
            // Reset timer on hover
            notification.addEventListener('mouseenter', () => {
                clearTimeout(notification.dataset.timeoutId);
                progress.style.width = progress.offsetWidth + 'px';
                progress.style.transition = 'none';
            });
            
            notification.addEventListener('mouseleave', () => {
                const remainingTime = duration * (parseFloat(progress.style.width) / 100);
                progress.style.transition = `width ${remainingTime}ms linear`;
                progress.style.width = '0%';
                
                notification.dataset.timeoutId = setTimeout(() => {
                    this.dismiss(notification);
                }, remainingTime);
            });
            
            return notification;
        },
        
        dismiss: function(notification) {
            // Clear timeout if exists
            if (notification.dataset.timeoutId) {
                clearTimeout(notification.dataset.timeoutId);
            }
            
            // Animate out
            notification.classList.remove('show');
            
            // Remove after animation
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        },
        
        // Convenience methods for different notification types
        success: function(message, duration) {
            return this.show(message, 'success', duration);
        },
        
        error: function(message, duration) {
            return this.show(message, 'error', duration);
        },
        
        warning: function(message, duration) {
            return this.show(message, 'warning', duration);
        },
        
        info: function(message, duration) {
            return this.show(message, 'info', duration);
        }
    }
};

// Initialize module when page loads
document.addEventListener('DOMContentLoaded', function() {
    UI.init();
    
    // Expose notifications globally as Utils.showNotification
    window.Utils = window.Utils || {};
    
    Utils.showNotification = function(message, type = 'info', duration = 4000) {
        return UI.notifications.show(message, type, duration);
    };
    
    Utils.showLoading = function(element) {
        return UI.showLoading(element);
    };
    
    Utils.hideLoading = function(element) {
        return UI.hideLoading(element);
    };
    
    Utils.showSkeleton = function(container, type, count) {
        return UI.showSkeleton(container, type, count);
    };
    
    Utils.hideSkeleton = function(container) {
        return UI.hideSkeleton(container);
    };
    
    Utils.pageTransition = function(callback) {
        return UI.pageTransition(callback);
    };
});