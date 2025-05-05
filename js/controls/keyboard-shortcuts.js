/**
 * Steam Clone - Keyboard Shortcuts Overlay
 * Provides a centralized view of all keyboard shortcuts
 */

class KeyboardShortcuts {
  constructor() {
    this.overlayElement = null;
    this.initialized = false;
    this.shortcuts = {
      navigation: [
        { keys: ['Tab'], description: 'Navigate between elements' },
        { keys: ['Enter', 'Space'], description: 'Select / Activate' },
        { keys: ['Esc'], description: 'Close modal / Go back' },
        { keys: ['Arrow Keys'], description: 'Navigate UI' },
        { keys: ['Home'], description: 'Go to start of page' },
        { keys: ['End'], description: 'Go to end of page' }
      ],
      store: [
        { keys: ['F'], description: 'Focus search box' },
        { keys: ['W'], description: 'Add to wishlist' },
        { keys: ['C'], description: 'Add to cart' },
        { keys: ['G'], description: 'View game details' },
        { keys: ['S'], description: 'Open store page' },
        { keys: ['1-9'], description: 'Navigate categories' }
      ],
      library: [
        { keys: ['L'], description: 'Go to library' },
        { keys: ['I'], description: 'Install selected game' },
        { keys: ['P'], description: 'Play selected game' },
        { keys: ['U'], description: 'Uninstall selected game' },
        { keys: ['R'], description: 'View game properties' },
        { keys: ['Ctrl', '+'], description: 'Increase game grid size' },
        { keys: ['Ctrl', '-'], description: 'Decrease game grid size' }
      ],
      community: [
        { keys: ['F'], description: 'Find friends' },
        { keys: ['A'], description: 'View activity feed' },
        { keys: ['G'], description: 'Browse groups' },
        { keys: ['D'], description: 'Access discussions' },
        { keys: ['M'], description: 'Read messages' }
      ],
      global: [
        { keys: ['?'], description: 'Show keyboard shortcuts' },
        { keys: ['H'], description: 'Go home' },
        { keys: ['P'], description: 'View profile' },
        { keys: ['N'], description: 'View notifications' },
        { keys: ['Ctrl', 'Alt', 'S'], description: 'Open settings' },
        { keys: ['Ctrl', 'Alt', 'D'], description: 'Toggle dark mode' }
      ]
    };
    
    // Initialize the overlay
    this.init();
  }
  
  init() {
    // Create overlay if it doesn't exist
    if (!document.getElementById('keyboard-shortcuts-overlay')) {
      this.createOverlay();
    }
    
    // Add event listener to document for showing the overlay
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    
    this.initialized = true;
  }
  
  createOverlay() {
    // Create the overlay container
    const overlay = document.createElement('div');
    overlay.id = 'keyboard-shortcuts-overlay';
    overlay.className = 'keyboard-shortcuts-overlay';
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-labelledby', 'keyboard-shortcuts-title');
    overlay.setAttribute('tabindex', '-1');
    overlay.style.display = 'none';
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .keyboard-shortcuts-overlay {
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
      
      .keyboard-shortcuts-overlay.visible {
        opacity: 1;
      }
      
      .keyboard-shortcuts-content {
        background-color: #1b2838;
        border-radius: 6px;
        max-width: 900px;
        width: 90%;
        max-height: 85vh;
        overflow-y: auto;
        padding: 24px;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.7);
        /* Custom scrollbar */
        scrollbar-width: thin;
        scrollbar-color: #66c0f4 #2a475e;
      }
      
      .keyboard-shortcuts-content::-webkit-scrollbar {
        width: 10px;
      }
      
      .keyboard-shortcuts-content::-webkit-scrollbar-track {
        background: #2a475e;
        border-radius: 5px;
      }
      
      .keyboard-shortcuts-content::-webkit-scrollbar-thumb {
        background-color: #66c0f4;
        border-radius: 5px;
      }
      
      .keyboard-shortcuts-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(102, 192, 244, 0.2);
      }
      
      .keyboard-shortcuts-title {
        color: #c7d5e0;
        font-size: 24px;
        font-weight: 500;
        margin: 0;
      }
      
      .keyboard-shortcuts-close {
        background: none;
        border: none;
        color: #66c0f4;
        font-size: 28px;
        cursor: pointer;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s ease;
      }
      
      .keyboard-shortcuts-close:hover {
        background-color: rgba(102, 192, 244, 0.2);
      }
      
      .keyboard-shortcuts-tabs {
        display: flex;
        gap: 4px;
        margin-bottom: 20px;
        border-bottom: 1px solid #2a475e;
      }
      
      .keyboard-shortcuts-tab {
        background: none;
        border: none;
        color: #c7d5e0;
        padding: 10px 20px;
        cursor: pointer;
        font-size: 16px;
        border-bottom: 3px solid transparent;
        transition: all 0.2s ease;
      }
      
      .keyboard-shortcuts-tab:hover {
        background-color: rgba(102, 192, 244, 0.1);
      }
      
      .keyboard-shortcuts-tab.active {
        color: #66c0f4;
        border-bottom-color: #66c0f4;
      }
      
      .keyboard-shortcuts-section {
        margin-bottom: 32px;
        animation: fadeIn 0.3s ease;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .keyboard-shortcuts-section-title {
        color: #66c0f4;
        font-size: 20px;
        margin-bottom: 16px;
        font-weight: 500;
      }
      
      .keyboard-shortcuts-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
      
      @media (max-width: 768px) {
        .keyboard-shortcuts-grid {
          grid-template-columns: 1fr;
        }
      }
      
      .keyboard-shortcut-item {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        border-radius: 4px;
        background-color: rgba(42, 71, 94, 0.4);
        transition: background-color 0.2s ease;
      }
      
      .keyboard-shortcut-item:hover {
        background-color: rgba(42, 71, 94, 0.8);
      }
      
      .keyboard-shortcut-keys {
        display: flex;
        align-items: center;
        min-width: 140px;
        margin-right: 16px;
      }
      
      .keyboard-shortcut-key {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: #2a475e;
        color: #c7d5e0;
        border-radius: 4px;
        padding: 6px 10px;
        margin-right: 6px;
        font-family: 'Consolas', monospace;
        font-size: 14px;
        min-width: 30px;
        height: 30px;
        box-shadow: 0 2px 0 rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(102, 192, 244, 0.3);
      }
      
      .keyboard-shortcut-plus {
        margin: 0 4px;
        color: #66c0f4;
        font-weight: bold;
      }
      
      .keyboard-shortcut-desc {
        color: #c7d5e0;
        font-size: 16px;
        flex: 1;
      }
      
      .keyboard-shortcuts-tab-content {
        display: none;
      }
      
      .keyboard-shortcuts-tab-content.active {
        display: block;
      }
      
      /* Animation for showing the overlay */
      .keyboard-shortcuts-overlay-enter {
        opacity: 0;
      }
      
      .keyboard-shortcuts-overlay-enter-active {
        opacity: 1;
        transition: opacity 0.3s ease;
      }
      
      .keyboard-shortcuts-overlay-exit {
        opacity: 1;
      }
      
      .keyboard-shortcuts-overlay-exit-active {
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      /* Button to open shortcuts */
      .keyboard-shortcuts-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: rgba(23, 26, 33, 0.8);
        border: none;
        border-radius: 50%;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #66c0f4;
        font-size: 24px;
        cursor: pointer;
        z-index: 9999;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        transition: background-color 0.2s ease;
      }
      
      .keyboard-shortcuts-button:hover {
        background-color: rgba(27, 40, 56, 0.9);
      }
    `;
    document.head.appendChild(style);
    
    // Create content container
    const content = document.createElement('div');
    content.className = 'keyboard-shortcuts-content';
    
    // Header with title and close button
    const header = document.createElement('div');
    header.className = 'keyboard-shortcuts-header';
    
    const title = document.createElement('h2');
    title.id = 'keyboard-shortcuts-title';
    title.className = 'keyboard-shortcuts-title';
    title.textContent = 'Keyboard Shortcuts';
    
    const closeButton = document.createElement('button');
    closeButton.className = 'keyboard-shortcuts-close';
    closeButton.textContent = '×';
    closeButton.setAttribute('aria-label', 'Close keyboard shortcuts');
    closeButton.addEventListener('click', () => this.hideOverlay());
    
    header.appendChild(title);
    header.appendChild(closeButton);
    content.appendChild(header);
    
    // Create tabs
    const tabs = document.createElement('div');
    tabs.className = 'keyboard-shortcuts-tabs';
    
    const categories = Object.keys(this.shortcuts);
    categories.forEach((category, index) => {
      const button = document.createElement('button');
      button.className = `keyboard-shortcuts-tab ${index === 0 ? 'active' : ''}`;
      button.setAttribute('data-category', category);
      button.textContent = this.formatCategoryName(category);
      button.addEventListener('click', (e) => this.switchTab(e.target));
      tabs.appendChild(button);
    });
    
    content.appendChild(tabs);
    
    // Create tab content containers
    categories.forEach((category, index) => {
      const tabContent = document.createElement('div');
      tabContent.className = `keyboard-shortcuts-tab-content ${index === 0 ? 'active' : ''}`;
      tabContent.id = `keyboard-shortcuts-${category}`;
      
      const section = document.createElement('div');
      section.className = 'keyboard-shortcuts-section';
      
      const sectionTitle = document.createElement('h3');
      sectionTitle.className = 'keyboard-shortcuts-section-title';
      sectionTitle.textContent = this.formatCategoryName(category) + ' Shortcuts';
      section.appendChild(sectionTitle);
      
      const grid = document.createElement('div');
      grid.className = 'keyboard-shortcuts-grid';
      
      // Add shortcuts for this category
      this.shortcuts[category].forEach(shortcut => {
        const item = document.createElement('div');
        item.className = 'keyboard-shortcut-item';
        
        const keys = document.createElement('div');
        keys.className = 'keyboard-shortcut-keys';
        
        shortcut.keys.forEach((key, keyIndex) => {
          if (keyIndex > 0) {
            const plus = document.createElement('span');
            plus.className = 'keyboard-shortcut-plus';
            plus.textContent = '+';
            keys.appendChild(plus);
          }
          
          const keyElement = document.createElement('span');
          keyElement.className = 'keyboard-shortcut-key';
          keyElement.textContent = key;
          keys.appendChild(keyElement);
        });
        
        const desc = document.createElement('div');
        desc.className = 'keyboard-shortcut-desc';
        desc.textContent = shortcut.description;
        
        item.appendChild(keys);
        item.appendChild(desc);
        grid.appendChild(item);
      });
      
      section.appendChild(grid);
      tabContent.appendChild(section);
      content.appendChild(tabContent);
    });
    
    overlay.appendChild(content);
    document.body.appendChild(overlay);
    
    // Create keyboard shortcuts button
    const shortcutsButton = document.createElement('button');
    shortcutsButton.className = 'keyboard-shortcuts-button';
    shortcutsButton.textContent = '?';
    shortcutsButton.setAttribute('aria-label', 'Show keyboard shortcuts');
    shortcutsButton.addEventListener('click', () => this.showOverlay());
    document.body.appendChild(shortcutsButton);
    
    this.overlayElement = overlay;
  }
  
  formatCategoryName(category) {
    // Capitalize first letter and format camelCase
    return category.charAt(0).toUpperCase() + 
      category.slice(1).replace(/([A-Z])/g, ' $1');
  }
  
  switchTab(tabElement) {
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.keyboard-shortcuts-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Add active class to clicked tab
    tabElement.classList.add('active');
    
    // Hide all tab content
    const tabContents = document.querySelectorAll('.keyboard-shortcuts-tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Show the selected tab content
    const category = tabElement.getAttribute('data-category');
    const activeContent = document.getElementById(`keyboard-shortcuts-${category}`);
    if (activeContent) {
      activeContent.classList.add('active');
    }
  }
  
  handleKeyDown(event) {
    // Show overlay when ? is pressed
    if (event.key === '?' && !event.ctrlKey && !event.altKey && !event.metaKey) {
      event.preventDefault();
      this.showOverlay();
    }
    
    // Hide overlay when Escape is pressed
    if (event.key === 'Escape' && this.overlayElement && this.overlayElement.classList.contains('visible')) {
      this.hideOverlay();
    }
  }
  
  showOverlay() {
    if (!this.overlayElement) return;
    
    // Show the overlay
    this.overlayElement.style.display = 'flex';
    // Use setTimeout to ensure the transition works
    setTimeout(() => {
      this.overlayElement.classList.add('visible');
    }, 10);
    
    // Set focus on the overlay for accessibility
    this.overlayElement.focus();
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    
    // Dispatch custom event
    document.dispatchEvent(new CustomEvent('keyboard-shortcuts-shown'));
  }
  
  hideOverlay() {
    if (!this.overlayElement) return;
    
    // Hide with transition
    this.overlayElement.classList.remove('visible');
    setTimeout(() => {
      this.overlayElement.style.display = 'none';
      // Restore scrolling
      document.body.style.overflow = '';
      
      // Dispatch custom event
      document.dispatchEvent(new CustomEvent('keyboard-shortcuts-hidden'));
    }, 300);
  }
  
  // Method to add new shortcuts at runtime
  addShortcut(category, keys, description) {
    if (!this.shortcuts[category]) {
      this.shortcuts[category] = [];
    }
    
    this.shortcuts[category].push({ keys, description });
    
    // If the overlay is already created, update it
    if (this.initialized && this.overlayElement) {
      this.updateOverlay();
    }
  }
  
  // Rebuild the overlay content with updated shortcuts
  updateOverlay() {
    if (this.overlayElement) {
      document.body.removeChild(this.overlayElement);
      this.overlayElement = null;
      this.createOverlay();
    }
  }
}

// Initialize keyboard shortcuts
document.addEventListener('DOMContentLoaded', () => {
  window.keyboardShortcuts = new KeyboardShortcuts();
});