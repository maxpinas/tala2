/**
 * Storage Module - Enige publieke API voor data opslag
 * 
 * ABSOLUTE REGEL: Dit is het enige toegangspunt voor opslag in de hele app.
 * 
 * Elke andere manier van opslag is een architectuurfout:
 * - Geen directe AsyncStorage imports buiten deze map
 * - Geen directe SecureStore imports buiten deze map
 * - Geen directe crypto imports buiten deze map
 * 
 * Runtime selectie:
 * - Expo Go → storage.expo.ts (plaintext, voor UI/UX tests)
 * - Dev build / Productie → storage.secure.ts (encrypted)
 */

import Constants from 'expo-constants';

// Storage keys - gebruik deze constanten in de hele app
export const STORAGE_KEYS = {
  PROFILE: 'profile',
  EXTENDED_PROFILE: 'extended_profile',
  CONTEXTS: 'contexts',
  CUSTOM_PARTNERS: 'custom_partners',
  QUICK_RESPONSES: 'quick_responses',
  GALLERY: 'gallery',
  HISTORY: 'history',
  CATEGORIES: 'categories',
  ONBOARDED: 'onboarded',
  CURRENT_CONTEXT: 'current_context',
  CURRENT_PARTNER: 'current_partner',
  APP_MODE: 'app_mode',
  MODE_REMEMBER: 'mode_remember',
  USER_PRESETS: 'user_presets',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

// Detect runtime environment
const isExpoGo = Constants.appOwnership === 'expo';

// Import the correct implementation based on environment
// In Expo Go, we only import the plaintext storage to avoid native module errors
// In dev build / production, we use encrypted storage
import { storage as expoStorage } from './storage.expo';

// For secure storage, we conditionally require to avoid loading native modules in Expo Go
// The ternary ensures the secure module is only evaluated in non-Expo environments
const storageImpl = isExpoGo 
  ? expoStorage 
  : require('./storage.secure').storage;

// Log which storage is being used (only in dev)
if (__DEV__) {
  console.log(`[storage] Using ${isExpoGo ? 'EXPO (plaintext)' : 'SECURE (encrypted)'} storage`);
}

/**
 * Public Storage API
 * 
 * Gebruik alleen deze methodes in de hele app:
 * - storage.setItem(key, value)
 * - storage.getItem(key)
 * - storage.removeItem(key)
 */
export const storage = {
  /**
   * Save a value to storage
   */
  setItem: async (key: string, value: any): Promise<boolean> => {
    return storageImpl.setItem(key, value);
  },

  /**
   * Get a value from storage
   */
  getItem: async <T = any>(key: string): Promise<T | null> => {
    return storageImpl.getItem(key) as Promise<T | null>;
  },

  /**
   * Remove a value from storage
   */
  removeItem: async (key: string): Promise<boolean> => {
    return storageImpl.removeItem(key);
  },

  /**
   * Get multiple values at once
   */
  multiGet: async <T = any>(keys: string[]): Promise<Record<string, T | null>> => {
    return storageImpl.multiGet(keys) as Promise<Record<string, T | null>>;
  },

  /**
   * Set multiple values at once
   */
  multiSet: async (items: Record<string, any>): Promise<boolean> => {
    return storageImpl.multiSet(items);
  },

  /**
   * Remove multiple values at once
   */
  multiRemove: async (keys: string[]): Promise<boolean> => {
    return storageImpl.multiRemove(keys);
  },

  /**
   * Get all storage keys (without prefix)
   */
  getAllKeys: async (): Promise<string[]> => {
    return storageImpl.getAllKeys();
  },

  /**
   * Clear all app data
   */
  clear: async (): Promise<boolean> => {
    return storageImpl.clear();
  },

  /**
   * Check if we're using secure storage
   */
  isSecure: (): boolean => {
    return !isExpoGo;
  },

  /**
   * Get storage type for debugging
   */
  getStorageType: (): 'expo' | 'secure' => {
    return isExpoGo ? 'expo' : 'secure';
  },
};

// Convenience functions that match the old API for easier migration
// These will be removed after full migration
export const saveData = storage.setItem;
export const loadData = storage.getItem;
export const clearAllData = storage.clear;

// Specific save functions (for backwards compatibility during migration)
export const saveProfile = (profile: any) => storage.setItem(STORAGE_KEYS.PROFILE, profile);
export const saveExtendedProfile = (profile: any) => storage.setItem(STORAGE_KEYS.EXTENDED_PROFILE, profile);
export const saveContexts = (contexts: any) => storage.setItem(STORAGE_KEYS.CONTEXTS, contexts);
export const saveCustomPartners = (partners: any) => storage.setItem(STORAGE_KEYS.CUSTOM_PARTNERS, partners);
export const saveQuickResponses = (responses: any) => storage.setItem(STORAGE_KEYS.QUICK_RESPONSES, responses);
export const saveGallery = (gallery: any) => storage.setItem(STORAGE_KEYS.GALLERY, gallery);
export const saveHistory = (history: any) => storage.setItem(STORAGE_KEYS.HISTORY, history);
export const saveCategories = (categories: any) => storage.setItem(STORAGE_KEYS.CATEGORIES, categories);
export const saveOnboarded = (onboarded: any) => storage.setItem(STORAGE_KEYS.ONBOARDED, onboarded);
export const saveCurrentContext = (context: any) => storage.setItem(STORAGE_KEYS.CURRENT_CONTEXT, context);
export const saveCurrentPartner = (partner: any) => storage.setItem(STORAGE_KEYS.CURRENT_PARTNER, partner);
export const saveAppMode = (mode: any) => storage.setItem(STORAGE_KEYS.APP_MODE, mode);
export const saveModeRemember = (remember: any) => storage.setItem(STORAGE_KEYS.MODE_REMEMBER, remember);
export const saveUserPresets = (presets: any) => storage.setItem(STORAGE_KEYS.USER_PRESETS, presets);

// Specific load functions (for backwards compatibility during migration)
export const loadProfile = (defaultValue?: any) => storage.getItem(STORAGE_KEYS.PROFILE).then(v => v ?? defaultValue);
export const loadExtendedProfile = (defaultValue?: any) => storage.getItem(STORAGE_KEYS.EXTENDED_PROFILE).then(v => v ?? defaultValue);
export const loadContexts = (defaultValue?: any) => storage.getItem(STORAGE_KEYS.CONTEXTS).then(v => v ?? defaultValue);
export const loadCustomPartners = (defaultValue?: any) => storage.getItem(STORAGE_KEYS.CUSTOM_PARTNERS).then(v => v ?? defaultValue);
export const loadQuickResponses = (defaultValue?: any) => storage.getItem(STORAGE_KEYS.QUICK_RESPONSES).then(v => v ?? defaultValue);
export const loadGallery = (defaultValue?: any) => storage.getItem(STORAGE_KEYS.GALLERY).then(v => v ?? defaultValue);
export const loadHistory = (defaultValue?: any) => storage.getItem(STORAGE_KEYS.HISTORY).then(v => v ?? defaultValue);
export const loadCategories = (defaultValue?: any) => storage.getItem(STORAGE_KEYS.CATEGORIES).then(v => v ?? defaultValue);
export const loadOnboarded = () => storage.getItem(STORAGE_KEYS.ONBOARDED).then(v => v ?? false);
export const loadCurrentContext = (defaultValue?: any) => storage.getItem(STORAGE_KEYS.CURRENT_CONTEXT).then(v => v ?? defaultValue);
export const loadCurrentPartner = (defaultValue?: any) => storage.getItem(STORAGE_KEYS.CURRENT_PARTNER).then(v => v ?? defaultValue);
export const loadAppMode = () => storage.getItem(STORAGE_KEYS.APP_MODE);
export const loadModeRemember = () => storage.getItem(STORAGE_KEYS.MODE_REMEMBER).then(v => v ?? false);
export const loadUserPresets = (defaultValue?: any) => storage.getItem(STORAGE_KEYS.USER_PRESETS).then(v => v ?? defaultValue);

// Load all data at once
export const loadAllData = async (defaults: Record<string, any> = {}) => {
  const keys = [
    STORAGE_KEYS.PROFILE,
    STORAGE_KEYS.EXTENDED_PROFILE,
    STORAGE_KEYS.CONTEXTS,
    STORAGE_KEYS.CUSTOM_PARTNERS,
    STORAGE_KEYS.QUICK_RESPONSES,
    STORAGE_KEYS.GALLERY,
    STORAGE_KEYS.HISTORY,
    STORAGE_KEYS.CATEGORIES,
    STORAGE_KEYS.ONBOARDED,
    STORAGE_KEYS.CURRENT_CONTEXT,
    STORAGE_KEYS.CURRENT_PARTNER,
  ];

  const data = await storage.multiGet(keys);

  return {
    profile: data[STORAGE_KEYS.PROFILE] ?? defaults.profile,
    extendedProfile: data[STORAGE_KEYS.EXTENDED_PROFILE] ?? defaults.extendedProfile,
    contexts: data[STORAGE_KEYS.CONTEXTS] ?? defaults.contexts,
    customPartners: data[STORAGE_KEYS.CUSTOM_PARTNERS] ?? defaults.customPartners,
    quickResponses: data[STORAGE_KEYS.QUICK_RESPONSES] ?? defaults.quickResponses,
    gallery: data[STORAGE_KEYS.GALLERY] ?? defaults.gallery,
    history: data[STORAGE_KEYS.HISTORY] ?? defaults.history,
    categories: data[STORAGE_KEYS.CATEGORIES] ?? defaults.categories,
    onboarded: data[STORAGE_KEYS.ONBOARDED] ?? false,
    currentContext: data[STORAGE_KEYS.CURRENT_CONTEXT] ?? defaults.currentContext,
    currentPartner: data[STORAGE_KEYS.CURRENT_PARTNER] ?? defaults.currentPartner,
  };
};

export default storage;
