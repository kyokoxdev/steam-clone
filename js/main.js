/**
 * Main JavaScript entry point for the Steam Clone website
 * Initializes all components and handles global functionality
 */

// Import components
import './components/game-cards.js';
import './lazy-loading.js';
import ThemeManager from './themes.js';
import './components/theme-switcher.js';
import AgeVerificationSystem from './age-verification.js';

// Register the service worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

// Initialize the mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  }
  
  // Add sticky header functionality
  const header = document.querySelector('.main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('sticky');
      } else {
        header.classList.remove('sticky');
      }
    });
  }
  
  // Initialize ThemeManager (new implementation)
  ThemeManager.init();
  
  // Initialize Age Verification System
  AgeVerificationSystem.init();
});