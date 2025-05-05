/**
 * Main entry point for the application
 * Initializes the i18n module and other components
 */

import i18n from './i18n/i18n.js';

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize internationalization
  await i18n.init();
  
  console.log(`Application initialized with language: ${i18n.currentLanguage}`);
  
  // Add language change listener for dynamic content
  i18n.onLanguageChange((lang) => {
    console.log(`Language changed to: ${lang}`);
    // Update any dynamic content here that isn't handled by data-i18n attributes
  });
});