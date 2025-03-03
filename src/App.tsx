import { useState, memo } from 'react';
import { ArrowRight, Moon, Sun } from 'lucide-react';
import { Quote } from './data/quotes';
import { Modal } from './components/Modal';
import { MasonryLayout } from './components/MasonryLayout';
import { useTheme } from './utils/useTheme';
import { useQuotes } from './utils/useQuotes';
import { useResponsive } from './utils/useResponsive';

// Memoize the quote card component for better performance
const QuoteCard = memo(({ quote, onClick }: { quote: Quote; onClick: () => void }) => (
  <div 
    className="p-4 sm:p-5 border border-gray-200 dark:border-gray-700 rounded-lg card-bg shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_28px_-5px_rgba(79,70,229,0.15)] dark:hover:shadow-[0_12px_28px_-5px_rgba(129,140,248,0.2)] hover:border-indigo-300 dark:hover:border-indigo-500 theme-transition cursor-pointer transform hover:-translate-y-1 active:scale-[0.98] flex flex-col bg-white dark:bg-gray-800"
    onClick={onClick}
  >
    <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 mb-3 sm:mb-4 flex-grow line-clamp-6 sm:line-clamp-6">{quote.text}</p>
    <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 overflow-hidden">
        {quote.image && (
          <div className="flex-shrink-0">
            <img 
              src={quote.image} 
              alt={quote.author} 
              className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-md border border-gray-200 dark:border-gray-700 shadow-sm"
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
));

function App() {
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const { darkMode, toggleDarkMode } = useTheme();
  const { quotes, loading, error, currentQuote, isCarouselFading } = useQuotes();
  const { columns } = useResponsive();

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
      <div className="min-h-[350px] sm:min-h-[320px] md:min-h-[300px]">
        {currentQuote && (
          <div className="max-w-4xl mx-auto mb-8 sm:mb-12 px-0 sm:px-4">
          <div 
            className={`bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-opacity duration-500 theme-transition hover:shadow-xl cursor-pointer active:scale-[0.995] transform hover:border-indigo-300 dark:hover:border-indigo-500 ${
              isCarouselFading ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={() => setSelectedQuote(currentQuote)}
            aria-label="Click to see full quote details"
          >
            <div className="max-h-[40vh] overflow-y-auto mb-4 sm:mb-6 custom-scrollbar">
              <p className="text-lg sm:text-xl text-gray-800 dark:text-gray-200">{currentQuote.text}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-6 relative">
              <div className="absolute bottom-0 right-0 mb-1 mr-1 text-indigo-400 dark:text-indigo-500 opacity-70">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M15 3h6v6M14 10l7-7M9 21H3v-6M10 14l-7 7"/>
                </svg>
              </div>
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
                {currentQuote.image && (
                  <div className="flex-shrink-0">
                    <img 
                      src={currentQuote.image} 
                      alt={currentQuote.author} 
                      className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-md shadow-md border border-gray-200 dark:border-gray-700"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="flex flex-col justify-center">
                  <p className="text-base sm:text-lg md:text-xl text-indigo-600 dark:text-indigo-400 font-medium">{currentQuote.author}</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-3 max-w-md">{currentQuote.bio}</p>
                  <a 
                    href={currentQuote.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 dark:text-blue-400 hover:underline mt-2 inline-flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Source
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                      <path d="M7 7l9.2 9.2M17 7v10H7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-0 sm:px-2">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 ml-1 sm:ml-0">All Quotes</h2>
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

      <Modal quote={selectedQuote} onClose={() => setSelectedQuote(null)} />
    </div>
  );
}

export default App;
