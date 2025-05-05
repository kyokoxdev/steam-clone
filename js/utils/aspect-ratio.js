/**
 * Steam Clone - Aspect Ratio Optimizations
 * Handles responsive design optimizations for different screen aspect ratios
 */

class AspectRatioHandler {
  constructor() {
    this.currentRatio = null;
    this.ratioClasses = {
      ultrawide: 'aspect-ultrawide',     // 21:9 and wider
      widescreen: 'aspect-widescreen',   // 16:9 to 16:10
      standard: 'aspect-standard',       // 4:3 and similar
      portrait: 'aspect-portrait',       // Taller than wide
      mobile: 'aspect-mobile'            // Very narrow mobile ratio
    };
    
    // Initialize aspect ratio detection
    this.init();
  }
  
  init() {
    // Add aspect ratio detection on page load
    window.addEventListener('DOMContentLoaded', () => {
      this.detectAspectRatio();
      this.applyOptimizations();
    });
    
    // Update on resize
    window.addEventListener('resize', this.debounce(() => {
      this.detectAspectRatio();
      this.applyOptimizations();
    }, 250));
    
    // Create and inject CSS for different aspect ratios
    this.injectAspectRatioStyles();
  }
  
  // Detect the current aspect ratio and add appropriate class to body
  detectAspectRatio() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const ratio = width / height;
    
    // Remove all previous aspect ratio classes
    document.body.classList.remove(...Object.values(this.ratioClasses));
    
    // Determine the current aspect ratio
    let ratioClass;
    
    if (width < 768) {
      // Mobile devices are handled separately from aspect ratio
      ratioClass = this.ratioClasses.mobile;
    } else if (ratio >= 2.2) {
      // Ultra-ultrawide (greater than 21:9)
      ratioClass = this.ratioClasses.ultrawide;
    } else if (ratio >= 1.7) {
      // Ultrawide/widescreen (16:9 to 21:9)
      ratioClass = this.ratioClasses.widescreen;
    } else if (ratio >= 1.1) {
      // Standard (4:3, 5:4, etc.)
      ratioClass = this.ratioClasses.standard;
    } else {
      // Portrait orientation
      ratioClass = this.ratioClasses.portrait;
    }
    
    // Add the appropriate class to body
    document.body.classList.add(ratioClass);
    this.currentRatio = ratioClass;
    
    // Dispatch event for other components to respond
    document.dispatchEvent(new CustomEvent('aspectratiochange', { 
      detail: { ratio: ratioClass } 
    }));
    
    return ratioClass;
  }
  
  // Apply optimizations for the current aspect ratio
  applyOptimizations() {
    // Game grid adjustments
    this.optimizeGameGrid();
    
    // Header/navigation adjustments
    this.optimizeNavigation();
    
    // Content layout adjustments
    this.optimizeContentLayout();
    
    // Sidebar adjustments
    this.optimizeSidebar();
  }
  
  // Optimize game grid display for different aspect ratios
  optimizeGameGrid() {
    const gameGrids = document.querySelectorAll('.game-grid');
    
    if (gameGrids.length === 0) return;
    
    gameGrids.forEach(grid => {
      // Remove any previously set column counts
      grid.style.removeProperty('--grid-columns');
      
      // Set columns based on aspect ratio
      switch (this.currentRatio) {
        case this.ratioClasses.ultrawide:
          grid.style.setProperty('--grid-columns', '6');
          break;
        case this.ratioClasses.widescreen:
          grid.style.setProperty('--grid-columns', '4');
          break;
        case this.ratioClasses.standard:
          grid.style.setProperty('--grid-columns', '3');
          break;
        case this.ratioClasses.portrait:
          grid.style.setProperty('--grid-columns', '2');
          break;
        case this.ratioClasses.mobile:
          grid.style.setProperty('--grid-columns', '1');
          break;
      }
    });
  }
  
  // Optimize navigation for different aspect ratios
  optimizeNavigation() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    
    // For ultrawide displays, add extra spacing
    if (this.currentRatio === this.ratioClasses.ultrawide) {
      header.classList.add('ultrawide-spacing');
    } else {
      header.classList.remove('ultrawide-spacing');
    }
    
    // For mobile/portrait, ensure compact navigation
    if (this.currentRatio === this.ratioClasses.mobile || 
        this.currentRatio === this.ratioClasses.portrait) {
      header.classList.add('compact-nav');
    } else {
      header.classList.remove('compact-nav');
    }
  }
  
  // Optimize content layout for different aspect ratios
  optimizeContentLayout() {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;
    
    // For ultrawide, add extra padding to prevent excessive line length
    if (this.currentRatio === this.ratioClasses.ultrawide) {
      mainContent.classList.add('ultrawide-content');
    } else {
      mainContent.classList.remove('ultrawide-content');
    }
    
    // For game details page, adjust layout
    const gameDetails = document.querySelector('.game-details');
    if (gameDetails) {
      if (this.currentRatio === this.ratioClasses.ultrawide || 
          this.currentRatio === this.ratioClasses.widescreen) {
        gameDetails.classList.add('horizontal-layout');
      } else {
        gameDetails.classList.remove('horizontal-layout');
      }
    }
  }
  
  // Optimize sidebar for different aspect ratios
  optimizeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    
    // For ultrawide displays, expand sidebar
    if (this.currentRatio === this.ratioClasses.ultrawide) {
      sidebar.classList.add('expanded');
    } else {
      sidebar.classList.remove('expanded');
    }
    
    // For mobile/portrait, collapse sidebar by default
    if (this.currentRatio === this.ratioClasses.mobile || 
        this.currentRatio === this.ratioClasses.portrait) {
      sidebar.classList.add('collapsed');
    }
  }
  
  // Create and inject CSS for aspect ratio optimizations
  injectAspectRatioStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Ultrawide optimizations (21:9 and wider) */
      .aspect-ultrawide .main-container {
        max-width: 90%;
        margin: 0 auto;
      }
      
      .aspect-ultrawide .game-grid {
        grid-template-columns: repeat(var(--grid-columns, 6), 1fr);
      }
      
      .aspect-ultrawide .ultrawide-spacing {
        padding-left: 5%;
        padding-right: 5%;
      }
      
      .aspect-ultrawide .ultrawide-content {
        max-width: 1800px;
        margin: 0 auto;
        padding: 0 5%;
      }
      
      .aspect-ultrawide .game-details.horizontal-layout {
        display: grid;
        grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
        gap: 30px;
      }
      
      .aspect-ultrawide .sidebar.expanded {
        width: 300px;
      }
      
      /* Widescreen optimizations (16:9 to 16:10) */
      .aspect-widescreen .game-grid {
        grid-template-columns: repeat(var(--grid-columns, 4), 1fr);
      }
      
      .aspect-widescreen .game-details.horizontal-layout {
        display: grid;
        grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
        gap: 20px;
      }
      
      /* Standard aspect ratio optimizations (4:3, etc.) */
      .aspect-standard .game-grid {
        grid-template-columns: repeat(var(--grid-columns, 3), 1fr);
      }
      
      /* Portrait orientation optimizations */
      .aspect-portrait .game-grid {
        grid-template-columns: repeat(var(--grid-columns, 2), 1fr);
      }
      
      .aspect-portrait .compact-nav .main-nav {
        display: none;
      }
      
      .aspect-portrait .compact-nav .mobile-menu-toggle {
        display: block;
      }
      
      .aspect-portrait .sidebar.collapsed {
        transform: translateX(-100%);
      }
      
      /* Mobile optimizations */
      .aspect-mobile .game-grid {
        grid-template-columns: repeat(var(--grid-columns, 1), 1fr);
      }
      
      .aspect-mobile .compact-nav .main-nav {
        display: none;
      }
      
      .aspect-mobile .compact-nav .mobile-menu-toggle {
        display: block;
      }
      
      .aspect-mobile .sidebar.collapsed {
        transform: translateX(-100%);
      }
      
      /* Game card adjustments for different aspect ratios */
      .aspect-ultrawide .game-card .game-card-img {
        height: 220px;
      }
      
      .aspect-widescreen .game-card .game-card-img {
        height: 180px;
      }
      
      .aspect-standard .game-card .game-card-img {
        height: 150px;
      }
      
      .aspect-portrait .game-card .game-card-img {
        height: 130px;
      }
      
      .aspect-mobile .game-card .game-card-img {
        height: 200px;
      }
      
      /* Carousel adjustments for different aspect ratios */
      .aspect-ultrawide .featured-carousel {
        height: 500px;
      }
      
      .aspect-widescreen .featured-carousel {
        height: 400px;
      }
      
      .aspect-standard .featured-carousel {
        height: 350px;
      }
      
      .aspect-portrait .featured-carousel {
        height: 300px;
      }
      
      .aspect-mobile .featured-carousel {
        height: 250px;
      }
      
      /* Game detail page layout adjustments */
      .aspect-ultrawide .game-media-gallery {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
      }
      
      .aspect-widescreen .game-media-gallery {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
      }
      
      .aspect-standard .game-media-gallery,
      .aspect-portrait .game-media-gallery,
      .aspect-mobile .game-media-gallery {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }
      
      /* Library page optimizations */
      .aspect-ultrawide .library-game-list {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      }
      
      .aspect-widescreen .library-game-list {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      }
      
      .aspect-standard .library-game-list {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      }
      
      .aspect-portrait .library-game-list,
      .aspect-mobile .library-game-list {
        grid-template-columns: 1fr;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // Utility function to debounce function calls
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Check if device is in landscape or portrait orientation
  isLandscape() {
    return window.innerWidth > window.innerHeight;
  }
  
  // Get current aspect ratio class
  getCurrentRatio() {
    return this.currentRatio;
  }
  
  // Manual trigger for aspect ratio detection and optimization
  refresh() {
    this.detectAspectRatio();
    this.applyOptimizations();
  }
}

// Initialize aspect ratio handler
document.addEventListener('DOMContentLoaded', () => {
  window.aspectRatioHandler = new AspectRatioHandler();
});