// Check if localStorage or sessionStorage is available and working
export const isStorageAvailable = (type: 'localStorage' | 'sessionStorage'): boolean => {
  try {
    const storage = window[type];
    const testKey = '__storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// Use localStorage if available, otherwise fallback to sessionStorage or memory
export const getStorageItem = (key: string): string | null => {
  try {
    if (isStorageAvailable('localStorage')) {
      return localStorage.getItem(key);
    } else if (isStorageAvailable('sessionStorage')) {
      return sessionStorage.getItem(key);
    }
  } catch (error) {
    console.error('Error getting storage item:', error);
  }
  return null;
};

// Set item in available storage
export const setStorageItem = (key: string, value: string): void => {
  try {
    if (isStorageAvailable('localStorage')) {
      localStorage.setItem(key, value);
    } else if (isStorageAvailable('sessionStorage')) {
      sessionStorage.setItem(key, value);
    }
  } catch (error) {
    console.error('Error setting storage item:', error);
  }
};