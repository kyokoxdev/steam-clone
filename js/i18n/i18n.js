/**
 * Internationalization (i18n) module for the GameHub store
 * Handles language detection, translation, and language switching functionality
 */

// Default language and supported languages
const DEFAULT_LANGUAGE = 'en';
const SUPPORTED_LANGUAGES = {
  'en': { name: 'English', flag: 'en', direction: 'ltr' },
  'es': { name: 'Español', flag: 'es', direction: 'ltr' },
  'fr': { name: 'Français', flag: 'fr', direction: 'ltr' },
  'de': { name: 'Deutsch', flag: 'de', direction: 'ltr' },
  'ja': { name: '日本語', flag: 'ja', direction: 'ltr' },
  'ru': { name: 'Русский', flag: 'ru', direction: 'ltr' },
  'ar': { name: 'العربية', flag: 'ar', direction: 'rtl' },
  'he': { name: 'עברית', flag: 'he', direction: 'rtl' }
};

// RTL languages
const RTL_LANGUAGES = ['ar', 'he'];

// Cache for loaded translations
const translations = {};

// Current active language
let currentLanguage = DEFAULT_LANGUAGE;

// Event listeners for language change
const languageChangeListeners = [];

/**
 * Initialize the i18n module
 * Detects the browser language, loads translations, and sets up the UI
 */
async function init() {
  // Detect browser language or get from localStorage
  const savedLanguage = localStorage.getItem('language');
  const browserLanguage = navigator.language.split('-')[0];
  
  // Use saved language, or browser language if supported, or default
  let detectedLanguage = savedLanguage;
  if (!detectedLanguage && SUPPORTED_LANGUAGES[browserLanguage]) {
    detectedLanguage = browserLanguage;
  }
  
  // Set the initial language (default if no supported language detected)
  const initialLanguage = detectedLanguage && SUPPORTED_LANGUAGES[detectedLanguage] 
    ? detectedLanguage 
    : DEFAULT_LANGUAGE;
  
  // Load the translations for the initial language
  await loadTranslations(initialLanguage);
  
  // Set the language and update UI
  await setLanguage(initialLanguage);
  
  // Create and insert the language switcher into the header
  createLanguageSwitcher();
  
  return initialLanguage;
}

/**
 * Load translations for a specific language
 * @param {string} language - Language code (e.g., 'en', 'es')
 * @returns {Promise<Object>} - The translation object
 */
async function loadTranslations(language) {
  // If translations for this language are already loaded, return them
  if (translations[language]) {
    return translations[language];
  }
  
  try {
    // Fetch the language file
    const response = await fetch(`./i18n/translations/${language}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load translations for ${language}`);
    }
    
    // Parse and store the translations
    const data = await response.json();
    translations[language] = data;
    return data;
  } catch (error) {
    console.error(`Error loading translations for ${language}:`, error);
    
    // If there's an error, fall back to default language
    if (language !== DEFAULT_LANGUAGE) {
      console.warn(`Falling back to ${DEFAULT_LANGUAGE} translations`);
      return loadTranslations(DEFAULT_LANGUAGE);
    }
    
    // If default language fails, return empty object to avoid errors
    return {};
  }
}

/**
 * Set the current language and update UI
 * @param {string} language - Language code to set
 */
async function setLanguage(language) {
  // Load the translations if they're not already loaded
  if (!translations[language]) {
    await loadTranslations(language);
  }
  
  // Update the current language
  currentLanguage = language;
  
  // Save the language preference
  localStorage.setItem('language', language);
  
  // Update the document language attribute
  document.documentElement.lang = language;
  
  // Update the text direction for RTL languages
  const direction = RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';
  document.documentElement.dir = direction;
  document.body.classList.toggle('rtl', direction === 'rtl');
  
  // Translate all elements with data-i18n attributes
  translatePage();
  
  // Format dates according to the locale
  formatDatesForLocale(language);
  
  // Update currency display if needed
  updateCurrencyDisplay(language);
  
  // Notify all listeners about the language change
  notifyLanguageChange(language);
}

/**
 * Create and insert the language switcher into the header
 */
function createLanguageSwitcher() {
  const headerActions = document.querySelector('.header-actions');
  if (!headerActions) return;
  
  // Create language switcher container
  const languageSwitcher = document.createElement('div');
  languageSwitcher.className = 'language-switcher';
  
  // Create the current language button
  const currentLangButton = document.createElement('button');
  currentLangButton.className = 'current-language';
  currentLangButton.innerHTML = `
    <img src="images/flags/${SUPPORTED_LANGUAGES[currentLanguage].flag}.svg" alt="${SUPPORTED_LANGUAGES[currentLanguage].name}" />
    <span>${SUPPORTED_LANGUAGES[currentLanguage].name}</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
  `;
  
  // Create dropdown list
  const languageDropdown = document.createElement('div');
  languageDropdown.className = 'language-dropdown';
  
  // Add language options
  for (const [code, { name, flag }] of Object.entries(SUPPORTED_LANGUAGES)) {
    const langOption = document.createElement('button');
    langOption.className = `language-option ${code === currentLanguage ? 'active' : ''}`;
    langOption.dataset.lang = code;
    langOption.innerHTML = `
      <img src="images/flags/${flag}.svg" alt="${name}" />
      <span>${name}</span>
    `;
    
    // Add click handler
    langOption.addEventListener('click', async () => {
      if (code !== currentLanguage) {
        await setLanguage(code);
        
        // Update UI to reflect the change
        document.querySelectorAll('.language-option').forEach(el => {
          el.classList.toggle('active', el.dataset.lang === code);
        });
        
        // Update current language button
        currentLangButton.innerHTML = `
          <img src="images/flags/${flag}.svg" alt="${name}" />
          <span>${name}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        `;
        
        // Close dropdown
        languageSwitcher.classList.remove('open');
      }
    });
    
    languageDropdown.appendChild(langOption);
  }
  
  // Toggle dropdown on current language button click
  currentLangButton.addEventListener('click', () => {
    languageSwitcher.classList.toggle('open');
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (event) => {
    if (!languageSwitcher.contains(event.target)) {
      languageSwitcher.classList.remove('open');
    }
  });
  
  // Assemble and insert the language switcher
  languageSwitcher.appendChild(currentLangButton);
  languageSwitcher.appendChild(languageDropdown);
  headerActions.appendChild(languageSwitcher);
}

/**
 * Translate the entire page based on data-i18n attributes
 */
function translatePage() {
  // Get the current translation object
  const currentTranslations = translations[currentLanguage] || {};
  
  // Find all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = getNestedTranslation(currentTranslations, key);
    
    if (translation) {
      // Handle element type and attributes
      if (element.tagName === 'INPUT' && element.hasAttribute('data-i18n-placeholder')) {
        // For input elements with placeholder translation
        element.placeholder = translation;
      } else if (element.hasAttribute('data-i18n-param-year')) {
        // For elements with a year parameter
        const year = element.getAttribute('data-i18n-param-year');
        element.textContent = translation.replace('{year}', year);
      } else {
        // Regular text translation
        element.textContent = translation;
      }
    }
  });
}

/**
 * Get a nested translation value from a key path like "navigation.home"
 * @param {Object} translations - Translation object
 * @param {string} keyPath - Dot-separated path to the translation
 * @returns {string|null} - Translation text or null if not found
 */
function getNestedTranslation(translations, keyPath) {
  const keys = keyPath.split('.');
  let result = translations;
  
  for (const key of keys) {
    if (result && result[key] !== undefined) {
      result = result[key];
    } else {
      return null;
    }
  }
  
  return typeof result === 'string' ? result : null;
}

/**
 * Register a listener for language changes
 * @param {Function} callback - Callback function that receives the new language code
 */
function onLanguageChange(callback) {
  if (typeof callback === 'function') {
    languageChangeListeners.push(callback);
  }
}

/**
 * Notify all registered listeners about a language change
 * @param {string} language - New language code
 */
function notifyLanguageChange(language) {
  languageChangeListeners.forEach(callback => {
    try {
      callback(language);
    } catch (error) {
      console.error('Error in language change listener:', error);
    }
  });
}

/**
 * Translate a specific key programmatically
 * @param {string} key - Translation key (e.g., "navigation.home")
 * @param {Object} params - Optional parameters to substitute in the translation
 * @returns {string} - Translated text
 */
function t(key, params = {}) {
  const currentTranslations = translations[currentLanguage] || {};
  let translation = getNestedTranslation(currentTranslations, key);
  
  // Fall back to default language if translation not found
  if (!translation && currentLanguage !== DEFAULT_LANGUAGE) {
    const defaultTranslations = translations[DEFAULT_LANGUAGE] || {};
    translation = getNestedTranslation(defaultTranslations, key);
  }
  
  // Fall back to the key itself if no translation found
  if (!translation) {
    return key;
  }
  
  // Replace parameters in the translation
  for (const [param, value] of Object.entries(params)) {
    translation = translation.replace(`{${param}}`, value);
  }
  
  return translation;
}

/**
 * Format dates on the page according to the locale
 * @param {string} language - Current language code
 */
function formatDatesForLocale(language) {
  // Convert language code to locale (you can expand this mapping as needed)
  const localeMap = {
    'en': 'en-US',
    'es': 'es-ES',
    'fr': 'fr-FR',
    'de': 'de-DE',
    'ja': 'ja-JP',
    'ru': 'ru-RU',
    'ar': 'ar-SA',
    'he': 'he-IL'
  };
  
  const locale = localeMap[language] || 'en-US';
  
  // Find all elements with date info that need to be formatted
  document.querySelectorAll('[data-date]').forEach(element => {
    try {
      // Get the timestamp from the data attribute
      const timestamp = element.getAttribute('data-date');
      const date = new Date(parseInt(timestamp, 10) || timestamp);
      
      // Skip invalid dates
      if (isNaN(date.getTime())) return;
      
      // Get formatting options if specified
      let options = {};
      if (element.hasAttribute('data-date-format')) {
        try {
          options = JSON.parse(element.getAttribute('data-date-format'));
        } catch (e) {
          console.warn('Invalid date format options:', e);
        }
      } else {
        // Default options if none specified
        options = { year: 'numeric', month: 'long', day: 'numeric' };
      }
      
      // Format the date according to the locale
      element.textContent = new Intl.DateTimeFormat(locale, options).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
    }
  });
}

/**
 * Update currency display based on the selected language/region
 * @param {string} language - Current language code
 */
function updateCurrencyDisplay(language) {
  // Map languages to currency codes and locales
  const currencyMap = {
    'en': { code: 'USD', locale: 'en-US' },
    'es': { code: 'EUR', locale: 'es-ES' },
    'fr': { code: 'EUR', locale: 'fr-FR' },
    'de': { code: 'EUR', locale: 'de-DE' },
    'ja': { code: 'JPY', locale: 'ja-JP' },
    'ru': { code: 'RUB', locale: 'ru-RU' },
    'ar': { code: 'SAR', locale: 'ar-SA' },
    'he': { code: 'ILS', locale: 'he-IL' }
  };
  
  // Get currency info for the current language
  const currencyInfo = currencyMap[language] || currencyMap.en;
  
  // Find all elements with price info that need to be formatted
  document.querySelectorAll('[data-price]').forEach(element => {
    try {
      // Get the price value
      const priceValue = parseFloat(element.getAttribute('data-price'));
      
      // Skip invalid prices
      if (isNaN(priceValue)) return;
      
      // Get the original currency if specified
      const origCurrency = element.getAttribute('data-currency') || 'USD';
      
      // TODO: In a real app, you would convert the price based on exchange rates
      // For now, we'll just format the price in the target currency
      
      // Format the price according to the locale and currency
      const formatter = new Intl.NumberFormat(currencyInfo.locale, {
        style: 'currency',
        currency: currencyInfo.code
      });
      
      element.textContent = formatter.format(priceValue);
    } catch (error) {
      console.error('Error formatting price:', error);
    }
  });
  
  // Update currency selection in footer if it exists
  const currencySelect = document.querySelector('select[name="currency"]');
  if (currencySelect) {
    const currencyOption = currencySelect.querySelector(`option[value="${currencyInfo.code.toLowerCase()}"]`);
    if (currencyOption) {
      currencyOption.selected = true;
    }
  }
}

// Export the public API
export default {
  init,
  setLanguage,
  t,
  onLanguageChange,
  get currentLanguage() {
    return currentLanguage;
  },
  get supportedLanguages() {
    return { ...SUPPORTED_LANGUAGES };
  }
};