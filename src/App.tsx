import { useState, memo, useEffect } from 'react';
import { ArrowRight, Moon, Sun } from 'lucide-react';
import { Quote } from './data/quotes';
import { Modal } from './components/Modal';
import { MasonryLayout } from './components/MasonryLayout';
import { SortControl } from './components/SortControl';
import { GroupSelector } from './components/GroupSelector';
import { useTheme } from './utils/useTheme';
import { useQuotes, SortDirection } from './utils/useQuotes';
import { useResponsive } from './utils/useResponsive';

// Memoize the quote card component for better performance
const QuoteCard = memo(({ quote, onClick }: { quote: Quote; onClick: () => void }) => (
  <div 
    className="p-4 sm:p-5 border border-gray-200 dark:border-gray-700 rounded-lg card-bg shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_28px_-5px_rgba(79,70,229,0.15)] dark:hover:shadow-[0_12px_28px_-5px_rgba(129,140,248,0.2)] hover:border-indigo-300 dark:hover:border-indigo-500 cursor-pointer transform hover:-translate-y-1 active:scale-[0.98] flex flex-col bg-white dark:bg-gray-800"
    onClick={onClick}
  >
    <p className="text-sm sm:text-base text-gray-800 dark:text-gray-100 mb-3 sm:mb-4 flex-grow">{quote.text}</p>
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
          <span className="text-sm sm:text-base text-indigo-600 dark:text-indigo-400 font-medium block">
            {quote.author}
          </span>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
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
  const { 
    quotes, 
    loading, 
    error, 
    sortDirection, 
    sortQuotes, 
    availableGroups,
    selectedGroup,
    filterByGroup
  } = useQuotes();
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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 p-3 sm:p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-4 sm:mb-6 px-3 sm:px-2">
          {/* Top row: Title and dark mode toggle */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Concerns about AI</h1>
            <div className="flex items-center">
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-md hover:shadow-lg hover:scale-105 relative w-9 h-9 flex items-center justify-center"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                <Sun className="h-5 w-5 theme-icon icon-sun" />
                <Moon className="h-5 w-5 theme-icon icon-moon" />
              </button>
            </div>
          </div>
          
          {/* Controls row - different layout on mobile vs desktop */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Filter by group - first on mobile, left on desktop */}
            <div className="order-1 sm:order-1">
              <GroupSelector 
                groups={availableGroups} 
                selectedGroup={selectedGroup} 
                onGroupChange={filterByGroup} 
              />
            </div>
            
            {/* Sort controls - second on mobile, right on desktop */}
            <div className="order-2 sm:order-2 mt-2 sm:mt-0">
              <SortControl sortDirection={sortDirection} onSort={sortQuotes} />
            </div>
          </div>
        </header>

        <div className="px-0 sm:px-2">
        
        {selectedGroup !== 'All' ? (
          // When a specific group is selected, show quotes in masonry layout
          <div>
            <MasonryLayout 
              columns={columns} 
              gap={16} 
              sortDirection={sortDirection} 
              quotes={quotes}
            >
              {quotes.map((quote, index) => (
                <QuoteCard 
                  key={index}
                  quote={quote}
                  onClick={() => setSelectedQuote(quote)}
                />
              ))}
            </MasonryLayout>
          </div>
        ) : (
          // When showing all quotes, organize by groups
          <div>
            
            {/* Group the quotes by their group property */}
            {(() => {
              // Get all unique groups from normalized quotes
              const groupMap = new Map<string, Quote[]>();
              
              // Organize quotes by their group
              quotes.forEach(quote => {
                const group = quote.group || 'Uncategorized';
                if (!groupMap.has(group)) {
                  groupMap.set(group, []);
                }
                groupMap.get(group)?.push(quote);
              });
              
              // Get sorted group names
              const sortedGroups = Array.from(groupMap.keys()).sort();
              
              return sortedGroups.map(group => {
                // Get quotes for this group
                const groupQuotes = groupMap.get(group) || [];
                
                return (
                  <div key={group} className="mb-12">
                    <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                      <h3 className="text-xl text-indigo-600 dark:text-indigo-400 font-medium pb-2">
                        {group}
                      </h3>
                    </div>
                    <MasonryLayout 
                      columns={columns} 
                      gap={16} 
                      sortDirection={sortDirection} 
                      quotes={groupQuotes}
                    >
                      {groupQuotes.map((quote, index) => (
                        <QuoteCard 
                          key={index}
                          quote={quote}
                          onClick={() => setSelectedQuote(quote)}
                        />
                      ))}
                    </MasonryLayout>
                  </div>
                );
              });
            })()}
          </div>
        )}
        </div>
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
