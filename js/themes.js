/**
 * Theme Management Module
 * Handles theme switching between dark and light modes
 */

const ThemeManager = (function() {
    // Theme definitions
    const themes = {
        dark: {
            name: 'dark',
            primaryBg: '#171a21',
            secondaryBg: '#1b2838',
            primaryAccent: '#1a9fff',
            secondaryAccent: '#66c0f4',
            textPrimary: '#ffffff',
            textSecondary: '#c7d5e0'
        },
        light: {
            name: 'light',
            primaryBg: '#f1f1f1',
            secondaryBg: '#e1e1e1',
            primaryAccent: '#1a73e8',
            secondaryAccent: '#4c8bf5',
            textPrimary: '#202020',
            textSecondary: '#5c5c5c'
        }
    };

    // Get current theme from localStorage or default to dark
    const getCurrentTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'dark';
    };

    // Apply theme to document
    const applyTheme = (themeName) => {
        const theme = themes[themeName] || themes.dark;
        
        // Set CSS variables on root element
        document.documentElement.style.setProperty('--primary-bg', theme.primaryBg);
        document.documentElement.style.setProperty('--secondary-bg', theme.secondaryBg);
        document.documentElement.style.setProperty('--primary-accent', theme.primaryAccent);
        document.documentElement.style.setProperty('--secondary-accent', theme.secondaryAccent);
        document.documentElement.style.setProperty('--text-primary', theme.textPrimary);
        document.documentElement.style.setProperty('--text-secondary', theme.textSecondary);
        
        // Add theme class to body
        document.body.className = '';
        document.body.classList.add(`theme-${themeName}`);
        
        // Store theme preference
        localStorage.setItem('theme', themeName);
    };

    // Toggle between themes
    const toggleTheme = () => {
        const currentTheme = getCurrentTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        return newTheme;
    };

    // Detect system preference
    const detectSystemTheme = () => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        } else {
            return 'light';
        }
    };

    // Initialize theme
    const init = () => {
        // Check for saved theme or use system preference
        const savedTheme = localStorage.getItem('theme');
        const initialTheme = savedTheme || detectSystemTheme();
        
        // Apply the selected theme
        applyTheme(initialTheme);
        
        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
                if (!localStorage.getItem('theme')) { // Only auto-switch if user hasn't explicitly chosen
                    applyTheme(event.matches ? 'dark' : 'light');
                }
            });
        }
    };

    // Public API
    return {
        init,
        getCurrentTheme,
        applyTheme,
        toggleTheme,
        detectSystemTheme
    };
})();

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', ThemeManager.init);

export default ThemeManager;