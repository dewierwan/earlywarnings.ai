import { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem } from './storage';

export function useTheme() {
  // Initialize dark mode state based on user preference or system setting
  const [darkMode, setDarkMode] = useState(() => {
    // Check for user preference in storage
    const themePreference = getStorageItem('themePreference');
    
    if (themePreference === 'dark') {
      return true;
    } else if (themePreference === 'light') {
      return false;
    } else {
      // If no user preference, use system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  });

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Listen for system preference changes if user hasn't set a preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually set a preference
      const themePreference = getStorageItem('themePreference');
      if (themePreference !== 'dark' && themePreference !== 'light') {
        setDarkMode(e.matches);
      }
    };
    
    // Add listener for system preference changes
    mediaQuery.addEventListener('change', handleChange);
    
    // Clean up
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Handle theme toggle
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    
    // Store user preference
    setStorageItem('themePreference', newDarkMode ? 'dark' : 'light');
    
    // Update state
    setDarkMode(newDarkMode);
  };

  return { darkMode, toggleDarkMode };
}