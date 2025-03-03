import { useState, memo, useEffect } from 'react';
import { ArrowRight, Moon, Sun } from 'lucide-react';
import { Quote } from './data/quotes';
import { Modal } from './components/Modal';
import { MasonryLayout } from './components/MasonryLayout';
import { SortControl } from './components/SortControl';
import { useTheme } from './utils/useTheme';
import { useQuotes, SortDirection } from './utils/useQuotes';
import { useResponsive } from './utils/useResponsive';

// Memoize the quote card component for better performance
const QuoteCard = memo(({ quote, onClick }: { quote: Quote; onClick: () => void }) => (
  <div 
    className="p-4 sm:p-5 border border-gray-200 dark:border-gray-700 rounded-lg card-bg shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_28px_-5px_rgba(79,70,229,0.15)] dark:hover:shadow-[0_12px_28px_-5px_rgba(129,140,248,0.2)] hover:border-indigo-300 dark:hover:border-indigo-500 theme-transition cursor-pointer transform hover:-translate-y-1 active:scale-[0.98] flex flex-col bg-white dark:bg-gray-800"
    onClick={onClick}
  >
    <p className="text-sm sm:text-base text-gray-800 dark:text-gray-100 mb-3 sm:mb-4 flex-grow line-clamp-6 sm:line-clamp-6">{quote.text}</p>
    <div className="flex justify-between items-start mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
      <div className="flex items-start gap-4 overflow-hidden">
        {quote.image && (
          <div className="flex-shrink-0">
            <img 
              src={quote.image} 
              alt={quote.author} 
              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md border border-gray-200 dark:border-gray-700 shadow-sm"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <span className="text-sm sm:text-base text-indigo-600 dark:text-indigo-400 font-medium truncate block">
            {quote.author}
          </span>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
            {quote.bio}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
            {quote.year}
          </p>
        </div>
      </div>
      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400 dark:text-indigo-300 flex-shrink-0 mt-2" />
    </div>
  </div>
));

// Helper function to create a pseudo-identifier for a quote
const createQuoteIdentifier = (quote: Quote): string => 
  `${quote.author}:${quote.text.substring(0, 50)}`;

function App() {
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const { darkMode, toggleDarkMode } = useTheme();
  const { quotes, loading, error, currentQuote, isCarouselFading, sortDirection, sortQuotes, nextQuote, prevQuote } = useQuotes();
  const { columns } = useResponsive();
  
  // No keyboard navigation on main page

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex items-center justify-center">
        <p className="text-xl text-gray-600 dark:text-gray-400">Loading quotes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 dark:text-red-400 mb-4">Unable to load quotes</p>
          <p className="text-gray-600 dark:text-gray-400">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 p-3 sm:p-4 md:p-6 theme-transition">
      <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Concerns about AI</h1>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-md hover:shadow-lg hover:scale-105 relative w-9 h-9 flex items-center justify-center"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <Sun className="h-5 w-5 theme-icon icon-sun" />
            <Moon className="h-5 w-5 theme-icon icon-moon" />
          </button>
        </div>
      </header>
      
      {/* Featured quote container with min-height to prevent layout shifts */}
      <div className="min-h-[450px] sm:min-h-[420px] md:min-h-[400px] relative">
        {currentQuote && (
          <div className="max-w-4xl mx-auto mb-8 sm:mb-12 px-0 sm:px-4 relative carousel-container">
            <div 
              className={`bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 
                transition-all duration-300 ease-in-out theme-transition hover:shadow-xl cursor-pointer 
                active:scale-[0.995] transform hover:border-indigo-300 dark:hover:border-indigo-500 
                ${isCarouselFading ? 'opacity-0 translate-x-6' : 'opacity-100 translate-x-0'}`}
              onClick={() => setSelectedQuote(currentQuote)}
              aria-label="Click to see full quote details"
            >
              {/* Author header */}
              <div className="pb-4 border-b border-gray-200 dark:border-gray-700 mb-4 relative">
                <div className="absolute top-0 right-0 mt-0 mr-0 text-indigo-400 dark:text-indigo-500 opacity-70">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M15 3h6v6M14 10l7-7M9 21H3v-6M10 14l-7 7"/>
                  </svg>
                </div>
                <div className="flex items-start gap-6">
                  {currentQuote.image && (
                    <div className="flex-shrink-0">
                      <img 
                        src={currentQuote.image} 
                        alt={currentQuote.author} 
                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md shadow-md border border-gray-200 dark:border-gray-700"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h2 className="text-lg sm:text-xl md:text-2xl text-indigo-600 dark:text-indigo-400 font-medium">
                      {currentQuote.author}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 pr-6 line-clamp-3">
                      {currentQuote.bio}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                      {currentQuote.year}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Quote text */}
              <div className="max-h-[40vh] overflow-y-auto mb-5 custom-scrollbar">
                <p className="text-lg sm:text-xl text-gray-800 dark:text-gray-100">
                  {currentQuote.text}
                </p>
              </div>
              
              {/* Footer with source link */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <a 
                  href={currentQuote.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Source
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                    <path d="M7 7l9.2 9.2M17 7v10H7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-0 sm:px-2">
        <div className="flex justify-between items-center mb-4 mx-1 sm:mx-0">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">All Quotes</h2>
          <SortControl sortDirection={sortDirection} onSort={sortQuotes} />
        </div>
        <MasonryLayout columns={columns} gap={16}>
          {quotes.map((quote, index) => (
            <QuoteCard 
              key={index}
              quote={quote}
              onClick={() => setSelectedQuote(quote)}
            />
          ))}
        </MasonryLayout>
      </div>

      <Modal 
        quote={selectedQuote} 
        onClose={() => setSelectedQuote(null)}
        onPrevious={() => {
          if (selectedQuote) {
            // Find the current quote's index in the sorted array
            const currentIndex = quotes.findIndex(q => q === selectedQuote);
            
            // Get the previous quote (with wrap-around)
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : quotes.length - 1;
            setSelectedQuote(quotes[prevIndex]);
          }
        }}
        onNext={() => {
          if (selectedQuote) {
            // Find the current quote's index in the sorted array
            const currentIndex = quotes.findIndex(q => q === selectedQuote);
            
            // Get the next quote (with wrap-around)
            const nextIndex = currentIndex < quotes.length - 1 ? currentIndex + 1 : 0;
            setSelectedQuote(quotes[nextIndex]);
          }
        }}
      />
    </div>
  );
}

export default App;
