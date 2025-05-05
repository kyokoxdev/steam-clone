/**
 * Image Optimization Utilities
 * Functions to optimize image loading and delivery
 */

const ImageOptimizer = {
    /**
     * Initialize image optimization features
     */
    init: function() {
        // Add lazy loading to images
        this.setupLazyLoading();
        
        // Set up responsive images
        this.setupResponsiveImages();
        
        console.log('Image optimization initialized');
    },
    
    /**
     * Add lazy loading to images
     */
    setupLazyLoading: function() {
        // Check if Intersection Observer is supported
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src], img:not([loading="lazy"])');
            
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // If using data-src (old-school lazy loading)
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            if (img.dataset.srcset) {
                                img.srcset = img.dataset.srcset;
                            }
                            delete img.dataset.src;
                            delete img.dataset.srcset;
                        } 
                        // Otherwise, just add the loading="lazy" attribute
                        else {
                            img.setAttribute('loading', 'lazy');
                        }
                        
                        // Stop observing the image once it's loaded
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '0px 0px 200px 0px' // Start loading when image is 200px below viewport
            });
            
            // Observe all lazy images
            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers that don't support Intersection Observer
            // Just add loading="lazy" attribute which is supported by modern browsers
            document.querySelectorAll('img:not([loading])').forEach(img => {
                img.setAttribute('loading', 'lazy');
            });
        }
    },
    
    /**
     * Set up responsive images with srcset
     */
    setupResponsiveImages: function() {
        // Get all <img> elements without srcset but with data-responsive attribute
        const images = document.querySelectorAll('img[data-responsive]:not([srcset])');
        
        images.forEach(img => {
            const src = img.src;
            
            // Don't process if not an actual image path
            if (!src || src.startsWith('data:') || src.includes('placeholder')) {
                return;
            }
            
            // Parse the filename and extension
            const lastDotIndex = src.lastIndexOf('.');
            const lastSlashIndex = src.lastIndexOf('/');
            
            if (lastDotIndex === -1 || lastSlashIndex === -1) {
                return;
            }
            
            const basePath = src.substring(0, lastSlashIndex + 1);
            const fileName = src.substring(lastSlashIndex + 1, lastDotIndex);
            const extension = src.substring(lastDotIndex);
            
            // Create srcset for responsive images
            // Assume we have these sizes available: -small, -medium, -large
            const srcset = [
                `${basePath}${fileName}-small${extension} 400w`,
                `${basePath}${fileName}-medium${extension} 800w`,
                `${basePath}${fileName}-large${extension} 1200w`
            ].join(', ');
            
            // Add srcset and sizes attributes
            img.setAttribute('srcset', srcset);
            
            // Set appropriate sizes attribute based on the image's context
            if (img.closest('.game-card')) {
                img.setAttribute('sizes', '(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw');
            } else if (img.closest('.hero')) {
                img.setAttribute('sizes', '100vw');
            } else {
                img.setAttribute('sizes', '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw');
            }
            
            // Remove the data-responsive attribute
            img.removeAttribute('data-responsive');
        });
    },
    
    /**
     * Convert images to WebP format using the <picture> element
     * Note: This should be called when adding images dynamically
     * @param {HTMLElement} container - Container element to search for images
     */
    convertToWebP: function(container = document) {
        const images = container.querySelectorAll('img[data-webp]:not(.webp-processed)');
        
        images.forEach(img => {
            const src = img.src;
            
            // Don't process if not an actual image path
            if (!src || src.startsWith('data:') || src.includes('placeholder')) {
                return;
            }
            
            const lastDotIndex = src.lastIndexOf('.');
            if (lastDotIndex === -1) {
                return;
            }
            
            // Create WebP path
            const webpSrc = src.substring(0, lastDotIndex) + '.webp';
            
            // Create picture element
            const picture = document.createElement('picture');
            
            // Create WebP source
            const webpSource = document.createElement('source');
            webpSource.setAttribute('type', 'image/webp');
            webpSource.setAttribute('srcset', webpSrc);
            
            // Create fallback source
            const fallbackSource = document.createElement('source');
            fallbackSource.setAttribute('type', `image/${img.src.split('.').pop()}`);
            fallbackSource.setAttribute('srcset', src);
            
            // Set up the picture element
            picture.appendChild(webpSource);
            picture.appendChild(fallbackSource);
            
            // Copy attributes from img to new img (except src and srcset)
            const newImg = document.createElement('img');
            Array.from(img.attributes).forEach(attr => {
                if (attr.name !== 'src' && attr.name !== 'srcset' && attr.name !== 'data-webp') {
                    newImg.setAttribute(attr.name, attr.value);
                }
            });
            
            // Set src as fallback
            newImg.src = src;
            newImg.classList.add('webp-processed');
            
            // Replace the original img with picture
            picture.appendChild(newImg);
            img.parentNode.replaceChild(picture, img);
        });
    }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    ImageOptimizer.init();
});

// Make available globally
window.ImageOptimizer = ImageOptimizer;