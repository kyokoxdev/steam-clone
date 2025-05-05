/**
 * Keyboard Shortcuts Overlay
 * Provides a visual reference for keyboard shortcuts available on the site
 */

class KeyboardShortcutsManager {
  constructor() {
    // Configuration
    this.config = {
      toggleKey: '?', // Press ? to show/hide the shortcuts overlay
      closeKey: 'Escape', // Press Escape to close the overlay
      overlayClass: 'keyboard-shortcuts-overlay',
      visibleClass: 'visible',
      shortcutGroups: [
        {
          name: 'Navigation',
          shortcuts: [
            { key: 'Tab', description: 'Move focus to next element' },
            { key: 'Shift + Tab', description: 'Move focus to previous element' },
            { key: 'Enter', description: 'Activate focused element' },
            { key: 'Home', description: 'Go to top of page' },
            { key: 'End', description: 'Go to bottom of page' },
            { key: 'PageUp', description: 'Scroll up one page' },
            { key: 'PageDown', description: 'Scroll down one page' }
          ]
        },
        {
          name: 'Store Navigation',
          shortcuts: [
            { key: 'G, S', description: 'Go to Store' },
            { key: 'G, L', description: 'Go to Library' },
            { key: 'G, C', description: 'Go to Community' },
            { key: 'G, P', description: 'Go to Profile' },
            { key: 'G, W', description: 'Go to Wishlist' },
            { key: 'G, H', description: 'Go to Home' }
          ]
        },
        {
          name: 'Game Actions',
          shortcuts: [
            { key: 'W', description: 'Add focused game to wishlist' },
            { key: 'C', description: 'Add focused game to cart' },
            { key: 'F', description: 'Follow game/curator' },
            { key: 'Shift + I', description: 'Install game (Library)' },
            { key: 'Shift + P', description: 'Play game (Library)' }
          ]
        },
        {
          name: 'Content & Display',
          shortcuts: [
            { key: 'Ctrl + B', description: 'Toggle sidebar' },
            { key: 'Ctrl + F', description: 'Search' },
            { key: 'Ctrl + D', description: 'Toggle dark/light mode' },
            { key: 'Ctrl + +', description: 'Increase text size' },
            { key: 'Ctrl + -', description: 'Decrease text size' },
            { key: 'Ctrl + 0', description: 'Reset text size' }
          ]
        },
        {
          name: 'Accessibility',
          shortcuts: [
            { key: 'Alt + 1', description: 'High contrast mode' },
            { key: 'Alt + A', description: 'Toggle screen reader announcements' },
            { key: 'Alt + F', description: 'Toggle focus mode' }
          ]
        }
      ]
    };
    
    // State
    this.overlayVisible = false;
    this.overlay = null;
    this.keySequence = [];
    this.keySequenceTimeout = null;
    
    // Initialize
    this.createOverlay();
    this.bindEvents();
  }
  
  /**
   * Create the keyboard shortcuts overlay
   */
  createOverlay() {
    // Create overlay container
    this.overlay = document.createElement('div');
    this.overlay.className = this.config.overlayClass;
    this.overlay.setAttribute('role', 'dialog');
    this.overlay.setAttribute('aria-labelledby', 'keyboard-shortcuts-title');
    this.overlay.setAttribute('aria-hidden', 'true');
    
    // Create overlay content
    let content = `
      <div class="overlay-header">
        <h2 id="keyboard-shortcuts-title">Keyboard Shortcuts</h2>
        <button class="close-button" aria-label="Close keyboard shortcuts">×</button>
      </div>
      <div class="overlay-content">
    `;
    
    // Add shortcut groups
    this.config.shortcutGroups.forEach(group => {
      content += `
        <div class="shortcut-group">
          <h3>${group.name}</h3>
          <div class="shortcuts-list">
      `;
      
      group.shortcuts.forEach(shortcut => {
        content += `
          <div class="shortcut-item">
            <div class="key-combo">${this.formatKeyCombo(shortcut.key)}</div>
            <div class="description">${shortcut.description}</div>
          </div>
        `;
      });
      
      content += `
          </div>
        </div>
      `;
    });
    
    content += `
      </div>
      <div class="overlay-footer">
        <p>Press <kbd>?</kbd> to toggle this overlay or <kbd>Escape</kbd> to close it.</p>
      </div>
    `;
    
    this.overlay.innerHTML = content;
    
    // Add overlay styles
    const style = document.createElement('style');
    style.textContent = `
      .${this.config.overlayClass} {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.85);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        padding: 2rem;
        color: #fff;
        overflow-y: auto;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s;
        backdrop-filter: blur(4px);
        font-family: var(--font-primary, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif);
      }
      
      .${this.config.overlayClass}.${this.config.visibleClass} {
        opacity: 1;
        visibility: visible;
      }
      
      .${this.config.overlayClass} .overlay-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        padding-bottom: 1rem;
      }
      
      .${this.config.overlayClass} .overlay-header h2 {
        margin: 0;
        font-size: 1.8rem;
        color: #1a9fff;
      }
      
      .${this.config.overlayClass} .close-button {
        background: none;
        border: none;
        color: #fff;
        font-size: 2rem;
        cursor: pointer;
        padding: 0;
        margin: 0;
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.7;
        transition: opacity 0.2s;
      }
      
      .${this.config.overlayClass} .close-button:hover {
        opacity: 1;
      }
      
      .${this.config.overlayClass} .overlay-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        flex: 1;
        overflow-y: auto;
      }
      
      .${this.config.overlayClass} .shortcut-group h3 {
        margin-top: 0;
        margin-bottom: 1rem;
        font-size: 1.2rem;
        color: #66c0f4;
        border-bottom: 1px solid rgba(102, 192, 244, 0.3);
        padding-bottom: 0.5rem;
      }
      
      .${this.config.overlayClass} .shortcuts-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      
      .${this.config.overlayClass} .shortcut-item {
        display: flex;
        align-items: center;
        line-height: 1.4;
      }
      
      .${this.config.overlayClass} .key-combo {
        min-width: 130px;
        margin-right: 1rem;
      }
      
      .${this.config.overlayClass} kbd {
        display: inline-block;
        padding: 0.2rem 0.5rem;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 3px;
        box-shadow: 0 2px 0 rgba(0, 0, 0, 0.2);
        font-family: monospace;
        font-size: 0.9rem;
        line-height: 1;
        white-space: nowrap;
        margin: 0 0.2rem;
      }
      
      .${this.config.overlayClass} .description {
        color: rgba(255, 255, 255, 0.8);
      }
      
      .${this.config.overlayClass} .overlay-footer {
        margin-top: 2rem;
        text-align: center;
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.9rem;
      }
      
      @media (max-width: 768px) {
        .${this.config.overlayClass} {
          padding: 1rem;
        }
        
        .${this.config.overlayClass} .overlay-content {
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(this.overlay);
    
    // Add event listener for close button
    const closeButton = this.overlay.querySelector('.close-button');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.hideOverlay());
    }
  }
  
  /**
   * Format key combination for display
   * @param {string} keyCombo - Key combination string (e.g., "Ctrl + C")
   * @returns {string} - Formatted HTML with <kbd> tags
   */
  formatKeyCombo(keyCombo) {
    return keyCombo
      .split(', ')
      .map(combo => 
        combo
          .split(' + ')
          .map(key => `<kbd>${key}</kbd>`)
          .join(' + ')
      )
      .join(' or ');
  }
  
  /**
   * Bind event listeners
   */
  bindEvents() {
    // Listen for keydown events
    document.addEventListener('keydown', (e) => {
      // Check for toggle key (?)
      if (!e.ctrlKey && !e.altKey && !e.metaKey && e.key === this.config.toggleKey) {
        this.toggleOverlay();
        e.preventDefault();
      }
      
      // Check for close key (Escape)
      if (this.overlayVisible && e.key === this.config.closeKey) {
        this.hideOverlay();
        e.preventDefault();
      }
      
      // Track key sequence for navigation shortcuts
      this.handleKeySequence(e);
    });
    
    // Close overlay when clicking outside the content
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.hideOverlay();
      }
    });
  }
  
  /**
   * Handle key sequences for navigation shortcuts (e.g., "G, S" for Store)
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleKeySequence(e) {
    // Only track when not in form elements
    const activeElement = document.activeElement;
    const isFormElement = activeElement.tagName === 'INPUT' || 
                           activeElement.tagName === 'TEXTAREA' || 
                           activeElement.tagName === 'SELECT' ||
                           activeElement.isContentEditable;
                           
    if (isFormElement) return;
    
    // Skip modifier-only keypresses
    if (e.key === 'Control' || e.key === 'Alt' || e.key === 'Shift' || e.key === 'Meta') return;
    
    // Build key with modifiers
    let keyPressed = '';
    if (e.ctrlKey) keyPressed += 'Ctrl + ';
    if (e.altKey) keyPressed += 'Alt + ';
    if (e.shiftKey) keyPressed += 'Shift + ';
    if (e.metaKey) keyPressed += 'Meta + ';
    keyPressed += e.key.length === 1 ? e.key.toUpperCase() : e.key;
    
    // Add to sequence
    this.keySequence.push(keyPressed);
    
    // Reset sequence after a delay
    clearTimeout(this.keySequenceTimeout);
    this.keySequenceTimeout = setTimeout(() => {
      this.keySequence = [];
    }, 1500);
    
    // Check for known sequences
    this.checkKeySequence();
  }
  
  /**
   * Check for known key sequences and execute actions
   */
  checkKeySequence() {
    // Single key shortcuts
    if (this.keySequence.length === 1) {
      const key = this.keySequence[0];
      
      switch (key) {
        case 'W':
          this.addFocusedGameToWishlist();
          break;
        case 'C':
          this.addFocusedGameToCart();
          break;
        case 'F':
          this.followFocusedItem();
          break;
        case 'Ctrl + B':
          this.toggleSidebar();
          break;
        case 'Ctrl + F':
          this.focusSearch();
          break;
        case 'Ctrl + D':
          this.toggleDarkMode();
          break;
        case 'Alt + 1':
          this.toggleHighContrastMode();
          break;
        case 'Alt + A':
          this.toggleScreenReaderAnnouncements();
          break;
        case 'Alt + F':
          this.toggleFocusMode();
          break;
        case 'Shift + I':
          this.installFocusedGame();
          break;
        case 'Shift + P':
          this.playFocusedGame();
          break;
      }
    }
    
    // Two-key sequences for navigation (e.g., "G, S")
    if (this.keySequence.length === 2 && this.keySequence[0] === 'G') {
      const secondKey = this.keySequence[1];
      
      switch (secondKey) {
        case 'S':
          window.location.href = '/store';
          break;
        case 'L':
          window.location.href = '/library';
          break;
        case 'C':
          window.location.href = '/community';
          break;
        case 'P':
          window.location.href = '/profile';
          break;
        case 'W':
          window.location.href = '/wishlist';
          break;
        case 'H':
          window.location.href = '/';
          break;
      }
    }
  }
  
  /**
   * Toggle overlay visibility
   */
  toggleOverlay() {
    if (this.overlayVisible) {
      this.hideOverlay();
    } else {
      this.showOverlay();
    }
  }
  
  /**
   * Show keyboard shortcuts overlay
   */
  showOverlay() {
    this.overlay.classList.add(this.config.visibleClass);
    this.overlay.setAttribute('aria-hidden', 'false');
    this.overlayVisible = true;
    
    // Trap focus within the overlay
    this.previouslyFocused = document.activeElement;
    
    // Focus first focusable element in the overlay
    const focusableElements = this.overlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    
    // Dispatch custom event
    document.dispatchEvent(new CustomEvent('keyboardShortcutsShown'));
  }
  
  /**
   * Hide keyboard shortcuts overlay
   */
  hideOverlay() {
    this.overlay.classList.remove(this.config.visibleClass);
    this.overlay.setAttribute('aria-hidden', 'true');
    this.overlayVisible = false;
    
    // Restore focus
    if (this.previouslyFocused) {
      this.previouslyFocused.focus();
    }
    
    // Restore body scrolling
    document.body.style.overflow = '';
    
    // Dispatch custom event
    document.dispatchEvent(new CustomEvent('keyboardShortcutsHidden'));
  }
  
  /**
   * Get currently focused game element
   * @returns {Element|null} - Focused game element or null
   */
  getFocusedGame() {
    // Check for element with gamepad focus class
    const gamepadFocused = document.querySelector('.gamepad-focus.game-card');
    if (gamepadFocused) return gamepadFocused;
    
    // Check for focused element within a game card
    const activeElement = document.activeElement;
    if (activeElement) {
      const gameCard = activeElement.closest('.game-card');
      if (gameCard) return gameCard;
    }
    
    // Return null if no game is focused
    return null;
  }
  
  /**
   * Add focused game to wishlist
   */
  addFocusedGameToWishlist() {
    const game = this.getFocusedGame();
    if (!game) return;
    
    const wishlistButton = game.querySelector('.wishlist-button');
    if (wishlistButton) {
      wishlistButton.click();
    }
  }
  
  /**
   * Add focused game to cart
   */
  addFocusedGameToCart() {
    const game = this.getFocusedGame();
    if (!game) return;
    
    const cartButton = game.querySelector('.add-to-cart, .buy-button');
    if (cartButton) {
      cartButton.click();
    }
  }
  
  /**
   * Follow focused item (game, curator, etc.)
   */
  followFocusedItem() {
    const followButton = document.querySelector('.follow-button:focus') || 
                          document.querySelector('.gamepad-focus .follow-button');
    if (followButton) {
      followButton.click();
    }
  }
  
  /**
   * Toggle sidebar visibility
   */
  toggleSidebar() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
      sidebarToggle.click();
    } else {
      document.body.classList.toggle('sidebar-collapsed');
    }
  }
  
  /**
   * Focus search input
   */
  focusSearch() {
    const searchInput = document.querySelector('.search-box input, [type="search"]');
    if (searchInput) {
      searchInput.focus();
    }
  }
  
  /**
   * Toggle dark/light mode
   */
  toggleDarkMode() {
    // Check if theme toggle exists
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.click();
    } else if (window.themeManager && typeof window.themeManager.toggleTheme === 'function') {
      // Call theme manager if available
      window.themeManager.toggleTheme();
    } else {
      // Fallback: toggle dark class on html element
      document.documentElement.classList.toggle('dark');
    }
  }
  
  /**
   * Toggle high contrast mode
   */
  toggleHighContrastMode() {
    // Check if high contrast toggle exists
    const contrastToggle = document.querySelector('.contrast-toggle');
    if (contrastToggle) {
      contrastToggle.click();
    } else {
      // Fallback: toggle high-contrast class on html element
      document.documentElement.classList.toggle('high-contrast');
    }
  }
  
  /**
   * Toggle screen reader announcements
   */
  toggleScreenReaderAnnouncements() {
    // Dispatch event for screen reader enhancement module to handle
    document.dispatchEvent(new CustomEvent('toggleScreenReaderAnnouncements'));
  }
  
  /**
   * Toggle focus mode (reduces distractions)
   */
  toggleFocusMode() {
    document.body.classList.toggle('focus-mode');
  }
  
  /**
   * Install focused game (Library)
   */
  installFocusedGame() {
    const game = this.getFocusedGame();
    if (!game) return;
    
    const installButton = game.querySelector('.install-button');
    if (installButton) {
      installButton.click();
    }
  }
  
  /**
   * Play focused game (Library)
   */
  playFocusedGame() {
    const game = this.getFocusedGame();
    if (!game) return;
    
    const playButton = game.querySelector('.play-button');
    if (playButton) {
      playButton.click();
    }
  }
}

// Initialize keyboard shortcuts manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.keyboardShortcutsManager = new KeyboardShortcutsManager();
});