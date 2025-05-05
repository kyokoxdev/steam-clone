/**
 * Gamepad Controller Support for GameHub Store
 * 
 * This module adds gamepad/controller navigation support to the website,
 * providing a console-like experience when browsing with a controller.
 */

class GamepadController {
  constructor() {
    // Controller configuration
    this.config = {
      deadzone: 0.25,           // Minimum input threshold to register as movement
      repeatDelay: 500,         // Initial delay before input repetition (ms)
      repeatRate: 100,          // Delay between repeated inputs when held (ms)
      focusClass: 'gamepad-focus', // CSS class added to focused elements
      focusOutlineSize: '3px',  // Size of the focus outline
      focusOutlineColor: '#1a9fff', // Color of the focus outline (Steam blue)
      buttonMap: {              // Standard gamepad button mapping
        0: 'a',                 // A button / Cross
        1: 'b',                 // B button / Circle
        2: 'x',                 // X button / Square
        3: 'y',                 // Y button / Triangle
        4: 'lb',                // Left bumper
        5: 'rb',                // Right bumper
        6: 'lt',                // Left trigger
        7: 'rt',                // Right trigger
        8: 'back',              // Back / Share
        9: 'start',             // Start / Options
        10: 'ls',               // Left stick press
        11: 'rs',               // Right stick press
        12: 'up',               // D-pad up
        13: 'down',             // D-pad down
        14: 'left',             // D-pad left
        15: 'right',            // D-pad right
        16: 'home'              // Home / Guide
      }
    };

    // State tracking
    this.gamepads = {};
    this.activeGamepad = null;
    this.lastInputTime = 0;
    this.repeatWait = false;
    this.buttonStates = {};
    this.axisStates = {
      leftX: 0,
      leftY: 0,
      rightX: 0,
      rightY: 0
    };
    
    // Navigation state
    this.currentFocusElement = null;
    this.focusGrid = [];
    this.focusGridIndex = -1;
    this.lastNavigationDirection = null;
    
    // Overlay
    this.overlayVisible = false;
    this.overlay = null;
    
    // Animation frame reference for main loop
    this.animationFrame = null;
    
    // Custom event for controller connection
    this.controllerConnectedEvent = new CustomEvent('gamepadConnected');
    this.controllerDisconnectedEvent = new CustomEvent('gamepadDisconnected');
    
    // Init methods
    this.bindEvents();
    this.createStyles();
    this.buildFocusableElementsGrid();
    
    // Start the update loop
    this.startPolling();
    
    // Log initialization
    console.log('GamepadController initialized');
  }
  
  /**
   * Bind event listeners for gamepad connections
   */
  bindEvents() {
    window.addEventListener('gamepadconnected', (e) => this.onGamepadConnected(e));
    window.addEventListener('gamepaddisconnected', (e) => this.onGamepadDisconnected(e));
    
    // Rebuild focusable elements when DOM changes significantly
    const observer = new MutationObserver((mutations) => {
      let shouldRebuild = false;
      
      for (const mutation of mutations) {
        // Only rebuild if elements were added or removed
        if (mutation.type === 'childList' && 
            (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
          shouldRebuild = true;
          break;
        }
      }
      
      if (shouldRebuild) {
        setTimeout(() => this.buildFocusableElementsGrid(), 100);
      }
    });
    
    // Observe the entire document
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    // Handle window resizing
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => this.buildFocusableElementsGrid(), 250);
    });
    
    // Handle keyboard focus to sync with gamepad focus
    document.addEventListener('focusin', (e) => {
      const index = this.focusGrid.findIndex(el => el === e.target);
      if (index >= 0) {
        this.focusGridIndex = index;
        this.updateFocusedElement();
      }
    });
  }
  
  /**
   * Create necessary CSS styles for gamepad navigation
   */
  createStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .${this.config.focusClass} {
        outline: ${this.config.focusOutlineSize} solid ${this.config.focusOutlineColor} !important;
        outline-offset: 2px !important;
        transition: outline 0.1s ease !important;
      }
      
      .controller-overlay {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: rgba(23, 26, 33, 0.85);
        border: 1px solid #1a9fff;
        border-radius: 8px;
        color: white;
        padding: 10px 15px;
        font-size: 14px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 8px;
        backdrop-filter: blur(4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        max-width: 300px;
        transition: opacity 0.3s ease, transform 0.3s ease;
        opacity: 0;
        transform: translateY(20px);
        pointer-events: none;
      }
      
      .controller-overlay.visible {
        opacity: 1;
        transform: translateY(0);
      }
      
      .controller-overlay .title {
        font-weight: bold;
        margin-bottom: 5px;
        color: #1a9fff;
      }
      
      .controller-overlay .control {
        display: flex;
        align-items: center;
        margin-bottom: 3px;
      }
      
      .controller-overlay .button {
        background-color: #444;
        color: white;
        font-size: 12px;
        font-weight: bold;
        min-width: 24px;
        height: 24px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 8px;
      }
      
      .controller-overlay .action {
        flex: 1;
      }
    `;
    document.head.appendChild(style);
  }
  
  /**
   * Handle gamepad connection event
   */
  onGamepadConnected(event) {
    const gamepad = event.gamepad;
    this.gamepads[gamepad.index] = gamepad;
    this.activeGamepad = gamepad;
    
    console.log(`Gamepad connected: ${gamepad.id} (Index: ${gamepad.index})`);
    
    // Show the controller overlay
    this.showControllerOverlay();
    
    // Add controller-navigation class to body
    document.body.classList.add('controller-navigation');
    
    // If we don't have a focus index yet, set the first element
    if (this.focusGridIndex === -1 && this.focusGrid.length > 0) {
      this.focusGridIndex = 0;
      this.updateFocusedElement();
    }
    
    // Dispatch custom event
    document.dispatchEvent(this.controllerConnectedEvent);
  }
  
  /**
   * Handle gamepad disconnection event
   */
  onGamepadDisconnected(event) {
    const gamepad = event.gamepad;
    console.log(`Gamepad disconnected: ${gamepad.id} (Index: ${gamepad.index})`);
    
    delete this.gamepads[gamepad.index];
    
    // If this was the active gamepad, check if we have others
    if (this.activeGamepad && this.activeGamepad.index === gamepad.index) {
      const remainingGamepads = Object.values(this.gamepads);
      this.activeGamepad = remainingGamepads.length > 0 ? remainingGamepads[0] : null;
    }
    
    // If no gamepads left, remove controller class
    if (!this.activeGamepad) {
      document.body.classList.remove('controller-navigation');
      
      // Hide any gamepad focus
      if (this.currentFocusElement) {
        this.currentFocusElement.classList.remove(this.config.focusClass);
        this.currentFocusElement = null;
      }
      
      // Hide controller overlay
      this.hideControllerOverlay();
      
      // Dispatch custom event
      document.dispatchEvent(this.controllerDisconnectedEvent);
    }
  }
  
  /**
   * Start polling for gamepad input
   */
  startPolling() {
    // Check if the Gamepad API is available
    if (!navigator.getGamepads) {
      console.warn('Gamepad API not supported in this browser');
      return;
    }
    
    // Start the polling loop
    this.update();
  }
  
  /**
   * Main update loop - polls for gamepad input
   */
  update() {
    this.pollGamepads();
    this.processGamepadInput();
    this.animationFrame = requestAnimationFrame(() => this.update());
  }
  
  /**
   * Poll for connected gamepads and update internal state
   */
  pollGamepads() {
    // Some browsers require polling for gamepad connections
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    
    for (const gamepad of gamepads) {
      if (gamepad && !(gamepad.index in this.gamepads)) {
        // We found a gamepad that we didn't know about yet
        this.gamepads[gamepad.index] = gamepad;
        this.activeGamepad = gamepad;
        console.log(`Gamepad found via polling: ${gamepad.id} (Index: ${gamepad.index})`);
        
        // Add controller-navigation class to body
        document.body.classList.add('controller-navigation');
        
        // Show the controller overlay
        this.showControllerOverlay();
        
        // Dispatch custom event
        document.dispatchEvent(this.controllerConnectedEvent);
      }
    }
  }
  
  /**
   * Process input from active gamepad
   */
  processGamepadInput() {
    if (!this.activeGamepad) return;
    
    // Get fresh gamepad data
    const gamepad = navigator.getGamepads()[this.activeGamepad.index];
    if (!gamepad) return;
    
    // Update button states and check for changes
    this.processButtons(gamepad);
    
    // Process joystick/analog stick input
    this.processAxes(gamepad);
  }
  
  /**
   * Process button inputs
   */
  processButtons(gamepad) {
    const now = Date.now();
    const timeSinceLastInput = now - this.lastInputTime;
    
    for (let i = 0; i < gamepad.buttons.length; i++) {
      const buttonName = this.config.buttonMap[i] || `button${i}`;
      const button = gamepad.buttons[i];
      const pressed = button.pressed || button.value > 0.5;
      const wasPressed = this.buttonStates[buttonName];
      
      // Store the current button state
      this.buttonStates[buttonName] = pressed;
      
      // Handle button press/release
      if (pressed && !wasPressed) {
        // Button just pressed
        this.onButtonDown(buttonName);
        this.lastInputTime = now;
        this.repeatWait = true;
        setTimeout(() => {
          this.repeatWait = false;
        }, this.config.repeatDelay);
      } else if (!pressed && wasPressed) {
        // Button just released
        this.onButtonUp(buttonName);
      } else if (pressed && wasPressed && !this.repeatWait && 
                 timeSinceLastInput >= this.config.repeatRate) {
        // Button held down - trigger repeat after delay
        this.onButtonHeld(buttonName);
        this.lastInputTime = now;
      }
    }
  }
  
  /**
   * Process axes inputs (analog sticks)
   */
  processAxes(gamepad) {
    const now = Date.now();
    const timeSinceLastInput = now - this.lastInputTime;
    
    // Most common gamepad layout: 
    // 0: Left stick horizontal (negative: left, positive: right)
    // 1: Left stick vertical (negative: up, positive: down)
    // 2: Right stick horizontal (negative: left, positive: right)
    // 3: Right stick vertical (negative: up, positive: down)
    const axes = {
      leftX: gamepad.axes[0],
      leftY: gamepad.axes[1],
      rightX: gamepad.axes[2] || 0,
      rightY: gamepad.axes[3] || 0
    };
    
    // Apply deadzones
    for (const axis in axes) {
      const value = axes[axis];
      if (Math.abs(value) < this.config.deadzone) {
        axes[axis] = 0;
      }
    }
    
    // Check for digital-style input from analog sticks
    const directions = {
      up: axes.leftY < -this.config.deadzone,
      down: axes.leftY > this.config.deadzone,
      left: axes.leftX < -this.config.deadzone,
      right: axes.leftX > this.config.deadzone
    };
    
    // Previous state
    const prevDirections = {
      up: this.axisStates.leftY < -this.config.deadzone,
      down: this.axisStates.leftY > this.config.deadzone,
      left: this.axisStates.leftX < -this.config.deadzone,
      right: this.axisStates.leftX > this.config.deadzone
    };
    
    // Save current state
    this.axisStates = axes;
    
    // For each direction, check for changes or repeats
    for (const dir in directions) {
      if (directions[dir] && !prevDirections[dir]) {
        // Direction just started
        this.onDirectionalInput(dir);
        this.lastInputTime = now;
        this.repeatWait = true;
        setTimeout(() => {
          this.repeatWait = false;
        }, this.config.repeatDelay);
      } else if (directions[dir] && prevDirections[dir] && !this.repeatWait && 
                 timeSinceLastInput >= this.config.repeatRate) {
        // Direction held - trigger repeat
        this.onDirectionalInput(dir);
        this.lastInputTime = now;
      }
    }
    
    // Process right stick for scrolling
    if (Math.abs(axes.rightY) > this.config.deadzone) {
      // Use right stick for scrolling
      window.scrollBy(0, axes.rightY * 15);
    }
  }
  
  /**
   * Handle button press events
   */
  onButtonDown(button) {
    console.log(`Button pressed: ${button}`);
    
    switch (button) {
      case 'a': // A button - Select/Click
        this.simulateClick();
        break;
      case 'b': // B button - Back/Cancel
        this.navigateBack();
        break;
      case 'x': // X button - Secondary action (context dependent)
        this.performSecondaryAction();
        break;
      case 'y': // Y button - Open search
        this.focusSearch();
        break;
      case 'start': // Start button - Toggle menu
        this.toggleMenu();
        break;
      case 'back': // Back button - Toggle controller overlay
        this.toggleControllerOverlay();
        break;
      case 'lb': // Left bumper - Previous tab/category
        this.navigatePreviousCategory();
        break;
      case 'rb': // Right bumper - Next tab/category
        this.navigateNextCategory();
        break;
      case 'lt': // Left trigger - Scroll up
        window.scrollBy(0, -300);
        break;
      case 'rt': // Right trigger - Scroll down
        window.scrollBy(0, 300);
        break;
      case 'up': // D-pad up - Navigate up
        this.navigateDirection('up');
        break;
      case 'down': // D-pad down - Navigate down
        this.navigateDirection('down');
        break;
      case 'left': // D-pad left - Navigate left
        this.navigateDirection('left');
        break;
      case 'right': // D-pad right - Navigate right
        this.navigateDirection('right');
        break;
      case 'home': // Home button - Go to homepage
        window.location.href = '/';
        break;
    }
  }
  
  /**
   * Handle button release events
   */
  onButtonUp(button) {
    // Currently not using button up events
  }
  
  /**
   * Handle button hold events
   */
  onButtonHeld(button) {
    // For held buttons, only respond to directional inputs
    switch (button) {
      case 'up':
        this.navigateDirection('up');
        break;
      case 'down':
        this.navigateDirection('down');
        break;
      case 'left':
        this.navigateDirection('left');
        break;
      case 'right':
        this.navigateDirection('right');
        break;
      case 'lt':
        window.scrollBy(0, -100);
        break;
      case 'rt':
        window.scrollBy(0, 100);
        break;
    }
  }
  
  /**
   * Handle directional input from analog sticks
   */
  onDirectionalInput(direction) {
    this.navigateDirection(direction);
  }
  
  /**
   * Build a grid of all focusable elements on the page
   */
  buildFocusableElementsGrid() {
    // Define selectors for focusable elements
    const selector = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"]), .game-card, .category-card, .nav-item, .clickable';
    
    // Get all focusable elements
    const elements = Array.from(document.querySelectorAll(selector))
      .filter(el => {
        // Check if element is visible and in the viewport
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        
        return rect.width > 0 && 
               rect.height > 0 && 
               style.display !== 'none' && 
               style.visibility !== 'hidden' &&
               style.opacity !== '0';
      });
    
    this.focusGrid = elements;
    
    // If we lost our focused element, reset
    if (this.currentFocusElement && !this.focusGrid.includes(this.currentFocusElement)) {
      this.currentFocusElement = null;
      this.focusGridIndex = -1;
    }
    
    // If we have elements and no current focus, set to first element
    if (this.focusGrid.length > 0 && this.activeGamepad && this.focusGridIndex === -1) {
      this.focusGridIndex = 0;
      this.updateFocusedElement();
    }
    
    console.log(`Built focus grid with ${this.focusGrid.length} elements`);
  }
  
  /**
   * Navigate in a specific direction
   */
  navigateDirection(direction) {
    this.lastNavigationDirection = direction;
    
    if (this.focusGrid.length === 0) {
      this.buildFocusableElementsGrid();
      return;
    }
    
    // If no element is focused yet, focus the first one
    if (this.focusGridIndex === -1) {
      this.focusGridIndex = 0;
      this.updateFocusedElement();
      return;
    }
    
    // Find next element in desired direction
    const currentElement = this.focusGrid[this.focusGridIndex];
    if (!currentElement) return;
    
    const currentRect = currentElement.getBoundingClientRect();
    const currentCenter = {
      x: currentRect.left + currentRect.width / 2,
      y: currentRect.top + currentRect.height / 2
    };
    
    // Find best candidate for next focus
    let bestCandidate = null;
    let bestDistance = Infinity;
    let bestScore = Infinity;
    
    for (let i = 0; i < this.focusGrid.length; i++) {
      if (i === this.focusGridIndex) continue; // Skip current element
      
      const candidateElement = this.focusGrid[i];
      const candidateRect = candidateElement.getBoundingClientRect();
      const candidateCenter = {
        x: candidateRect.left + candidateRect.width / 2,
        y: candidateRect.top + candidateRect.height / 2
      };
      
      // Calculate vector from current to candidate
      const vector = {
        x: candidateCenter.x - currentCenter.x,
        y: candidateCenter.y - currentCenter.y
      };
      
      // Calculate straight-line distance
      const distance = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
      
      // Check if candidate is in the correct direction
      let inDirection = false;
      
      switch (direction) {
        case 'up':
          inDirection = vector.y < 0 && Math.abs(vector.y) > Math.abs(vector.x) / 2;
          break;
        case 'down':
          inDirection = vector.y > 0 && Math.abs(vector.y) > Math.abs(vector.x) / 2;
          break;
        case 'left':
          inDirection = vector.x < 0 && Math.abs(vector.x) > Math.abs(vector.y) / 2;
          break;
        case 'right':
          inDirection = vector.x > 0 && Math.abs(vector.x) > Math.abs(vector.y) / 2;
          break;
      }
      
      if (inDirection) {
        // Calculate directional distance (prioritize elements directly in path)
        let directionalAlignment;
        if (direction === 'up' || direction === 'down') {
          directionalAlignment = Math.abs(vector.x) / (Math.abs(vector.y) || 1);
        } else {
          directionalAlignment = Math.abs(vector.y) / (Math.abs(vector.x) || 1);
        }
        
        // Calculate score (lower is better)
        const score = distance * (1 + directionalAlignment);
        
        if (score < bestScore) {
          bestCandidate = i;
          bestDistance = distance;
          bestScore = score;
        }
      }
    }
    
    // If we found a candidate, focus it
    if (bestCandidate !== null) {
      this.focusGridIndex = bestCandidate;
      this.updateFocusedElement();
      
      // If element is not in view, scroll to it
      const element = this.focusGrid[this.focusGridIndex];
      const rect = element.getBoundingClientRect();
      
      if (rect.top < 50 || rect.bottom > window.innerHeight - 50) {
        element.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }
  
  /**
   * Update the visual focus indicator
   */
  updateFocusedElement() {
    // Remove focus from current element
    if (this.currentFocusElement) {
      this.currentFocusElement.classList.remove(this.config.focusClass);
    }
    
    // Update to new focused element
    this.currentFocusElement = this.focusGrid[this.focusGridIndex];
    
    if (this.currentFocusElement) {
      // Add focus class
      this.currentFocusElement.classList.add(this.config.focusClass);
      
      // Try to focus the element for keyboard as well
      if (this.currentFocusElement.tabIndex >= -1) {
        this.currentFocusElement.focus({ preventScroll: true });
      }
    }
  }
  
  /**
   * Simulate click on currently focused element
   */
  simulateClick() {
    if (!this.currentFocusElement) return;
    
    // Add active class briefly
    this.currentFocusElement.classList.add('active');
    setTimeout(() => {
      this.currentFocusElement.classList.remove('active');
    }, 100);
    
    // Simulate click
    this.currentFocusElement.click();
  }
  
  /**
   * Navigate back (like browser back)
   */
  navigateBack() {
    // Check if there's a back/cancel button on the page
    const backButton = document.querySelector('.back-button, .cancel-button, [data-action="back"]');
    if (backButton) {
      backButton.click();
    } else {
      // Otherwise use browser back
      window.history.back();
    }
  }
  
  /**
   * Perform context-dependent secondary action
   */
  performSecondaryAction() {
    if (!this.currentFocusElement) return;
    
    // Look for secondary action attribute or class
    if (this.currentFocusElement.dataset.secondaryAction) {
      // Execute specified action
      const action = this.currentFocusElement.dataset.secondaryAction;
      
      if (window[action] && typeof window[action] === 'function') {
        window[action](this.currentFocusElement);
      } else if (action.startsWith('http')) {
        window.open(action, '_blank');
      }
    } else if (this.currentFocusElement.classList.contains('game-card')) {
      // For game cards, add to wishlist might be the secondary action
      const wishlistButton = this.currentFocusElement.querySelector('.wishlist-button');
      if (wishlistButton) {
        wishlistButton.click();
      }
    }
  }
  
  /**
   * Focus search box
   */
  focusSearch() {
    const searchInput = document.querySelector('.search-box input, [type="search"]');
    if (searchInput) {
      // Find index of search input in our grid
      const index = this.focusGrid.findIndex(el => el === searchInput);
      if (index >= 0) {
        this.focusGridIndex = index;
        this.updateFocusedElement();
      } else {
        // Focus directly if not in grid
        searchInput.focus();
      }
    }
  }
  
  /**
   * Toggle main menu
   */
  toggleMenu() {
    const menuButton = document.querySelector('.menu-toggle, .hamburger-menu');
    if (menuButton) {
      menuButton.click();
    }
  }
  
  /**
   * Navigate to previous category/tab
   */
  navigatePreviousCategory() {
    const tabs = document.querySelectorAll('.tabs .tab, .nav-tabs .nav-item');
    if (tabs.length === 0) return;
    
    // Find active tab
    let activeIndex = Array.from(tabs).findIndex(tab => 
      tab.classList.contains('active') || 
      tab.getAttribute('aria-selected') === 'true'
    );
    
    if (activeIndex > 0) {
      // Select previous tab
      activeIndex--;
      tabs[activeIndex].click();
      
      // Update focus
      const index = this.focusGrid.findIndex(el => el === tabs[activeIndex]);
      if (index >= 0) {
        this.focusGridIndex = index;
        this.updateFocusedElement();
      }
    }
  }
  
  /**
   * Navigate to next category/tab
   */
  navigateNextCategory() {
    const tabs = document.querySelectorAll('.tabs .tab, .nav-tabs .nav-item');
    if (tabs.length === 0) return;
    
    // Find active tab
    let activeIndex = Array.from(tabs).findIndex(tab => 
      tab.classList.contains('active') || 
      tab.getAttribute('aria-selected') === 'true'
    );
    
    if (activeIndex < tabs.length - 1) {
      // Select next tab
      activeIndex++;
      tabs[activeIndex].click();
      
      // Update focus
      const index = this.focusGrid.findIndex(el => el === tabs[activeIndex]);
      if (index >= 0) {
        this.focusGridIndex = index;
        this.updateFocusedElement();
      }
    }
  }
  
  /**
   * Show controller help overlay
   */
  showControllerOverlay() {
    if (!this.overlay) {
      this.overlay = document.createElement('div');
      this.overlay.className = 'controller-overlay';
      this.overlay.innerHTML = `
        <div class="title">Controller Navigation</div>
        <div class="control"><div class="button">A</div><div class="action">Select / Click</div></div>
        <div class="control"><div class="button">B</div><div class="action">Back / Cancel</div></div>
        <div class="control"><div class="button">X</div><div class="action">Secondary Action</div></div>
        <div class="control"><div class="button">Y</div><div class="action">Search</div></div>
        <div class="control"><div class="button">🎮</div><div class="action">Toggle Help</div></div>
      `;
      document.body.appendChild(this.overlay);
    }
    
    // Show overlay and hide after a delay
    this.overlay.classList.add('visible');
    this.overlayVisible = true;
    
    // Auto-hide after 5 seconds
    clearTimeout(this.overlayTimeout);
    this.overlayTimeout = setTimeout(() => {
      this.hideControllerOverlay();
    }, 5000);
  }
  
  /**
   * Hide controller help overlay
   */
  hideControllerOverlay() {
    if (this.overlay) {
      this.overlay.classList.remove('visible');
      this.overlayVisible = false;
    }
  }
  
  /**
   * Toggle controller help overlay visibility
   */
  toggleControllerOverlay() {
    if (this.overlayVisible) {
      this.hideControllerOverlay();
    } else {
      this.showControllerOverlay();
    }
  }
}

// Initialize the gamepad controller when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.gamepadController = new GamepadController();
});