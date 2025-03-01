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
      className="p-5 border border-gray-200 dark:border-gray-700 rounded-lg card-bg shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_28px_-5px_rgba(79,70,229,0.15)] dark:hover:shadow-[0_12px_28px_-5px_rgba(129,140,248,0.2)] hover:border-indigo-300 dark:hover:border-indigo-500 transition-transform duration-200 cursor-pointer transform hover:-translate-y-1 flex flex-col bg-white dark:bg-gray-800"
      onClick={() => setSelectedQuote(quote)}
    >
      <p className="text-gray-800 dark:text-gray-200 mb-4 flex-grow overflow-y-auto">{quote.text}</p>
      <div className="flex justify-between items-center mt-auto">
        <span className="text-indigo-600 dark:text-indigo-400 font-medium">
          {quote.author} ({quote.year})
        </span>
        <ArrowRight className="h-5 w-5 text-indigo-400 dark:text-indigo-300" />
      </div>
    </div>
  );

  const currentQuote = quotes[currentCarouselIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 p-6">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Concerns about AI</h1>
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-md hover:shadow-lg"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
      </header>
      
      {currentQuote && (
        <div className="max-w-4xl mx-auto mb-12">
          <div 
            className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-opacity duration-500 ${
              isCarouselFading ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <p className="text-xl text-gray-800 dark:text-gray-200 mb-6">{currentQuote.text}</p>
            <div className="flex justify-between items-end">
              <div className="flex">
                {currentQuote.image && (
                  <div className="mr-4 flex-shrink-0">
                    <img 
                      src={currentQuote.image} 
                      alt={currentQuote.author} 
                      className="w-16 h-16 object-cover rounded-md shadow-md"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div>
                  <p className="text-lg text-indigo-600 dark:text-indigo-400 font-medium">{currentQuote.author}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{currentQuote.bio}</p>
                </div>
              </div>
              <a 
                href={currentQuote.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-500 dark:text-blue-400 hover:underline ml-4"
              >
                Source
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <MasonryLayout columns={columns}>
          {quotes.map((quote, index) => renderQuoteCard(quote, index))}
        </MasonryLayout>
      </div>

      <Modal quote={selectedQuote} onClose={() => setSelectedQuote(null)} />
    </div>
  );
}

export default App;
