import { useState, useEffect } from 'react';
import { ArrowRight, Moon, Sun } from 'lucide-react';
import { loadQuotes, Quote } from './data/quotes';
import { Modal } from './components/Modal';
import { MasonryLayout } from './components/MasonryLayout';

function App() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState(3);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [isCarouselFading, setIsCarouselFading] = useState(false);
  // Check if localStorage is available and working
  const isStorageAvailable = (type: 'localStorage' | 'sessionStorage'): boolean => {
    try {
      const storage = window[type];
      const testKey = '__storage_test__';
      storage.setItem(testKey, testKey);
      storage.removeItem(testKey);
      return true;
    } catch (e) {
      console.error(`${type} is not available:`, e);
      return false;
    }
  };

  // Use localStorage if available, otherwise fallback to sessionStorage or memory
  const getStorageItem = (key: string): string | null => {
    try {
      if (isStorageAvailable('localStorage')) {
        const value = localStorage.getItem(key);
        console.log(`Retrieved from localStorage - ${key}:`, value);
        return value;
      } else if (isStorageAvailable('sessionStorage')) {
        const value = sessionStorage.getItem(key);
        console.log(`Retrieved from sessionStorage - ${key}:`, value);
        return value;
      }
    } catch (error) {
      console.error('Error getting storage item:', error);
    }
    return null;
  };

  // Set item in available storage
  const setStorageItem = (key: string, value: string): void => {
    try {
      if (isStorageAvailable('localStorage')) {
        localStorage.setItem(key, value);
        console.log(`Saved to localStorage - ${key}:`, value);
      } else if (isStorageAvailable('sessionStorage')) {
        sessionStorage.setItem(key, value);
        console.log(`Saved to sessionStorage - ${key}:`, value);
      } else {
        console.warn('No storage available, value not saved');
      }
    } catch (error) {
      console.error('Error setting storage item:', error);
    }
  };

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
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
      console.log('Using system preference:', systemPreference);
      return systemPreference;
    }
  });

  // Apply dark mode class to document with transition
  useEffect(() => {
    // Add transitioning class to enable overlay effect
    document.documentElement.classList.add('theme-transitioning');
    
    // Apply dark mode class
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Remove transitioning class after animation completes
    const transitionTimeout = setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 400); // Slightly longer than the CSS transition
    
    return () => clearTimeout(transitionTimeout);
  }, [darkMode]);

  // Listen for system preference changes if user hasn't set a preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually set a preference
      const themePreference = getStorageItem('themePreference');
      if (themePreference !== 'dark' && themePreference !== 'light') {
        console.log('System preference changed, updating to:', e.matches);
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

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const loadedQuotes = await loadQuotes();
        setQuotes(loadedQuotes);
        setLoading(false);
        
        // Debug log to check image URLs
        console.log('Quotes with images:', loadedQuotes.map(q => ({
          author: q.author,
          imageUrl: q.image
        })));
      } catch (error) {
        console.error('Error loading quotes:', error);
        setLoading(false);
      }
    };
    
    fetchQuotes();
  }, []);

  useEffect(() => {
    // Function to update columns based on window width
    const updateColumns = () => {
      if (window.innerWidth < 768) {
        setColumns(1);
      } else if (window.innerWidth < 1024) {
        setColumns(2);
      } else {
        setColumns(3);
      }
    };

    // Set initial value
    updateColumns();

    // Add event listener
    window.addEventListener('resize', updateColumns);

    // Clean up
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  useEffect(() => {
    if (quotes.length === 0) return;
    
    const transitionQuote = () => {
      setIsCarouselFading(true);
      setTimeout(() => {
        setCurrentCarouselIndex((prev) => (prev + 1) % quotes.length);
        setIsCarouselFading(false);
      }, 500);
    };

    const timer = setInterval(transitionQuote, 9000);
    return () => clearInterval(timer);
  }, [quotes.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex items-center justify-center">
        <p className="text-xl text-gray-600 dark:text-gray-400">Loading quotes...</p>
      </div>
    );
  }

  const renderQuoteCard = (quote: Quote, index: number) => (
    <div 
      key={index} 
      className="p-4 sm:p-5 border border-gray-200 dark:border-gray-700 rounded-lg card-bg shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_28px_-5px_rgba(79,70,229,0.15)] dark:hover:shadow-[0_12px_28px_-5px_rgba(129,140,248,0.2)] hover:border-indigo-300 dark:hover:border-indigo-500 theme-transition cursor-pointer transform hover:-translate-y-1 active:scale-[0.98] flex flex-col bg-white dark:bg-gray-800"
      onClick={() => setSelectedQuote(quote)}
    >
      <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 mb-3 sm:mb-4 flex-grow line-clamp-6 sm:line-clamp-6">{quote.text}</p>
      <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 overflow-hidden">
          {quote.image && (
            <div className="flex-shrink-0">
              <img 
                src={quote.image} 
                alt={quote.author} 
                className="w-6 h-6 sm:w-7 sm:h-7 object-cover rounded-full border border-indigo-200 dark:border-indigo-700 shadow-sm"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <span className="text-sm sm:text-base text-indigo-600 dark:text-indigo-400 font-medium truncate block">
              {quote.author} <span className="inline-block">({quote.year})</span>
            </span>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400 dark:text-indigo-300 flex-shrink-0" />
      </div>
    </div>
  );

  const currentQuote = quotes[currentCarouselIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 p-3 sm:p-4 md:p-6 theme-transition">
      {/* Theme transition overlay */}
      <div className="theme-transition-container"></div>
      <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Concerns about AI</h1>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-md hover:shadow-lg theme-transition hover:scale-105 relative w-9 h-9 flex items-center justify-center"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <Sun className="h-5 w-5 theme-icon icon-sun" />
            <Moon className="h-5 w-5 theme-icon icon-moon" />
          </button>
        </div>
      </header>
      
      {currentQuote && (
        <div className="max-w-4xl mx-auto mb-8 sm:mb-12 px-0 sm:px-4">
          <div 
            className={`bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-opacity duration-500 theme-transition ${
              isCarouselFading ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <div className="max-h-[40vh] overflow-y-auto mb-4 sm:mb-6 custom-scrollbar">
              <p className="text-lg sm:text-xl text-gray-800 dark:text-gray-200">{currentQuote.text}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 sm:gap-0">
              <div className="flex items-start sm:items-center gap-3">
                {currentQuote.image && (
                  <div className="flex-shrink-0">
                    <img 
                      src={currentQuote.image} 
                      alt={currentQuote.author} 
                      className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-md shadow-md"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div>
                  <p className="text-base sm:text-lg text-indigo-600 dark:text-indigo-400 font-medium">{currentQuote.author}</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{currentQuote.bio}</p>
                </div>
              </div>
              <a 
                href={currentQuote.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-500 dark:text-blue-400 hover:underline mt-2 sm:mt-0 sm:ml-4 self-end"
              >
                Source
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-0 sm:px-2">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 ml-1 sm:ml-0">All Quotes</h2>
        <MasonryLayout columns={columns} gap={16}>
          {quotes.map((quote, index) => renderQuoteCard(quote, index))}
        </MasonryLayout>
      </div>

      <Modal quote={selectedQuote} onClose={() => setSelectedQuote(null)} />
    </div>
  );
}

export default App;
