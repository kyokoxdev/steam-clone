/**
 * Responsive Images System - JavaScript Utilities
 * 
 * This script provides the functionality for responsive image loading,
 * format detection, lazy loading, and other image optimization techniques.
 */

class ResponsiveImageSystem {
  constructor(options = {}) {
    // Default options
    this.options = {
      lazyLoadSelector: '.lazy-load',
      blurUpSelector: '.blur-up',
      rootMargin: '200px 0px',
      placeholderClass: 'image-placeholder',
      loadedClass: 'loaded',
      observerThreshold: 0.1,
      webpSupport: false,
      avifSupport: false,
      highDpi: window.devicePixelRatio > 1,
      ...options
    };

    // Initialize feature detection
    this.detectFeatures();
    
    // Initialize the system
    this.init();
  }

  /**
   * Detect supported features
   */
  async detectFeatures() {
    // Check WebP support
    this.options.webpSupport = await this.checkWebPSupport();
    if (this.options.webpSupport) {
      document.documentElement.classList.add('webp');
    } else {
      document.documentElement.classList.add('no-webp');
    }
    
    // Check AVIF support
    this.options.avifSupport = await this.checkAVIFSupport();
    if (this.options.avifSupport) {
      document.documentElement.classList.add('avif');
    } else {
      document.documentElement.classList.add('no-avif');
    }
    
    // Check connection type if available
    if ('connection' in navigator) {
      this.options.connectionType = navigator.connection.effectiveType;
      this.options.saveData = navigator.connection.saveData;
      
      // Add connection-based classes
      document.documentElement.classList.add(`connection-${this.options.connectionType}`);
      if (this.options.saveData) {
        document.documentElement.classList.add('save-data');
      }
    }
  }
  
  /**
   * Check WebP support using feature detection
   */
  checkWebPSupport() {
    return new Promise(resolve => {
      const webP = new Image();
      webP.onload = function() {
        resolve(webP.height === 1);
      };
      webP.onerror = function() {
        resolve(false);
      };
      webP.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
    });
  }
  
  /**
   * Check AVIF support using feature detection
   */
  checkAVIFSupport() {
    return new Promise(resolve => {
      const avif = new Image();
      avif.onload = function() {
        resolve(avif.height === 1);
      };
      avif.onerror = function() {
        resolve(false);
      };
      avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    });
  }
  
  /**
   * Initialize the responsive image system
   */
  init() {
    // Set up lazy loading with IntersectionObserver
    this.setupLazyLoading();
    
    // Initialize placeholders
    this.createPlaceholders();
    
    // Set up responsive source selection
    this.setupResponsiveSources();
    
    // Add window resize handler for image resizing
    this.setupResizeHandler();
    
    // Set art direction based on screen size
    this.applyArtDirection();
  }
  
  /**
   * Set up lazy loading with IntersectionObserver
   */
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const options = {
        rootMargin: this.options.rootMargin,
        threshold: this.options.observerThreshold
      };
      
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // Load the actual image
            if (img.dataset.src) {
              img.src = img.dataset.src;
              delete img.dataset.src;
            }
            
            // Load srcset if present
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
              delete img.dataset.srcset;
            }
            
            // Handle background images
            if (img.dataset.bg) {
              img.style.backgroundImage = `url('${img.dataset.bg}')`;
              delete img.dataset.bg;
            }
            
            // Mark as loaded
            img.classList.add(this.options.loadedClass);
            
            // Stop observing the image
            observer.unobserve(img);
          }
        });
      }, options);
      
      // Start observing all lazy load elements
      document.querySelectorAll(this.options.lazyLoadSelector).forEach(img => {
        observer.observe(img);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      this.loadAllImages();
    }
  }
  
  /**
   * Fallback method to load all images immediately
   */
  loadAllImages() {
    document.querySelectorAll(this.options.lazyLoadSelector).forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        delete img.dataset.src;
      }
      
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
        delete img.dataset.srcset;
      }
      
      if (img.dataset.bg) {
        img.style.backgroundImage = `url('${img.dataset.bg}')`;
        delete img.dataset.bg;
      }
      
      img.classList.add(this.options.loadedClass);
    });
  }
  
  /**
   * Create placeholder elements for images
   */
  createPlaceholders() {
    document.querySelectorAll(`${this.options.lazyLoadSelector}:not(.${this.options.loadedClass})`).forEach(img => {
      // Skip if already has placeholder
      if (img.parentNode.querySelector(`.${this.options.placeholderClass}`)) {
        return;
      }
      
      // Create placeholder element
      const placeholder = document.createElement('div');
      placeholder.className = this.options.placeholderClass;
      
      // Use dominant color if available
      if (img.dataset.color) {
        placeholder.style.backgroundColor = img.dataset.color;
      }
      
      // Add tiny preview if available
      if (img.dataset.tiny) {
        placeholder.style.backgroundImage = `url('${img.dataset.tiny}')`;
        placeholder.style.backgroundSize = 'cover';
        placeholder.style.backgroundPosition = 'center';
        placeholder.style.filter = 'blur(10px)';
      }
      
      // Only add placeholder if image is in an aspect ratio container
      if (img.parentNode.classList.contains('aspect-ratio-container')) {
        img.parentNode.insertBefore(placeholder, img);
      }
    });
  }
  
  /**
   * Set up responsive source selection
   */
  setupResponsiveSources() {
    document.querySelectorAll('picture').forEach(picture => {
      const sources = picture.querySelectorAll('source');
      
      // Skip if no sources
      if (sources.length === 0) return;
      
      // Adjust sources based on feature support
      sources.forEach(source => {
        // Handle WebP
        if (source.type === 'image/webp' && !this.options.webpSupport) {
          source.remove();
        }
        
        // Handle AVIF
        if (source.type === 'image/avif' && !this.options.avifSupport) {
          source.remove();
        }
        
        // Handle resolution variants based on connection
        if (this.options.connectionType && this.options.saveData) {
          // Use lower resolution on slow connections
          if (this.options.connectionType === '2g' || this.options.connectionType === 'slow-2g') {
            if (source.dataset.lowRes) {
              source.srcset = source.dataset.lowRes;
            }
          }
        }
      });
    });
  }
  
  /**
   * Set up window resize handler for image resizing
   */
  setupResizeHandler() {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
      // Debounce resize events
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Update art direction on resize
        this.applyArtDirection();
      }, 200);
    });
  }
  
  /**
   * Apply art direction based on screen size
   */
  applyArtDirection() {
    const breakpoints = {
      mobile: 576,
      tablet: 992
    };
    
    const currentWidth = window.innerWidth;
    let currentBreakpoint = 'desktop';
    
    if (currentWidth <= breakpoints.mobile) {
      currentBreakpoint = 'mobile';
    } else if (currentWidth <= breakpoints.tablet) {
      currentBreakpoint = 'tablet';
    }
    
    // Update image sources based on current breakpoint
    document.querySelectorAll('[data-src-mobile], [data-src-tablet], [data-src-desktop]').forEach(img => {
      const mobileSrc = img.dataset.srcMobile;
      const tabletSrc = img.dataset.srcTablet;
      const desktopSrc = img.dataset.srcDesktop;
      
      // Choose appropriate source based on breakpoint
      let newSrc = null;
      
      switch (currentBreakpoint) {
        case 'mobile':
          newSrc = mobileSrc || tabletSrc || desktopSrc;
          break;
        case 'tablet':
          newSrc = tabletSrc || desktopSrc || mobileSrc;
          break;
        case 'desktop':
          newSrc = desktopSrc || tabletSrc || mobileSrc;
          break;
      }
      
      // Update source if needed
      if (newSrc && img.src !== newSrc && !img.dataset.src) {
        // For images that are already loaded
        img.src = newSrc;
      } else if (newSrc && img.dataset.src !== newSrc) {
        // For images that are lazy loaded
        img.dataset.src = newSrc;
      }
    });
  }
  
  /**
   * Calculate size of image to select correct resolution
   * @param {HTMLImageElement} img - The image element
   * @returns {number} - The display width of the image in pixels
   */
  getImageDisplayWidth(img) {
    // Get actual display width
    const displayWidth = img.clientWidth * window.devicePixelRatio;
    
    // If image is in an aspect ratio container, use container width
    if (img.parentNode.classList.contains('aspect-ratio-container')) {
      return img.parentNode.clientWidth * window.devicePixelRatio;
    }
    
    return displayWidth;
  }
  
  /**
   * Choose optimal image resolution based on display size and connection
   * @param {Array} resolutions - Array of available resolutions
   * @param {number} displayWidth - The display width
   * @returns {number} - The optimal resolution
   */
  chooseOptimalResolution(resolutions, displayWidth) {
    // Sort resolutions ascending
    resolutions.sort((a, b) => a - b);
    
    // If save data is enabled, use lower resolution
    if (this.options.saveData) {
      // Find the lowest resolution that's at least 80% of display width
      const minViableWidth = displayWidth * 0.8;
      for (const res of resolutions) {
        if (res >= minViableWidth) {
          return res;
        }
      }
      return resolutions[0];
    }
    
    // For slow connections, be more conservative
    if (this.options.connectionType === '2g' || this.options.connectionType === 'slow-2g') {
      // Find the lowest resolution that's at least 100% of display width
      for (const res of resolutions) {
        if (res >= displayWidth) {
          return res;
        }
      }
    }
    
    // For other connections, add 20% buffer for zooming/scaling
    const targetWidth = displayWidth * 1.2;
    
    // Find the lowest resolution that's at least the target width
    for (const res of resolutions) {
      if (res >= targetWidth) {
        return res;
      }
    }
    
    // If no resolution is large enough, use the largest available
    return resolutions[resolutions.length - 1];
  }
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  window.responsiveImageSystem = new ResponsiveImageSystem();
});

// Add event handlers for game gallery thumbnails
document.addEventListener('DOMContentLoaded', () => {
  const thumbnails = document.querySelectorAll('.game-thumbnails .thumbnail');
  const mainImage = document.querySelector('.game-main-image img');
  const mainPicture = document.querySelector('.game-main-image picture');
  
  if (!thumbnails.length || (!mainImage && !mainPicture)) return;
  
  thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
      // Remove active class from all thumbnails
      thumbnails.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked thumbnail
      thumbnail.classList.add('active');
      
      // Update main image source
      if (thumbnail.dataset.image) {
        if (mainImage) {
          mainImage.src = thumbnail.dataset.image;
          
          // If main image has srcset, update that too
          if (thumbnail.dataset.srcset) {
            mainImage.srcset = thumbnail.dataset.srcset;
          }
        } else if (mainPicture) {
          // Update sources in picture element
          const img = mainPicture.querySelector('img');
          if (img) {
            img.src = thumbnail.dataset.image;
          }
          
          // Update sources
          const sources = mainPicture.querySelectorAll('source');
          sources.forEach(source => {
            const type = source.type;
            if (type === 'image/webp' && thumbnail.dataset.webp) {
              source.srcset = thumbnail.dataset.webp;
            } else if (type === 'image/avif' && thumbnail.dataset.avif) {
              source.srcset = thumbnail.dataset.avif;
            }
          });
        }
      }
      
      // Handle video thumbnails
      if (thumbnail.classList.contains('video') && thumbnail.dataset.video) {
        // Replace image with video
        const gameMainImage = document.querySelector('.game-main-image');
        const currentImg = gameMainImage.querySelector('img, picture');
        
        const video = document.createElement('video');
        video.src = thumbnail.dataset.video;
        video.controls = true;
        video.autoplay = true;
        video.className = 'main-video';
        
        // Store current image for later
        if (!gameMainImage.dataset.imageBackup && currentImg) {
          gameMainImage.dataset.imageBackup = currentImg.outerHTML;
        }
        
        // Replace image with video
        if (currentImg) {
          currentImg.replaceWith(video);
        } else {
          gameMainImage.innerHTML = '';
          gameMainImage.appendChild(video);
        }
      } else if (document.querySelector('.main-video')) {
        // Switch back to image if clicking on an image thumbnail
        const gameMainImage = document.querySelector('.game-main-image');
        const video = gameMainImage.querySelector('.main-video');
        
        // Restore image backup if available
        if (gameMainImage.dataset.imageBackup) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = gameMainImage.dataset.imageBackup;
          const imageBackup = tempDiv.firstChild;
          
          // Update image source with current thumbnail
          if (thumbnail.dataset.image && imageBackup) {
            if (imageBackup.tagName === 'IMG') {
              imageBackup.src = thumbnail.dataset.image;
            } else if (imageBackup.tagName === 'PICTURE') {
              const img = imageBackup.querySelector('img');
              if (img) {
                img.src = thumbnail.dataset.image;
              }
            }
          }
          
          video.replaceWith(imageBackup);
        }
      }
    });
  });
});