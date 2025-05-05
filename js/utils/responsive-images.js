/**
 * Steam Clone - Responsive Images System
 * Handles optimized image loading with art direction, adaptive resolution, and format support
 */

class ResponsiveImageSystem {
  constructor() {
    this.imageFormats = {
      webp: 'image/webp',
      avif: 'image/avif',
      jpeg: 'image/jpeg',
      png: 'image/png'
    };
    
    this.breakpoints = {
      small: 576,    // Small mobile
      medium: 768,   // Tablet/large mobile
      large: 992,    // Laptop
      xlarge: 1200   // Desktop
    };
    
    this.densities = [1, 1.5, 2, 3]; // Device pixel ratios
    
    this.artDirectionSets = {
      'game-banner': {
        small: { width: 400, height: 150, crop: 'center' },
        medium: { width: 768, height: 250, crop: 'center' },
        large: { width: 1200, height: 300, crop: 'center' },
        xlarge: { width: 1600, height: 400, crop: 'center' }
      },
      'game-card': {
        small: { width: 300, height: 200, crop: 'center' },
        medium: { width: 320, height: 200, crop: 'center' },
        large: { width: 280, height: 180, crop: 'center' },
        xlarge: { width: 300, height: 200, crop: 'center' }
      },
      'game-screenshot': {
        small: { width: 400, height: 225, crop: 'center' },
        medium: { width: 600, height: 338, crop: 'center' },
        large: { width: 800, height: 450, crop: 'center' },
        xlarge: { width: 1200, height: 675, crop: 'center' }
      },
      'game-detail-header': {
        small: { width: 576, height: 200, crop: 'center' },
        medium: { width: 768, height: 250, crop: 'center' },
        large: { width: 992, height: 300, crop: 'center' },
        xlarge: { width: 1400, height: 400, crop: 'center' }
      },
      'profile-avatar': {
        small: { width: 64, height: 64, crop: 'circle' },
        medium: { width: 96, height: 96, crop: 'circle' },
        large: { width: 128, height: 128, crop: 'circle' },
        xlarge: { width: 160, height: 160, crop: 'circle' }
      }
    };
    
    // Path to image directories
    this.basePath = '/assets/images/';
    this.optimizedPath = '/assets/images/optimized/';
    
    // Default placeholder for loading or error states
    this.placeholder = {
      loading: this.basePath + 'placeholders/loading.svg',
      error: this.basePath + 'placeholders/error.svg'
    };
    
    // Initialize the system
    this.init();
  }
  
  init() {
    // Check for browser format support
    this.supportedFormats = this.detectSupportedFormats();
    
    // Set up the IntersectionObserver for lazy loading
    this.setupLazyLoading();
    
    // Set up the ResizeObserver to handle viewport changes
    this.setupResizeHandling();
  }
  
  // Detect which image formats the browser supports
  detectSupportedFormats() {
    const supported = {};
    
    // Check for WebP support
    const webp = document.createElement('canvas')
      .toDataURL('image/webp')
      .indexOf('data:image/webp') === 0;
    supported.webp = webp;
    
    // Check for AVIF support (more advanced but less supported)
    // This is a simple detection, might not work in all browsers
    const avif = document.createElement('canvas')
      .toDataURL('image/avif')
      .indexOf('data:image/avif') === 0;
    supported.avif = avif;
    
    // JPEG and PNG are universally supported
    supported.jpeg = true;
    supported.png = true;
    
    return supported;
  }
  
  // Set up lazy loading using Intersection Observer
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      this.lazyLoadObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
            }
            if (img.dataset.sizes) {
              img.sizes = img.dataset.sizes;
            }
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
            
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '200px 0px', // Load images when they're within 200px of viewport
        threshold: 0.01 // Trigger when at least 1% of the image is visible
      });
      
      // Process any existing responsive images on the page
      this.processExistingImages();
    }
  }
  
  // Set up handling for viewport size changes
  setupResizeHandling() {
    if ('ResizeObserver' in window) {
      // We'll use this to update image sizes when needed
      this.resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          // Find responsive image containers that need adjustment
          const container = entry.target;
          const responsiveImages = container.querySelectorAll('.responsive-image-container');
          
          // Update image sizes if container dimensions changed significantly
          if (responsiveImages.length > 0) {
            this.updateImageSizes(responsiveImages);
          }
        }
      });
      
      // Observe main content areas that contain responsive images
      const contentContainers = document.querySelectorAll('.main-content, .game-grid, .featured-section');
      contentContainers.forEach(container => {
        this.resizeObserver.observe(container);
      });
    }
    
    // Also listen for window resize events (fallback and for global changes)
    window.addEventListener('resize', this.debounce(() => {
      const allResponsiveImages = document.querySelectorAll('.responsive-image-container');
      this.updateImageSizes(allResponsiveImages);
    }, 250));
  }
  
  // Process existing responsive image elements on the page
  processExistingImages() {
    // Find all responsive image containers
    const responsiveImageContainers = document.querySelectorAll('.responsive-image-container');
    
    responsiveImageContainers.forEach(container => {
      // Find the image inside the container
      const img = container.querySelector('img');
      if (!img) return;
      
      // Add loading="lazy" attribute for native lazy loading as a fallback
      img.setAttribute('loading', 'lazy');
      
      // Add to our intersection observer for lazy loading
      this.lazyLoadObserver.observe(img);
      
      // Set the default placeholder
      if (!img.src && img.dataset.src) {
        img.src = this.placeholder.loading;
      }
      
      // Handle image load errors
      img.addEventListener('error', () => {
        img.src = this.placeholder.error;
        container.classList.add('image-error');
      });
      
      // Handle successful loads
      img.addEventListener('load', () => {
        if (img.src !== this.placeholder.loading && img.src !== this.placeholder.error) {
          container.classList.add('image-loaded');
        }
      });
    });
    
    // Additionally, directly find imgs with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      if (!img.closest('.responsive-image-container')) {
        this.lazyLoadObserver.observe(img);
      }
    });
  }
  
  // Update image sizes based on container dimensions
  updateImageSizes(containers) {
    containers.forEach(container => {
      const img = container.querySelector('img');
      if (!img) return;
      
      const containerWidth = container.offsetWidth;
      
      // Only update if we have the sizes attribute
      if (img.sizes) {
        // Calculate appropriate size based on container width
        img.sizes = `${containerWidth}px`;
      }
    });
  }
  
  // Create appropriate srcset for responsive images
  generateSrcset(baseUrl, imageType, format) {
    // Make sure we have a supported format
    const imageFormat = this.supportedFormats[format] ? format : 'jpeg';
    
    // Get art direction specs for this image type
    const specs = this.artDirectionSets[imageType] || this.artDirectionSets['game-card'];
    
    let srcset = [];
    
    // Generate srcset with different resolutions for each breakpoint
    Object.keys(specs).forEach(breakpoint => {
      const spec = specs[breakpoint];
      
      // Add entries for different pixel densities
      this.densities.forEach(density => {
        // Calculate dimensions for this density
        const width = Math.round(spec.width * density);
        const height = Math.round(spec.height * density);
        
        // Create the optimized image URL with dimensions and format
        const url = this.getOptimizedImageUrl(baseUrl, width, height, imageFormat, spec.crop);
        
        // Add to srcset with width descriptor
        srcset.push(`${url} ${width}w`);
      });
    });
    
    return srcset.join(', ');
  }
  
  // Create sizes attribute based on image type and breakpoints
  generateSizes(imageType) {
    const specs = this.artDirectionSets[imageType] || this.artDirectionSets['game-card'];
    
    let sizes = [];
    
    // Generate sizes attribute with appropriate dimensions for each breakpoint
    const breakpoints = Object.keys(this.breakpoints).sort((a, b) => 
      this.breakpoints[a] - this.breakpoints[b]
    );
    
    // Start with smallest breakpoint and work up
    breakpoints.forEach((breakpoint, index) => {
      const spec = specs[breakpoint];
      const width = spec.width;
      
      if (index < breakpoints.length - 1) {
        const nextBreakpoint = breakpoints[index + 1];
        sizes.push(`(max-width: ${this.breakpoints[nextBreakpoint] - 1}px) ${width}px`);
      } else {
        // For the largest breakpoint
        sizes.push(`${width}px`);
      }
    });
    
    return sizes.join(', ');
  }
  
  // Get optimized image URL with transformations
  getOptimizedImageUrl(baseUrl, width, height, format, crop = 'center') {
    // This is a simplified version - in a real implementation, 
    // you might use an image processing service or naming convention
    
    // Extract the filename without extension
    const filename = baseUrl.split('/').pop().split('.')[0];
    
    // Build the optimized image path
    return `${this.optimizedPath}${filename}_${width}x${height}_${crop}.${format}`;
  }
  
  // Create a new responsive image element
  createResponsiveImage(imageUrl, imageType, altText, lazyLoad = true) {
    // Create container
    const container = document.createElement('div');
    container.className = 'responsive-image-container';
    container.dataset.imageType = imageType;
    
    // Create image element
    const img = document.createElement('img');
    img.alt = altText || '';
    
    // Determine best format based on browser support
    let bestFormat = 'jpeg'; // Default fallback
    if (this.supportedFormats.avif) {
      bestFormat = 'avif';
    } else if (this.supportedFormats.webp) {
      bestFormat = 'webp';
    }
    
    // Set srcset and sizes
    const srcset = this.generateSrcset(imageUrl, imageType, bestFormat);
    const sizes = this.generateSizes(imageType);
    
    // Apply srcset and sizes (directly or as data attributes for lazy loading)
    if (lazyLoad) {
      img.dataset.srcset = srcset;
      img.dataset.sizes = sizes;
      img.dataset.src = this.getOptimizedImageUrl(
        imageUrl, 
        this.artDirectionSets[imageType].medium.width,
        this.artDirectionSets[imageType].medium.height,
        bestFormat
      );
      img.src = this.placeholder.loading;
      img.className = 'lazy-image';
      
      // Add to lazy loading observer
      if (this.lazyLoadObserver) {
        this.lazyLoadObserver.observe(img);
      }
    } else {
      img.srcset = srcset;
      img.sizes = sizes;
      img.src = this.getOptimizedImageUrl(
        imageUrl,
        this.artDirectionSets[imageType].medium.width,
        this.artDirectionSets[imageType].medium.height,
        bestFormat
      );
    }
    
    // Add loading="lazy" for browsers that support it
    img.setAttribute('loading', 'lazy');
    
    // Error handling
    img.addEventListener('error', () => {
      img.src = this.placeholder.error;
      container.classList.add('image-error');
    });
    
    // Handle successful loads
    img.addEventListener('load', () => {
      if (img.src !== this.placeholder.loading && img.src !== this.placeholder.error) {
        container.classList.add('image-loaded');
      }
    });
    
    // Add image to container
    container.appendChild(img);
    
    return container;
  }
  
  // Update all images on the page to use the responsive system
  enhancePageImages() {
    // Find standard images that should be upgraded
    const images = document.querySelectorAll('img:not(.lazy-image):not([data-no-enhance])');
    
    images.forEach(img => {
      // Only process images with src
      if (!img.src) return;
      
      // Determine image type based on classes or context
      let imageType = 'game-card'; // Default type
      
      if (img.closest('.game-banner, .featured-banner')) {
        imageType = 'game-banner';
      } else if (img.closest('.game-screenshot')) {
        imageType = 'game-screenshot';
      } else if (img.closest('.game-header')) {
        imageType = 'game-detail-header';
      } else if (img.closest('.avatar, .profile-avatar')) {
        imageType = 'profile-avatar';
      }
      
      // Create responsive version
      const originalSrc = img.src;
      const alt = img.alt || '';
      const responsive = this.createResponsiveImage(originalSrc, imageType, alt, true);
      
      // Replace original image with responsive container
      const parent = img.parentNode;
      parent.replaceChild(responsive, img);
    });
  }
  
  // Create a picture element with multiple source formats for maximum compatibility
  createPictureElement(imageUrl, imageType, altText) {
    const picture = document.createElement('picture');
    const specs = this.artDirectionSets[imageType] || this.artDirectionSets['game-card'];
    
    // Create sources for different formats in descending order of preference
    // AVIF - best compression but less supported
    if (this.supportedFormats.avif) {
      const avifSource = document.createElement('source');
      avifSource.srcset = this.generateSrcset(imageUrl, imageType, 'avif');
      avifSource.sizes = this.generateSizes(imageType);
      avifSource.type = this.imageFormats.avif;
      picture.appendChild(avifSource);
    }
    
    // WebP - good compression and wider support
    if (this.supportedFormats.webp) {
      const webpSource = document.createElement('source');
      webpSource.srcset = this.generateSrcset(imageUrl, imageType, 'webp');
      webpSource.sizes = this.generateSizes(imageType);
      webpSource.type = this.imageFormats.webp;
      picture.appendChild(webpSource);
    }
    
    // JPEG/PNG - fallback for all browsers
    const defaultSource = document.createElement('source');
    defaultSource.srcset = this.generateSrcset(imageUrl, imageType, 'jpeg');
    defaultSource.sizes = this.generateSizes(imageType);
    defaultSource.type = this.imageFormats.jpeg;
    picture.appendChild(defaultSource);
    
    // Create the img element (required within picture)
    const img = document.createElement('img');
    img.alt = altText || '';
    img.src = this.getOptimizedImageUrl(
      imageUrl,
      specs.medium.width,
      specs.medium.height,
      'jpeg'
    );
    img.setAttribute('loading', 'lazy');
    
    // Error handling
    img.addEventListener('error', () => {
      img.src = this.placeholder.error;
      picture.classList.add('image-error');
    });
    
    picture.appendChild(img);
    
    // Wrap in container for styling
    const container = document.createElement('div');
    container.className = 'responsive-image-container';
    container.dataset.imageType = imageType;
    container.appendChild(picture);
    
    return container;
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
  
  // Add necessary CSS for responsive images
  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .responsive-image-container {
        position: relative;
        overflow: hidden;
        background-color: #1a2233; /* Dark background while loading */
      }
      
      .responsive-image-container img, 
      .responsive-image-container picture {
        display: block;
        width: 100%;
        height: auto;
        transition: opacity 0.3s ease;
      }
      
      .responsive-image-container .lazy-image:not(.loaded) {
        opacity: 0;
      }
      
      .responsive-image-container .lazy-image.loaded {
        opacity: 1;
      }
      
      .responsive-image-container.image-error {
        background-color: #2a3f5f;
      }
      
      .responsive-image-container.image-error::after {
        content: "Image could not be loaded";
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        color: #8ba3bd;
        font-size: 14px;
        text-align: center;
        padding: 20px;
      }
      
      /* Art direction specific styles */
      [data-image-type="profile-avatar"] {
        border-radius: 50%;
      }
      
      [data-image-type="profile-avatar"] img {
        border-radius: 50%;
      }
      
      [data-image-type="game-banner"] {
        aspect-ratio: 4 / 1;
      }
      
      [data-image-type="game-card"] {
        aspect-ratio: 16 / 9;
      }
      
      [data-image-type="game-screenshot"] {
        aspect-ratio: 16 / 9;
      }
      
      [data-image-type="game-detail-header"] {
        aspect-ratio: 3.5 / 1;
      }
    `;
    
    document.head.appendChild(style);
  }
}

// Initialize the responsive image system when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.responsiveImageSystem = new ResponsiveImageSystem();
  window.responsiveImageSystem.injectStyles();
  
  // Wait a bit to let other scripts finish, then enhance existing images
  setTimeout(() => {
    window.responsiveImageSystem.enhancePageImages();
  }, 100);
});

// Export the class for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ResponsiveImageSystem;
}