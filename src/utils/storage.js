import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  PROFILE: '@tala_profile',
  EXTENDED_PROFILE: '@tala_extended_profile',
  CONTEXTS: '@tala_contexts',
  CUSTOM_PARTNERS: '@tala_custom_partners',
  QUICK_RESPONSES: '@tala_quick_responses',
  GALLERY: '@tala_gallery',
  HISTORY: '@tala_history',
  CATEGORIES: '@tala_categories',
  ONBOARDED: '@tala_onboarded',
  CURRENT_CONTEXT: '@tala_current_context',
  CURRENT_PARTNER: '@tala_current_partner',
};

// Generic save function
export const saveData = async (key, data) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
    return false;
  }
};

// Generic load function
export const loadData = async (key, defaultValue = null) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    return defaultValue;
  }
};

// Specific save functions
export const saveProfile = (profile) => saveData(STORAGE_KEYS.PROFILE, profile);
export const saveExtendedProfile = (profile) => saveData(STORAGE_KEYS.EXTENDED_PROFILE, profile);
export const saveContexts = (contexts) => saveData(STORAGE_KEYS.CONTEXTS, contexts);
export const saveCustomPartners = (partners) => saveData(STORAGE_KEYS.CUSTOM_PARTNERS, partners);
export const saveQuickResponses = (responses) => saveData(STORAGE_KEYS.QUICK_RESPONSES, responses);
export const saveGallery = (gallery) => saveData(STORAGE_KEYS.GALLERY, gallery);
export const saveHistory = (history) => saveData(STORAGE_KEYS.HISTORY, history);
export const saveCategories = (categories) => saveData(STORAGE_KEYS.CATEGORIES, categories);
export const saveOnboarded = (onboarded) => saveData(STORAGE_KEYS.ONBOARDED, onboarded);
export const saveCurrentContext = (context) => saveData(STORAGE_KEYS.CURRENT_CONTEXT, context);
export const saveCurrentPartner = (partner) => saveData(STORAGE_KEYS.CURRENT_PARTNER, partner);

// Specific load functions
export const loadProfile = (defaultValue) => loadData(STORAGE_KEYS.PROFILE, defaultValue);
export const loadExtendedProfile = (defaultValue) => loadData(STORAGE_KEYS.EXTENDED_PROFILE, defaultValue);
export const loadContexts = (defaultValue) => loadData(STORAGE_KEYS.CONTEXTS, defaultValue);
export const loadCustomPartners = (defaultValue) => loadData(STORAGE_KEYS.CUSTOM_PARTNERS, defaultValue);
export const loadQuickResponses = (defaultValue) => loadData(STORAGE_KEYS.QUICK_RESPONSES, defaultValue);
export const loadGallery = (defaultValue) => loadData(STORAGE_KEYS.GALLERY, defaultValue);
export const loadHistory = (defaultValue) => loadData(STORAGE_KEYS.HISTORY, defaultValue);
export const loadCategories = (defaultValue) => loadData(STORAGE_KEYS.CATEGORIES, defaultValue);
export const loadOnboarded = () => loadData(STORAGE_KEYS.ONBOARDED, false);
export const loadCurrentContext = (defaultValue) => loadData(STORAGE_KEYS.CURRENT_CONTEXT, defaultValue);
export const loadCurrentPartner = (defaultValue) => loadData(STORAGE_KEYS.CURRENT_PARTNER, defaultValue);

// Load all app data at once
export const loadAllData = async (defaults = {}) => {
  try {
    const [
      profile,
      extendedProfile,
      contexts,
      customPartners,
      quickResponses,
      gallery,
      history,
      categories,
      onboarded,
      currentContext,
      currentPartner,
    ] = await Promise.all([
      loadProfile(defaults.profile),
      loadExtendedProfile(defaults.extendedProfile),
      loadContexts(defaults.contexts),
      loadCustomPartners(defaults.customPartners),
      loadQuickResponses(defaults.quickResponses),
      loadGallery(defaults.gallery),
      loadHistory(defaults.history),
      loadCategories(defaults.categories),
      loadOnboarded(),
      loadCurrentContext(defaults.currentContext),
      loadCurrentPartner(defaults.currentPartner),
    ]);

    return {
      profile,
      extendedProfile,
      contexts,
      customPartners,
      quickResponses,
      gallery,
      history,
      categories,
      onboarded,
      currentContext,
      currentPartner,
    };
  } catch (error) {
    console.error('Error loading all data:', error);
    return defaults;
  }
};

// Clear all app data (for reset functionality)
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

export { STORAGE_KEYS };
