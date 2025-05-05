/**
 * Touch Controls Module
 * Provides enhanced touch interaction for mobile devices
 */

// Main initialization function
function initTouchControls() {
  // Only apply touch optimizations on touch devices
  if (isTouchDevice()) {
    console.log('Touch device detected, initializing touch controls');
    document.body.classList.add('touch-friendly');
    
    // Initialize all touch-specific features
    initSwipeNavigation();
    initMobileBottomNav();
    initTouchFeedback();
    initPullToRefresh();
    initTouchCarousels();
  }
}

/**
 * Detect if device has touch capabilities
 * @returns {boolean} - True if touch device
 */
function isTouchDevice() {
  return ('ontouchstart' in window) ||
         (navigator.maxTouchPoints > 0) ||
         (navigator.msMaxTouchPoints > 0);
}

/**
 * Initialize swipe navigation for horizontal scrolling elements
 */
function initSwipeNavigation() {
  const swipeContainers = document.querySelectorAll('.swipe-container');
  
  swipeContainers.forEach(container => {
    const wrapper = container.querySelector('.swipe-wrapper');
    let startX, startY;
    let distX, distY;
    let startTime;
    let isScrolling;
    let currentSlide = 0;
    
    // Event handlers for touch events
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    function handleTouchStart(e) {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      distX = 0;
      distY = 0;
      startTime = new Date().getTime();
      isScrolling = undefined;
      
      // Stop any transition
      wrapper.style.transition = 'none';
    }
    
    function handleTouchMove(e) {
      if (!startX || !startY) return;
      
      const touch = e.touches[0];
      distX = touch.clientX - startX;
      distY = touch.clientY - startY;
      
      // Determine if scrolling or swiping horizontally
      if (typeof isScrolling === 'undefined') {
        isScrolling = Math.abs(distY) > Math.abs(distX);
      }
      
      // Only handle horizontal swipes
      if (!isScrolling) {
        e.preventDefault();
        // Move the wrapper with the finger
        const slides = wrapper.querySelectorAll('.swipe-slide');
        const slideWidth = container.offsetWidth;
        const currentOffset = -currentSlide * slideWidth;
        
        wrapper.style.transform = `translateX(${currentOffset + distX}px)`;
      }
    }
    
    function handleTouchEnd(e) {
      const slides = wrapper.querySelectorAll('.swipe-slide');
      const slideWidth = container.offsetWidth;
      const duration = new Date().getTime() - startTime;
      
      // Re-enable transitions
      wrapper.style.transition = 'transform 0.3s ease-out';
      
      // Quick, significant swipe or move past threshold
      if (!isScrolling && slides.length > 1) {
        const threshold = slideWidth / 3;
        const quickSwipe = duration < 300 && Math.abs(distX) > 30;
        
        if (distX > threshold || quickSwipe && distX > 0) {
          // Swipe right - go to previous slide
          currentSlide = Math.max(0, currentSlide - 1);
        } else if (distX < -threshold || quickSwipe && distX < 0) {
          // Swipe left - go to next slide
          currentSlide = Math.min(slides.length - 1, currentSlide + 1);
        }
      }
      
      // Move to current slide position
      wrapper.style.transform = `translateX(${-currentSlide * slideWidth}px)`;
      
      // Call slide change callback if defined
      if (container.dataset.onSlideChange) {
        const fn = window[container.dataset.onSlideChange];
        if (typeof fn === 'function') {
          fn(currentSlide);
        }
      }
      
      // Reset values
      startX = null;
      startY = null;
      isScrolling = undefined;
    }
  });
}

/**
 * Initialize mobile bottom navigation
 */
function initMobileBottomNav() {
  // Create mobile bottom navigation if it doesn't exist
  if (!document.querySelector('.mobile-bottom-nav') && window.innerWidth < 768) {
    const nav = document.createElement('nav');
    nav.className = 'mobile-bottom-nav';
    
    // Define the main navigation items
    const navItems = [
      { icon: 'home', text: 'Home', href: '/' },
      { icon: 'store', text: 'Store', href: '/store' },
      { icon: 'library_books', text: 'Library', href: '/library' },
      { icon: 'people', text: 'Community', href: '/community' },
      { icon: 'person', text: 'Profile', href: '/profile' }
    ];
    
    // Create the navigation items
    navItems.forEach(item => {
      const link = document.createElement('a');
      link.href = item.href;
      
      // Check if this is the current page
      const isActive = window.location.pathname === item.href || 
                      (item.href !== '/' && window.location.pathname.startsWith(item.href));
      
      if (isActive) {
        link.classList.add('active');
      }
      
      const icon = document.createElement('span');
      icon.className = 'icon material-icons';
      icon.textContent = item.icon;
      
      const text = document.createElement('span');
      text.textContent = item.text;
      
      link.appendChild(icon);
      link.appendChild(text);
      nav.appendChild(link);
    });
    
    // Append to body
    document.body.appendChild(nav);
    
    // Add padding to the bottom of the page to account for the nav
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.style.paddingBottom = '60px';
    }
  }
}

/**
 * Initialize touch feedback effects for interactive elements
 */
function initTouchFeedback() {
  const interactiveElements = document.querySelectorAll('button, .btn, .game-card, .nav-item, .filter-option');
  
  interactiveElements.forEach(element => {
    element.addEventListener('touchstart', () => {
      element.classList.add('touch-active');
    }, { passive: true });
    
    ['touchend', 'touchcancel'].forEach(eventType => {
      element.addEventListener(eventType, () => {
        element.classList.remove('touch-active');
      }, { passive: true });
    });
  });
}

/**
 * Initialize pull-to-refresh functionality for content areas
 */
function initPullToRefresh() {
  const refreshableContainers = document.querySelectorAll('.ptr-container');
  
  refreshableContainers.forEach(container => {
    let startY;
    let pullDistance = 0;
    const distanceThreshold = 60;
    const maxPullDistance = 80;
    let isPulling = false;
    let isRefreshing = false;
    
    // Create pull-to-refresh indicator if it doesn't exist
    let indicator = container.querySelector('.ptr-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'ptr-indicator';
      indicator.innerHTML = '<span class="ptr-icon material-icons">refresh</span><span class="ptr-text">Pull to refresh</span>';
      container.insertBefore(indicator, container.firstChild);
    }
    
    // Event handlers
    container.addEventListener('touchstart', e => {
      if (container.scrollTop === 0 && !isRefreshing) {
        startY = e.touches[0].clientY;
        isPulling = true;
      }
    }, { passive: true });
    
    container.addEventListener('touchmove', e => {
      if (!isPulling) return;
      
      pullDistance = Math.min(maxPullDistance, e.touches[0].clientY - startY);
      
      if (pullDistance > 0) {
        e.preventDefault(); // Prevent scroll when pulling
        indicator.style.transform = `translateY(${pullDistance}px)`;
        
        // Update text based on pull distance
        const ptrText = indicator.querySelector('.ptr-text');
        if (ptrText) {
          ptrText.textContent = pullDistance > distanceThreshold ? 'Release to refresh' : 'Pull to refresh';
        }
      }
    }, { passive: false });
    
    container.addEventListener('touchend', e => {
      if (!isPulling) return;
      
      if (pullDistance > distanceThreshold) {
        // Trigger refresh
        isRefreshing = true;
        indicator.style.transform = `translateY(${distanceThreshold}px)`;
        
        // Update indicator to show loading state
        const ptrText = indicator.querySelector('.ptr-text');
        const ptrIcon = indicator.querySelector('.ptr-icon');
        if (ptrText) ptrText.textContent = 'Refreshing...';
        if (ptrIcon) ptrIcon.textContent = 'loop';
        if (ptrIcon) ptrIcon.classList.add('rotating');
        
        // Call refresh function if specified
        if (container.dataset.refreshFunction) {
          const refreshFn = window[container.dataset.refreshFunction];
          if (typeof refreshFn === 'function') {
            refreshFn().then(() => {
              completeRefresh();
            }).catch(() => {
              completeRefresh();
            });
          } else {
            // If no function found or error, complete after delay
            setTimeout(completeRefresh, 1500);
          }
        } else {
          // Default: just simulate a refresh with a delay
          setTimeout(completeRefresh, 1500);
        }
      } else {
        // Reset without refreshing
        indicator.style.transform = 'translateY(0)';
      }
      
      isPulling = false;
      pullDistance = 0;
    }, { passive: true });
    
    function completeRefresh() {
      // Reset the indicator
      indicator.style.transition = 'transform 0.3s ease-out';
      indicator.style.transform = 'translateY(0)';
      
      // Reset state and indicator
      setTimeout(() => {
        isRefreshing = false;
        indicator.style.transition = '';
        
        const ptrText = indicator.querySelector('.ptr-text');
        const ptrIcon = indicator.querySelector('.ptr-icon');
        if (ptrText) ptrText.textContent = 'Pull to refresh';
        if (ptrIcon) ptrIcon.textContent = 'refresh';
        if (ptrIcon) ptrIcon.classList.remove('rotating');
      }, 300);
    }
  });
}

/**
 * Initialize carousels with touch support
 */
function initTouchCarousels() {
  const carousels = document.querySelectorAll('.carousel, .slider, .offers-slider');
  
  carousels.forEach(carousel => {
    // Convert standard carousels to swipe-friendly versions
    if (!carousel.classList.contains('swipe-container')) {
      // Get the carousel items container
      const itemsContainer = carousel.querySelector('.carousel-items, .slider-items, .offers-container');
      
      if (itemsContainer) {
        // Add necessary classes
        carousel.classList.add('swipe-container');
        itemsContainer.classList.add('swipe-wrapper');
        
        // Add swipe-slide class to all slides
        const slides = itemsContainer.children;
        Array.from(slides).forEach(slide => {
          slide.classList.add('swipe-slide');
        });
      }
    }
  });
  
  // Now initialize all carousels with swipe support
  initSwipeNavigation();
}

// Initialize touch controls when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initTouchControls);

// Re-initialize when window is resized
window.addEventListener('resize', () => {
  // Debounce to prevent excessive calls
  clearTimeout(window.resizeTimer);
  window.resizeTimer = setTimeout(initTouchControls, 250);
});