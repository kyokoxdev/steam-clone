/**
 * Responsive Testing Helper
 * This script helps identify layout issues at different screen sizes
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize responsive testing features
    initResponsiveTester();
});

/**
 * Initialize the responsive testing functionality
 */
function initResponsiveTester() {
    // Create responsive testing toolbar
    createTestingToolbar();
    
    // Check for any potential layout issues
    checkLayoutIssues();
    
    // Listen for window resize events
    window.addEventListener('resize', debounce(function() {
        checkLayoutIssues();
        updateScreenSizeIndicator();
    }, 250));
}

/**
 * Creates a testing toolbar that shows the current screen size
 * and provides buttons to test at standard breakpoints
 */
function createTestingToolbar() {
    // Only create toolbar during development
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return;
    }
    
    const toolbar = document.createElement('div');
    toolbar.className = 'responsive-test-toolbar';
    toolbar.innerHTML = `
        <div class="test-toolbar-content">
            <div class="screen-size-indicator">
                <span class="current-size"></span>
                <span class="current-breakpoint"></span>
            </div>
            <div class="test-buttons">
                <button data-width="320" title="Small Mobile">SM</button>
                <button data-width="576" title="Mobile">M</button>
                <button data-width="768" title="Tablet">T</button>
                <button data-width="992" title="Laptop">L</button>
                <button data-width="1200" title="Desktop">D</button>
                <button data-width="1400" title="Large Desktop">XL</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(toolbar);
    
    // Add event listeners to buttons
    const buttons = toolbar.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const width = this.getAttribute('data-width');
            window.open(window.location.href, '_blank', `width=${width},height=800,resizable=yes`);
        });
    });
    
    // Style the toolbar
    const style = document.createElement('style');
    style.textContent = `
        .responsive-test-toolbar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgba(0,0,0,0.8);
            color: white;
            z-index: 9999;
            padding: 8px;
            font-family: monospace;
            font-size: 12px;
        }
        .test-toolbar-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 600px;
            margin: 0 auto;
        }
        .screen-size-indicator {
            display: flex;
            flex-direction: column;
        }
        .current-size {
            font-weight: bold;
        }
        .test-buttons {
            display: flex;
            gap: 8px;
        }
        .test-buttons button {
            background: #444;
            border: none;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
        }
        .test-buttons button:hover {
            background: #666;
        }
        .layout-issue {
            outline: 2px solid red !important;
            position: relative;
        }
        .layout-issue::before {
            content: "⚠️";
            position: absolute;
            top: 0;
            right: 0;
            background: red;
            color: white;
            padding: 2px 4px;
            font-size: 10px;
            z-index: 1000;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize screen size display
    updateScreenSizeIndicator();
}

/**
 * Update the indicator showing current screen dimensions and breakpoint
 */
function updateScreenSizeIndicator() {
    const sizeIndicator = document.querySelector('.current-size');
    const breakpointIndicator = document.querySelector('.current-breakpoint');
    
    if (!sizeIndicator || !breakpointIndicator) return;
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    sizeIndicator.textContent = `${width}px × ${height}px`;
    
    // Determine current breakpoint
    let breakpoint = '';
    if (width < 576) {
        breakpoint = 'Small Mobile (<576px)';
    } else if (width < 768) {
        breakpoint = 'Mobile (576px-767px)';
    } else if (width < 992) {
        breakpoint = 'Tablet (768px-991px)';
    } else if (width < 1200) {
        breakpoint = 'Laptop (992px-1199px)';
    } else {
        breakpoint = 'Desktop (1200px+)';
    }
    
    breakpointIndicator.textContent = breakpoint;
}

/**
 * Check for common layout issues
 */
function checkLayoutIssues() {
    // Clear previous issue markers
    document.querySelectorAll('.layout-issue').forEach(el => {
        el.classList.remove('layout-issue');
    });
    
    // Check for horizontal overflow
    const bodyWidth = document.body.offsetWidth;
    const elements = document.querySelectorAll('*');
    
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        
        // Check for elements that cause horizontal scrolling
        if (rect.right > bodyWidth + 5) { // 5px buffer
            el.classList.add('layout-issue');
        }
        
        // Check for extremely small touch targets on mobile
        if (window.innerWidth < 768) {
            const isClickable = el.tagName === 'BUTTON' || 
                               el.tagName === 'A' || 
                               el.tagName === 'INPUT' ||
                               el.getAttribute('role') === 'button';
            
            if (isClickable && (rect.width < 44 || rect.height < 44)) {
                el.classList.add('layout-issue');
            }
        }
    });
}

/**
 * Debounce function to limit how often a function is called
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}