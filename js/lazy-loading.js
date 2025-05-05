/**
 * Lazy loading implementation for images
 * Uses the Intersection Observer API to load images only when they enter the viewport
 */

document.addEventListener('DOMContentLoaded', () => {
  // Get all images with the lazy-load class
  const lazyImages = document.querySelectorAll('img.lazy-load');
  
  // Check if Intersection Observer is supported
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        // If the image is in the viewport
        if (entry.isIntersecting) {
          const image = entry.target;
          
          // Replace src with the data-src
          if (image.dataset.src) {
            image.src = image.dataset.src;
          }
          
          // Replace srcset with the data-srcset (for responsive images)
          if (image.dataset.srcset) {
            image.srcset = image.dataset.srcset;
          }
          
          // Add loaded class for any CSS transitions
          image.classList.add('loaded');
          
          // Remove the lazy-load class
          image.classList.remove('lazy-load');
          
          // Stop observing this image
          imageObserver.unobserve(image);
        }
      });
    });
    
    // Start observing each lazy image
    lazyImages.forEach(image => {
      imageObserver.observe(image);
    });
  } else {
    // Fallback for browsers that don't support Intersection Observer
    // Simple scroll event fallback (less efficient)
    let lazyLoadThrottleTimeout;
    
    function lazyLoad() {
      if (lazyLoadThrottleTimeout) {
        clearTimeout(lazyLoadThrottleTimeout);
      }
      
      lazyLoadThrottleTimeout = setTimeout(() => {
        const scrollTop = window.pageYOffset;
        
        lazyImages.forEach(img => {
          if (img.offsetTop < (window.innerHeight + scrollTop + 500)) {
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
            
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
            }
            
            img.classList.add('loaded');
            img.classList.remove('lazy-load');
          }
        });
        
        // If all images are loaded, remove the scroll event
        if (lazyImages.length === 0) {
          document.removeEventListener('scroll', lazyLoad);
          window.removeEventListener('resize', lazyLoad);
          window.removeEventListener('orientationChange', lazyLoad);
        }
      }, 20);
    }
    
    // Add scroll event
    document.addEventListener('scroll', lazyLoad);
    window.addEventListener('resize', lazyLoad);
    window.addEventListener('orientationChange', lazyLoad);
    
    // Initial load
    lazyLoad();
  }
});