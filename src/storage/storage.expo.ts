/**
 * storage.expo.ts
 * Plaintext storage implementatie voor Expo Go
 * 
 * Eigenschappen:
 * - Plaintext opslag (geen encryptie)
 * - AsyncStorage backend
 * - Geen SecureStore of native crypto
 * - Alleen gebruikt in Expo Go voor UI/UX tests
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StorageInterface {
  setItem: (key: string, value: any) => Promise<boolean>;
  getItem: <T = any>(key: string) => Promise<T | null>;
  removeItem: (key: string) => Promise<boolean>;
  multiGet: <T = any>(keys: string[]) => Promise<Record<string, T | null>>;
  multiSet: (items: Record<string, any>) => Promise<boolean>;
  multiRemove: (keys: string[]) => Promise<boolean>;
  getAllKeys: () => Promise<string[]>;
  clear: () => Promise<boolean>;
}

const PREFIX = '@tala_';

const prefixKey = (key: string): string => {
  return key.startsWith(PREFIX) ? key : `${PREFIX}${key}`;
};

const stripPrefix = (key: string): string => {
  return key.startsWith(PREFIX) ? key.slice(PREFIX.length) : key;
};

export const storage: StorageInterface = {
  async setItem(key: string, value: any): Promise<boolean> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(prefixKey(key), jsonValue);
      return true;
    } catch (error) {
      console.error(`[storage.expo] Error saving ${key}:`, error);
      return false;
    }
  },

  async getItem<T = any>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(prefixKey(key));
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`[storage.expo] Error loading ${key}:`, error);
      return null;
    }
  },

  async removeItem(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(prefixKey(key));
      return true;
    } catch (error) {
      console.error(`[storage.expo] Error removing ${key}:`, error);
      return false;
    }
  },

  async multiGet<T = any>(keys: string[]): Promise<Record<string, T | null>> {
    try {
      const prefixedKeys = keys.map(prefixKey);
      const pairs = await AsyncStorage.multiGet(prefixedKeys);
      const result: Record<string, T | null> = {};
      pairs.forEach(([prefixedKey, value]) => {
        const originalKey = stripPrefix(prefixedKey);
        result[originalKey] = value != null ? JSON.parse(value) : null;
      });
      return result;
    } catch (error) {
      console.error(`[storage.expo] Error in multiGet:`, error);
      return {};
    }
  },

  async multiSet(items: Record<string, any>): Promise<boolean> {
    try {
      const pairs: [string, string][] = Object.entries(items).map(([key, value]) => [
        prefixKey(key),
        JSON.stringify(value),
      ]);
      await AsyncStorage.multiSet(pairs);
      return true;
    } catch (error) {
      console.error(`[storage.expo] Error in multiSet:`, error);
      return false;
    }
  },

  async multiRemove(keys: string[]): Promise<boolean> {
    try {
      const prefixedKeys = keys.map(prefixKey);
      await AsyncStorage.multiRemove(prefixedKeys);
      return true;
    } catch (error) {
      console.error(`[storage.expo] Error in multiRemove:`, error);
      return false;
    }
  },

  async getAllKeys(): Promise<string[]> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      return allKeys
        .filter((k) => k.startsWith(PREFIX))
        .map(stripPrefix);
    } catch (error) {
      console.error(`[storage.expo] Error getting all keys:`, error);
      return [];
    }
  },

  async clear(): Promise<boolean> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const talaKeys = allKeys.filter((k) => k.startsWith(PREFIX));
      await AsyncStorage.multiRemove(talaKeys);
      return true;
    } catch (error) {
      console.error(`[storage.expo] Error clearing storage:`, error);
      return false;
    }
  },
};

export default storage;
