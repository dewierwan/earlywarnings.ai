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
    className="p-4 sm:p-5 border border-border-light dark:border-dark-border rounded-lg card-bg shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_28px_-5px_rgba(74,105,189,0.15)] dark:hover:shadow-dark-hover hover:border-accent-blue dark:hover:border-dark-accent cursor-pointer transform hover:-translate-y-1 active:scale-[0.98] flex flex-col"
    onClick={onClick}
  >
    <p className="text-[16px] text-text-dark dark:text-dark-text mb-3 sm:mb-4 flex-grow leading-relaxed font-normal">{quote.text}</p>
    <div className="flex justify-between items-start mt-auto pt-3 border-t border-border-light dark:border-dark-border">
      <div className="flex items-start gap-4 overflow-hidden">
        {quote.image && (
          <div className="flex-shrink-0">
            <img 
              src={quote.image} 
              alt={quote.author} 
              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md border border-border-light dark:border-dark-border shadow-sm"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <span className="text-[14px] text-accent-blue dark:text-white font-bold block">
            {quote.author}
          </span>
          <p className="text-[14px] text-text-dark dark:text-dark-text mt-1 font-medium">
            {quote.bio}
          </p>
          <p className="text-[14px] text-text-dark dark:text-dark-text-secondary mt-1 font-medium">
            {quote.year}
          </p>
        </div>
      </div>
      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-accent-blue dark:text-dark-accent flex-shrink-0 mt-2" />
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
      <div className="min-h-screen bg-bg-light dark:bg-dark-bg p-6 flex items-center justify-center">
        <p className="text-xl text-text-dark dark:text-dark-text">Loading quotes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-light dark:bg-dark-bg p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 dark:text-red-400 mb-4">Unable to load quotes</p>
          <p className="text-text-dark dark:text-dark-text opacity-80">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light dark:bg-dark-bg p-3 sm:p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-4 sm:mb-6 px-3 sm:px-2">
          {/* Top row: Title and dark mode toggle */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="sm:text-[20px] font-bold text-text-dark dark:text-dark-text">AI Early Warnings</h1>
            <div className="flex items-center">
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-bg-light dark:bg-dark-card text-gray-800 dark:text-dark-text shadow-md hover:shadow-lg hover:scale-105 relative w-9 h-9 flex items-center justify-center theme-toggle"
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
                    <div className="border-b border-border-light dark:border-dark-border mb-6">
                      <h3 className="text-[20px] text-accent-blue dark:text-dark-accent font-bold pb-2">
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
