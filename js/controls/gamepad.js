/**
 * Steam Clone - Gamepad/Controller Navigation Support
 * Enables navigation using game controllers on supported browsers
 */

class GamepadController {
  constructor() {
    this.controllers = {};
    this.haveEvents = 'ongamepadconnected' in window;
    this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    this.currentFocusIndex = 0;
    this.focusableItems = [];
    this.buttonPressThreshold = 0.5;
    this.analogThreshold = 0.5;
    this.repeatDelay = 500; // ms before starting repeating inputs
    this.repeatRate = 100; // ms between repeated inputs
    this.lastInputTime = 0;
    this.isRepeating = false;
    this.lastInputDirection = null;
    
    // State for button holds
    this.buttonStates = {
      up: false,
      down: false,
      left: false,
      right: false,
      a: false,
      b: false
    };
    
    // UI Indicator
    this.controllerIndicator = null;
    
    // Initialize
    this.init();
  }
  
  init() {
    // Create controller indicator
    this.createControllerIndicator();
    
    // Set up event listeners
    if (this.haveEvents) {
      window.addEventListener('gamepadconnected', this.connectHandler.bind(this));
      window.addEventListener('gamepaddisconnected', this.disconnectHandler.bind(this));
    } else {
      // Poll for gamepads if the API doesn't support events
      this.startPolling();
    }
    
    // Update focusable elements on DOM changes
    const observer = new MutationObserver(() => this.updateFocusableElements());
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Initial scan for focusable elements
    this.updateFocusableElements();
    
    // Start the input loop
    requestAnimationFrame(this.checkGamepadInputs.bind(this));
  }
  
  createControllerIndicator() {
    // Only create if it doesn't exist
    if (document.getElementById('controller-indicator')) return;
    
    const indicator = document.createElement('div');
    indicator.id = 'controller-indicator';
    indicator.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path d="M17.5,7A5.5,5.5 0 0,1 23,12.5A5.5,5.5 0 0,1 17.5,18C15.79,18 14.27,17.22 13.26,16H10.74C9.73,17.22 8.21,18 6.5,18A5.5,5.5 0 0,1 1,12.5A5.5,5.5 0 0,1 6.5,7H17.5M6.5,9A3.5,3.5 0 0,0 3,12.5A3.5,3.5 0 0,0 6.5,16C7.9,16 9.1,15.18 9.66,14H14.34C14.9,15.18 16.1,16 17.5,16A3.5,3.5 0 0,0 21,12.5A3.5,3.5 0 0,0 17.5,9H6.5M5.75,10.25H7.25V11.75H8.75V13.25H7.25V14.75H5.75V13.25H4.25V11.75H5.75V10.25M16.75,12.5A1,1 0 0,1 17.75,13.5A1,1 0 0,1 16.75,14.5A1,1 0 0,1 15.75,13.5A1,1 0 0,1 16.75,12.5M18.75,10.5A1,1 0 0,1 19.75,11.5A1,1 0 0,1 18.75,12.5A1,1 0 0,1 17.75,11.5A1,1 0 0,1 18.75,10.5Z" />
      </svg>
    `;
    indicator.classList.add('controller-indicator');
    indicator.style.display = 'none';
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .controller-indicator {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: rgba(23, 26, 33, 0.8);
        border-radius: 50%;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        transition: opacity 0.3s ease;
      }
      
      .controller-indicator svg {
        fill: #66c0f4;
      }
      
      .controller-focus {
        outline: 3px solid #66c0f4 !important;
        outline-offset: 2px !important;
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(indicator);
    this.controllerIndicator = indicator;
  }
  
  connectHandler(e) {
    this.addGamepad(e.gamepad);
    this.showControllerUI();
  }
  
  disconnectHandler(e) {
    this.removeGamepad(e.gamepad);
    if (Object.keys(this.controllers).length === 0) {
      this.hideControllerUI();
    }
  }
  
  addGamepad(gamepad) {
    this.controllers[gamepad.index] = gamepad;
    console.log(`Gamepad connected at index ${gamepad.index}: ${gamepad.id}`);
  }
  
  removeGamepad(gamepad) {
    delete this.controllers[gamepad.index];
    console.log(`Gamepad disconnected from index ${gamepad.index}: ${gamepad.id}`);
  }
  
  startPolling() {
    // Poll for gamepad data
    const pollGamepads = () => {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
          if (!(gamepads[i].index in this.controllers)) {
            this.addGamepad(gamepads[i]);
            this.showControllerUI();
          } else {
            this.controllers[gamepads[i].index] = gamepads[i];
          }
        }
      }
      
      setTimeout(pollGamepads, 500);
    };
    
    pollGamepads();
  }
  
  updateFocusableElements() {
    this.focusableItems = Array.from(document.querySelectorAll(this.focusableElements))
      .filter(el => {
        // Filter out hidden elements
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               style.opacity !== '0' &&
               el.offsetParent !== null;
      });
      
    // If we have a current focus, find its index in the new list
    const focused = document.activeElement;
    const focusedIndex = this.focusableItems.indexOf(focused);
    if (focusedIndex >= 0) {
      this.currentFocusIndex = focusedIndex;
    } else if (this.focusableItems.length > 0) {
      this.currentFocusIndex = 0;
    }
  }
  
  checkGamepadInputs() {
    let gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    if (!gamepads) {
      requestAnimationFrame(this.checkGamepadInputs.bind(this));
      return;
    }
    
    let gamepad = null;
    // Use the first connected gamepad
    for (let i = 0; i < gamepads.length; i++) {
      if (gamepads[i]) {
        gamepad = gamepads[i];
        break;
      }
    }
    
    if (gamepad) {
      // Check if controller is newly connected
      if (!(gamepad.index in this.controllers)) {
        this.addGamepad(gamepad);
        this.showControllerUI();
      }
      
      this.processGamepadInput(gamepad);
    }
    
    requestAnimationFrame(this.checkGamepadInputs.bind(this));
  }
  
  processGamepadInput(gamepad) {
    if (this.focusableItems.length === 0) return;
    
    const now = Date.now();
    const timeSinceLastInput = now - this.lastInputTime;
    
    // Handle D-pad (buttons 12-15 are Up, Down, Left, Right on standard gamepads)
    const upPressed = gamepad.buttons[12].pressed;
    const downPressed = gamepad.buttons[13].pressed;
    const leftPressed = gamepad.buttons[14].pressed;
    const rightPressed = gamepad.buttons[15].pressed;
    
    // Handle analog sticks
    const leftStickUp = gamepad.axes[1] < -this.analogThreshold;
    const leftStickDown = gamepad.axes[1] > this.analogThreshold;
    const leftStickLeft = gamepad.axes[0] < -this.analogThreshold;
    const leftStickRight = gamepad.axes[0] > this.analogThreshold;
    
    // Combine inputs (d-pad or analog)
    const up = upPressed || leftStickUp;
    const down = downPressed || leftStickDown;
    const left = leftPressed || leftStickLeft;
    const right = rightPressed || leftStickRight;
    
    // A and B buttons (typically 0 and 1)
    const aPressed = gamepad.buttons[0].pressed;
    const bPressed = gamepad.buttons[1].pressed;
    
    // Track button state changes
    let direction = null;
    
    if (up && !this.buttonStates.up) {
      direction = 'up';
      this.buttonStates.up = true;
      this.lastInputTime = now;
      this.isRepeating = false;
    } else if (!up && this.buttonStates.up) {
      this.buttonStates.up = false;
    }
    
    if (down && !this.buttonStates.down) {
      direction = 'down';
      this.buttonStates.down = true;
      this.lastInputTime = now;
      this.isRepeating = false;
    } else if (!down && this.buttonStates.down) {
      this.buttonStates.down = false;
    }
    
    if (left && !this.buttonStates.left) {
      direction = 'left';
      this.buttonStates.left = true;
      this.lastInputTime = now;
      this.isRepeating = false;
    } else if (!left && this.buttonStates.left) {
      this.buttonStates.left = false;
    }
    
    if (right && !this.buttonStates.right) {
      direction = 'right';
      this.buttonStates.right = true;
      this.lastInputTime = now;
      this.isRepeating = false;
    } else if (!right && this.buttonStates.right) {
      this.buttonStates.right = false;
    }
    
    // Handle input repeating (for held directions)
    if (!direction) {
      if ((up && this.buttonStates.up) || 
          (down && this.buttonStates.down) || 
          (left && this.buttonStates.left) || 
          (right && this.buttonStates.right)) {
        
        if (!this.isRepeating && timeSinceLastInput >= this.repeatDelay) {
          this.isRepeating = true;
          this.lastInputTime = now;
          
          // Use the last known direction for the repeat
          direction = 
            up ? 'up' : 
            down ? 'down' : 
            left ? 'left' : 
            right ? 'right' : null;
        }
        else if (this.isRepeating && timeSinceLastInput >= this.repeatRate) {
          this.lastInputTime = now;
          
          // Use the last known direction for the repeat
          direction = 
            up ? 'up' : 
            down ? 'down' : 
            left ? 'left' : 
            right ? 'right' : null;
        }
      }
    }
    
    // Handle direction changes
    if (direction) {
      // Clear any existing controller focus
      this.clearControllerFocus();
      
      let newIndex = this.currentFocusIndex;
      
      switch (direction) {
        case 'up':
          newIndex = this.findNextElementInDirection('up');
          break;
        case 'down':
          newIndex = this.findNextElementInDirection('down');
          break;
        case 'left':
          newIndex = this.findNextElementInDirection('left');
          break;
        case 'right':
          newIndex = this.findNextElementInDirection('right');
          break;
      }
      
      if (newIndex !== null && newIndex !== this.currentFocusIndex) {
        this.currentFocusIndex = newIndex;
        this.focusElement(this.focusableItems[this.currentFocusIndex]);
      }
    }
    
    // Handle button presses - A button to click
    if (aPressed && !this.buttonStates.a) {
      this.buttonStates.a = true;
      
      if (this.focusableItems[this.currentFocusIndex]) {
        this.activateElement(this.focusableItems[this.currentFocusIndex]);
      }
    } else if (!aPressed && this.buttonStates.a) {
      this.buttonStates.a = false;
    }
    
    // B button to go back or close modals
    if (bPressed && !this.buttonStates.b) {
      this.buttonStates.b = true;
      
      // Check for open modals
      const openModal = document.querySelector('.modal.show');
      if (openModal) {
        const closeButton = openModal.querySelector('.close, .btn-close, [data-dismiss="modal"]');
        if (closeButton) {
          closeButton.click();
        }
      } else {
        // Go back in history if no modal is open
        if (window.history.length > 1) {
          window.history.back();
        }
      }
    } else if (!bPressed && this.buttonStates.b) {
      this.buttonStates.b = false;
    }
  }
  
  findNextElementInDirection(direction) {
    if (this.focusableItems.length === 0) return null;
    if (this.currentFocusIndex < 0 || this.currentFocusIndex >= this.focusableItems.length) {
      return 0;
    }
    
    const currentElement = this.focusableItems[this.currentFocusIndex];
    const currentRect = currentElement.getBoundingClientRect();
    
    // Center point of current element
    const currentCenterX = currentRect.left + currentRect.width / 2;
    const currentCenterY = currentRect.top + currentRect.height / 2;
    
    // Filter and sort elements based on direction
    let candidates = this.focusableItems.filter((element, index) => {
      if (index === this.currentFocusIndex) return false;
      
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      switch (direction) {
        case 'up':
          return centerY < currentCenterY;
        case 'down':
          return centerY > currentCenterY;
        case 'left':
          return centerX < currentCenterX;
        case 'right':
          return centerX > currentCenterX;
        default:
          return false;
      }
    });
    
    if (candidates.length === 0) {
      // If no candidates in the desired direction, try to wrap around
      switch (direction) {
        case 'up':
          // When going up with no more elements, wrap to bottom
          candidates = [...this.focusableItems].sort((a, b) => {
            const rectA = a.getBoundingClientRect();
            const rectB = b.getBoundingClientRect();
            return rectB.top - rectA.top; // Sort from bottom to top
          });
          break;
        case 'down':
          // When going down with no more elements, wrap to top
          candidates = [...this.focusableItems].sort((a, b) => {
            const rectA = a.getBoundingClientRect();
            const rectB = b.getBoundingClientRect();
            return rectA.top - rectB.top; // Sort from top to bottom
          });
          break;
        case 'left':
          // When going left with no more elements, wrap to right
          candidates = [...this.focusableItems].sort((a, b) => {
            const rectA = a.getBoundingClientRect();
            const rectB = b.getBoundingClientRect();
            return rectB.left - rectA.left; // Sort from right to left
          });
          break;
        case 'right':
          // When going right with no more elements, wrap to left
          candidates = [...this.focusableItems].sort((a, b) => {
            const rectA = a.getBoundingClientRect();
            const rectB = b.getBoundingClientRect();
            return rectA.left - rectB.left; // Sort from left to right
          });
          break;
      }
      
      // Remove the current element from candidates
      candidates = candidates.filter(element => element !== currentElement);
      
      // Take the first element after wrapping around
      if (candidates.length > 0) {
        return this.focusableItems.indexOf(candidates[0]);
      }
      
      return null;
    }
    
    // Sort candidates by distance (closest first)
    candidates.sort((a, b) => {
      const rectA = a.getBoundingClientRect();
      const rectB = b.getBoundingClientRect();
      
      const centerAX = rectA.left + rectA.width / 2;
      const centerAY = rectA.top + rectA.height / 2;
      const centerBX = rectB.left + rectB.width / 2;
      const centerBY = rectB.top + rectB.height / 2;
      
      let distanceA = 0;
      let distanceB = 0;
      
      switch (direction) {
        case 'up':
        case 'down':
          // For up/down, prefer elements that are more aligned horizontally
          const horizontalOffsetA = Math.abs(centerAX - currentCenterX);
          const horizontalOffsetB = Math.abs(centerBX - currentCenterX);
          
          // Vertical distance has more weight than horizontal alignment
          const verticalDistanceA = Math.abs(centerAY - currentCenterY);
          const verticalDistanceB = Math.abs(centerBY - currentCenterY);
          
          // Combined score (lower is better)
          distanceA = verticalDistanceA + (horizontalOffsetA * 0.5);
          distanceB = verticalDistanceB + (horizontalOffsetB * 0.5);
          break;
          
        case 'left':
        case 'right':
          // For left/right, prefer elements that are more aligned vertically
          const verticalOffsetA = Math.abs(centerAY - currentCenterY);
          const verticalOffsetB = Math.abs(centerBY - currentCenterY);
          
          // Horizontal distance has more weight than vertical alignment
          const horizontalDistanceA = Math.abs(centerAX - currentCenterX);
          const horizontalDistanceB = Math.abs(centerBX - currentCenterX);
          
          // Combined score (lower is better)
          distanceA = horizontalDistanceA + (verticalOffsetA * 0.5);
          distanceB = horizontalDistanceB + (verticalOffsetB * 0.5);
          break;
      }
      
      return distanceA - distanceB;
    });
    
    // Return the index of the best candidate
    return this.focusableItems.indexOf(candidates[0]);
  }
  
  focusElement(element) {
    if (!element) return;
    
    // Add visual indication
    element.classList.add('controller-focus');
    
    // Scroll element into view if needed
    const rect = element.getBoundingClientRect();
    const isInView = (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );
    
    if (!isInView) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Focus the element
    element.focus();
  }
  
  activateElement(element) {
    if (!element) return;
    
    // If it's a form element, focus it
    if (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
      element.focus();
      return;
    }
    
    // If it's a link, navigate to it
    if (element.tagName === 'A') {
      if (element.target === '_blank') {
        window.open(element.href, '_blank');
      } else {
        window.location.href = element.href;
      }
      return;
    }
    
    // Otherwise simulate a click
    element.click();
  }
  
  clearControllerFocus() {
    // Remove controller focus class from all elements
    document.querySelectorAll('.controller-focus').forEach(el => {
      el.classList.remove('controller-focus');
    });
  }
  
  showControllerUI() {
    if (this.controllerIndicator) {
      this.controllerIndicator.style.display = 'flex';
      document.body.classList.add('controller-mode');
      
      // Add keyboard shortcut overlay button if not present
      if (!document.getElementById('keyboard-shortcuts-btn')) {
        const shortcutsBtn = document.createElement('button');
        shortcutsBtn.id = 'keyboard-shortcuts-btn';
        shortcutsBtn.innerHTML = '?';
        shortcutsBtn.classList.add('keyboard-shortcuts-btn');
        shortcutsBtn.setAttribute('aria-label', 'Show keyboard shortcuts');
        shortcutsBtn.addEventListener('click', this.showKeyboardShortcutsOverlay.bind(this));
        
        const style = document.createElement('style');
        style.textContent = `
          .keyboard-shortcuts-btn {
            position: fixed;
            bottom: 20px;
            right: 80px;
            background-color: rgba(23, 26, 33, 0.8);
            color: #66c0f4;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          }
          
          .keyboard-shortcuts-btn:hover {
            background-color: rgba(27, 40, 56, 0.9);
          }
        `;
        document.head.appendChild(style);
        document.body.appendChild(shortcutsBtn);
      }
    }
    
    // Focus the first element if none is focused
    if (document.activeElement === document.body && this.focusableItems.length > 0) {
      this.focusElement(this.focusableItems[0]);
      this.currentFocusIndex = 0;
    }
  }
  
  hideControllerUI() {
    if (this.controllerIndicator) {
      this.controllerIndicator.style.display = 'none';
      document.body.classList.remove('controller-mode');
      
      // Remove the keyboard shortcuts button
      const shortcutsBtn = document.getElementById('keyboard-shortcuts-btn');
      if (shortcutsBtn) {
        shortcutsBtn.remove();
      }
    }
    
    // Clear any controller focus indicators
    this.clearControllerFocus();
  }
  
  showKeyboardShortcutsOverlay() {
    // Create overlay if it doesn't exist
    let overlay = document.getElementById('shortcuts-overlay');
    
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'shortcuts-overlay';
      overlay.classList.add('shortcuts-overlay');
      
      // Add styles
      const style = document.createElement('style');
      style.textContent = `
        .shortcuts-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.85);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .shortcuts-overlay.visible {
          opacity: 1;
        }
        
        .shortcuts-content {
          background-color: #1b2838;
          border-radius: 6px;
          max-width: 800px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          padding: 20px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        }
        
        .shortcuts-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(102, 192, 244, 0.2);
        }
        
        .shortcuts-title {
          color: #c7d5e0;
          font-size: 22px;
          margin: 0;
        }
        
        .shortcuts-close {
          background: none;
          border: none;
          color: #66c0f4;
          font-size: 24px;
          cursor: pointer;
        }
        
        .shortcuts-section {
          margin-bottom: 30px;
        }
        
        .shortcuts-section-title {
          color: #66c0f4;
          font-size: 18px;
          margin-bottom: 15px;
        }
        
        .shortcuts-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 8px;
        }
        
        .shortcuts-table td {
          padding: 8px 10px;
        }
        
        .shortcuts-table tr:hover {
          background-color: rgba(26, 159, 255, 0.1);
        }
        
        .shortcut-key {
          display: inline-block;
          background-color: #2a475e;
          color: #c7d5e0;
          border-radius: 4px;
          padding: 5px 10px;
          margin-right: 5px;
          font-family: monospace;
          font-size: 14px;
          min-width: 30px;
          text-align: center;
        }
        
        .shortcut-desc {
          color: #c7d5e0;
          font-size: 14px;
        }
      `;
      document.head.appendChild(style);
      
      // Create content
      const content = document.createElement('div');
      content.classList.add('shortcuts-content');
      
      // Header
      const header = document.createElement('div');
      header.classList.add('shortcuts-header');
      
      const title = document.createElement('h2');
      title.classList.add('shortcuts-title');
      title.textContent = 'Keyboard & Controller Shortcuts';
      
      const closeBtn = document.createElement('button');
      closeBtn.classList.add('shortcuts-close');
      closeBtn.textContent = '×';
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.addEventListener('click', () => {
        overlay.classList.remove('visible');
        setTimeout(() => {
          overlay.style.display = 'none';
        }, 300);
      });
      
      header.appendChild(title);
      header.appendChild(closeBtn);
      content.appendChild(header);
      
      // Navigation section
      const navSection = document.createElement('div');
      navSection.classList.add('shortcuts-section');
      
      const navTitle = document.createElement('h3');
      navTitle.classList.add('shortcuts-section-title');
      navTitle.textContent = 'Navigation';
      
      const navTable = document.createElement('table');
      navTable.classList.add('shortcuts-table');
      navTable.innerHTML = `
        <tr>
          <td><span class="shortcut-key">D-Pad</span> or <span class="shortcut-key">Left Stick</span></td>
          <td class="shortcut-desc">Navigate UI elements</td>
        </tr>
        <tr>
          <td><span class="shortcut-key">A Button</span></td>
          <td class="shortcut-desc">Select / Click</td>
        </tr>
        <tr>
          <td><span class="shortcut-key">B Button</span></td>
          <td class="shortcut-desc">Back / Close modal</td>
        </tr>
        <tr>
          <td><span class="shortcut-key">Start</span></td>
          <td class="shortcut-desc">Open main menu</td>
        </tr>
        <tr>
          <td><span class="shortcut-key">LB/RB</span></td>
          <td class="shortcut-desc">Tab navigation / Switch categories</td>
        </tr>
        <tr>
          <td><span class="shortcut-key">LT/RT</span></td>
          <td class="shortcut-desc">Scroll page up/down</td>
        </tr>
      `;
      
      navSection.appendChild(navTitle);
      navSection.appendChild(navTable);
      content.appendChild(navSection);
      
      // Store navigation section
      const storeSection = document.createElement('div');
      storeSection.classList.add('shortcuts-section');
      
      const storeTitle = document.createElement('h3');
      storeTitle.classList.add('shortcuts-section-title');
      storeTitle.textContent = 'Store & Library';
      
      const storeTable = document.createElement('table');
      storeTable.classList.add('shortcuts-table');
      storeTable.innerHTML = `
        <tr>
          <td><span class="shortcut-key">X Button</span></td>
          <td class="shortcut-desc">Add to cart</td>
        </tr>
        <tr>
          <td><span class="shortcut-key">Y Button</span></td>
          <td class="shortcut-desc">Add to wishlist</td>
        </tr>
        <tr>
          <td><span class="shortcut-key">Right Stick Click</span></td>
          <td class="shortcut-desc">Open search</td>
        </tr>
        <tr>
          <td><span class="shortcut-key">LB + X</span></td>
          <td class="shortcut-desc">View screenshots</td>
        </tr>
        <tr>
          <td><span class="shortcut-key">LB + Y</span></td>
          <td class="shortcut-desc">View videos</td>
        </tr>
        <tr>
          <td><span class="shortcut-key">RB + X</span></td>
          <td class="shortcut-desc">Sort games</td>
        </tr>
      `;
      
      storeSection.appendChild(storeTitle);
      storeSection.appendChild(storeTable);
      content.appendChild(storeSection);
      
      // Keyboard section
      const keyboardSection = document.createElement('div');
      keyboardSection.classList.add('shortcuts-section');
      
      const keyboardTitle = document.createElement('h3');
      keyboardTitle.classList.add('shortcuts-section-title');
      keyboardTitle.textContent = 'Keyboard Shortcuts';
      
      const keyboardTable = document.createElement('table');
      keyboardTable.classList.add('shortcuts-table');
      keyboardTable.innerHTML = `
        <tr>
          <td><span class="shortcut-key">Tab</span></td>
          <td class="shortcut-desc">Navigate between elements</td>
        </tr>
        <tr>
          <td><span class="shortcut-key">Enter</span> / <span class="shortcut-key">Space</span></td>
          <td class="shortcut-desc">Select / Activate</td>
        </tr>
        <tr>
          <td><span class="shortcut-key">Esc</span></td>
          <td class="shortcut-desc">Close modal / Cancel</td>
        </tr>
        <tr>
          <td><span class="shortcut-key">F</span></td>
          <td class="shortcut-desc">Open search</td>
        </tr>
        <tr>
          <td><span class="shortcut-key">W</span></td>
          <td class="shortcut-desc">Add to wishlist</td>
        </tr>
        <tr>
          <td><span class="shortcut-key">C</span></td>
          <td class="shortcut-desc">Add to cart</td>
        </tr>
        <tr>
          <td><span class="shortcut-key">H</span></td>
          <td class="shortcut-desc">Go to home page</td>
        </tr>
        <tr>
          <td><span class="shortcut-key">L</span></td>
          <td class="shortcut-desc">Go to library</td>
        </tr>
        <tr>
          <td><span class="shortcut-key">P</span></td>
          <td class="shortcut-desc">Go to profile</td>
        </tr>
        <tr>
          <td><span class="shortcut-key">?</span></td>
          <td class="shortcut-desc">Show this shortcuts overlay</td>
        </tr>
      `;
      
      keyboardSection.appendChild(keyboardTitle);
      keyboardSection.appendChild(keyboardTable);
      content.appendChild(keyboardSection);
      
      overlay.appendChild(content);
      document.body.appendChild(overlay);
    }
    
    // Show the overlay
    overlay.style.display = 'flex';
    setTimeout(() => {
      overlay.classList.add('visible');
    }, 10);
  }
}

// Initialize the controller when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.gamepadController = new GamepadController();
});

// Use keyboard to show shortcuts overlay
document.addEventListener('keydown', (e) => {
  if (e.key === '?' && !e.ctrlKey && !e.altKey && !e.metaKey) {
    if (window.gamepadController) {
      window.gamepadController.showKeyboardShortcutsOverlay();
    }
  }
});