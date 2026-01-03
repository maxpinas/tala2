// i18n - Internationalization
// Simpele i18n implementatie voor Tala

import nl from './nl.json';

const translations = {
  nl,
};

let currentLocale = 'nl';

/**
 * Set the current locale
 * @param {string} locale - The locale code (e.g., 'nl', 'en')
 */
export const setLocale = (locale) => {
  if (translations[locale]) {
    currentLocale = locale;
  } else {
    console.warn(`Locale '${locale}' not found, falling back to 'nl'`);
    currentLocale = 'nl';
  }
};

/**
 * Get the current locale
 * @returns {string} The current locale code
 */
export const getLocale = () => currentLocale;

/**
 * Translate a key to the current locale
 * @param {string} key - The translation key (e.g., 'common.yes', 'navigation.praat')
 * @param {object} params - Optional parameters for interpolation
 * @returns {string} The translated string
 */
export const t = (key, params = {}) => {
  const keys = key.split('.');
  let value = translations[currentLocale];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.warn(`Translation key '${key}' not found for locale '${currentLocale}'`);
      return key;
    }
  }

  if (typeof value !== 'string') {
    console.warn(`Translation key '${key}' is not a string`);
    return key;
  }

  // Simple interpolation: replace {param} with params.param
  return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
    return params[paramKey] !== undefined ? params[paramKey] : match;
  });
};

/**
 * Get all translations for the current locale
 * @returns {object} The translations object
 */
export const getTranslations = () => translations[currentLocale];

export default { t, setLocale, getLocale, getTranslations };
