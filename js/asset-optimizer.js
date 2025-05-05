/**
 * Asset Optimization Utilities
 * Functions to optimize CSS and JavaScript delivery
 */

const AssetOptimizer = {
    /**
     * Initialize CSS and JS optimization features
     */
    init: function() {
        // Check if running in development or production mode
        const isProduction = this.isProductionMode();
        
        // In production mode, use optimized assets
        if (isProduction) {
            this.switchToOptimizedAssets();
        }
        
        console.log(`Asset optimization initialized in ${isProduction ? 'production' : 'development'} mode`);
    },
    
    /**
     * Check if the site is running in production mode
     * @returns {boolean} True if in production mode
     */
    isProductionMode: function() {
        // Check if the URL contains a production indicator
        // This is a simple example - in a real app, you might check environment variables
        return window.location.hostname !== 'localhost' && 
               !window.location.hostname.includes('127.0.0.1') &&
               !window.location.search.includes('dev=true');
    },
    
    /**
     * Switch to optimized CSS and JS assets
     */
    switchToOptimizedAssets: function() {
        // Replace individual CSS files with the optimized bundle
        this.replaceCssWithBundle();
        
        // Replace individual JS files with the optimized bundle
        this.replaceJsWithBundle();
    },
    
    /**
     * Replace individual CSS links with a bundled CSS file
     */
    replaceCssWithBundle: function() {
        // Find all CSS links except those marked to keep
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"]:not([data-keep])');
        
        if (cssLinks.length <= 1) return; // No need to bundle if only one file
        
        // Create a new link element for the bundled CSS
        const bundledLink = document.createElement('link');
        bundledLink.rel = 'stylesheet';
        bundledLink.href = 'dist/bundle.min.css';
        
        // Replace the first link with the bundled version
        if (cssLinks.length > 0) {
            cssLinks[0].parentNode.replaceChild(bundledLink, cssLinks[0]);
            
            // Remove the rest of the links
            for (let i = 1; i < cssLinks.length; i++) {
                cssLinks[i].parentNode.removeChild(cssLinks[i]);
            }
        }
    },
    
    /**
     * Replace individual JS scripts with a bundled JS file
     */
    replaceJsWithBundle: function() {
        // Find all script tags except those marked to keep
        const scripts = document.querySelectorAll('script:not([data-keep]):not([src*="bundle.min.js"])');
        
        if (scripts.length <= 1) return; // No need to bundle if only one file
        
        // Get the last script element
        const lastScript = scripts[scripts.length - 1];
        
        // Create a new script element for the bundled JS
        const bundledScript = document.createElement('script');
        bundledScript.src = 'dist/bundle.min.js';
        
        // Insert the bundled script after the last script
        lastScript.parentNode.insertBefore(bundledScript, lastScript.nextSibling);
        
        // Remove all the individual scripts (except the last one, which contains the initialization code)
        for (let i = 0; i < scripts.length - 1; i++) {
            if (!scripts[i].hasAttribute('src')) continue; // Skip inline scripts
            scripts[i].parentNode.removeChild(scripts[i]);
        }
    },
    
    /**
     * Create critical CSS and inline it in the head
     * This is typically done at build time, but this simulates it for demonstration
     * @param {string} pageName - Name of the current page
     */
    inlineCriticalCss: function(pageName) {
        // This would normally be pre-generated during build process
        // Here we simulate it by creating a <style> element
        const criticalCss = document.createElement('style');
        criticalCss.setAttribute('data-critical', 'true');
        
        // Basic critical CSS for fast initial render
        criticalCss.textContent = `
            /* Critical CSS for ${pageName} */
            body { 
                margin: 0; 
                font-family: sans-serif; 
                background-color: #171a21;
                color: #ffffff;
            }
            .main-header {
                background-color: #171a21;
                position: sticky;
                top: 0;
                z-index: 100;
                height: 104px;
                display: flex;
                align-items: center;
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 15px;
                width: 100%;
            }
            .hero {
                position: relative;
                margin-bottom: 40px;
            }
            .game-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 40px;
            }
        `;
        
        // Insert it at the beginning of the head
        document.head.insertBefore(criticalCss, document.head.firstChild);
    },
    
    /**
     * Load JavaScript files asynchronously
     * @param {string[]} urls - Array of JavaScript URLs to load
     * @param {Function} callback - Callback to run when all scripts are loaded
     */
    loadScriptsAsync: function(urls, callback) {
        let loadedCount = 0;
        
        urls.forEach(url => {
            const script = document.createElement('script');
            script.src = url;
            script.async = true;
            
            script.onload = () => {
                loadedCount++;
                if (loadedCount === urls.length && callback) {
                    callback();
                }
            };
            
            document.body.appendChild(script);
        });
    },
    
    /**
     * Load CSS files asynchronously
     * @param {string[]} urls - Array of CSS URLs to load
     */
    loadCssAsync: function(urls) {
        urls.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            
            const loadAsync = document.createElement('link');
            loadAsync.rel = 'preload';
            loadAsync.as = 'style';
            loadAsync.href = url;
            loadAsync.onload = () => {
                document.head.appendChild(link);
            };
            
            document.head.appendChild(loadAsync);
        });
    }
};

// Initialize on DOM load, with defer to prioritize rendering
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => AssetOptimizer.init(), 0);
    });
} else {
    setTimeout(() => AssetOptimizer.init(), 0);
}

// Make available globally
window.AssetOptimizer = AssetOptimizer;