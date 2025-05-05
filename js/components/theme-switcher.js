/**
 * Theme Switcher Component
 * UI component for switching between light and dark theme
 */
import ThemeManager from '../themes.js';

const ThemeSwitcher = (function() {
    // Create the theme switcher button
    const createThemeSwitcherButton = () => {
        // Create button element
        const button = document.createElement('button');
        button.className = 'theme-switcher';
        button.setAttribute('aria-label', 'Switch theme');
        button.setAttribute('title', 'Switch between dark and light theme');
        
        // Create sun icon for light theme
        const sunIcon = document.createElement('span');
        sunIcon.className = 'icon sun-icon';
        sunIcon.innerHTML = '☀️';
        
        // Create moon icon for dark theme
        const moonIcon = document.createElement('span');
        moonIcon.className = 'icon moon-icon';
        moonIcon.innerHTML = '🌙';
        
        // Add icons to button
        button.appendChild(sunIcon);
        button.appendChild(moonIcon);
        
        // Add event listener for theme toggling
        button.addEventListener('click', () => {
            const newTheme = ThemeManager.toggleTheme();
            
            // Update button state based on theme
            updateButtonState(button, newTheme);
            
            // Announce theme change to screen readers
            announceThemeChange(newTheme);
        });
        
        return button;
    };
    
    // Update button state based on current theme
    const updateButtonState = (button, theme) => {
        // Update aria-label for accessibility
        button.setAttribute('aria-label', 
            theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
        );
    };
    
    // Announce theme change for screen readers
    const announceThemeChange = (theme) => {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.classList.add('sr-only');
        announcement.textContent = `Theme changed to ${theme} mode`;
        
        document.body.appendChild(announcement);
        
        // Remove announcement after it's read
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 3000);
    };
    
    // Initialize theme switcher
    const init = () => {
        // Create the theme switcher button
        const themeSwitcherButton = createThemeSwitcherButton();
        
        // Set initial state based on current theme
        updateButtonState(themeSwitcherButton, ThemeManager.getCurrentTheme());
        
        // Find container for theme switcher in the header
        const userControls = document.querySelector('.user-controls');
        
        if (userControls) {
            // Insert before the first child if it exists
            userControls.insertBefore(themeSwitcherButton, userControls.firstChild);
        } else {
            // If user controls don't exist, add to header
            const header = document.querySelector('header');
            if (header) {
                // Create container for the theme switcher
                const container = document.createElement('div');
                container.className = 'theme-switcher-container';
                container.appendChild(themeSwitcherButton);
                
                header.appendChild(container);
            }
        }
    };
    
    // Public API
    return {
        init
    };
})();

// Initialize theme switcher on page load
document.addEventListener('DOMContentLoaded', ThemeSwitcher.init);

export default ThemeSwitcher;