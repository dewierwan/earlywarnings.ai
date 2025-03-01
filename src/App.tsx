import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, X } from 'lucide-react';
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
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading quotes...</p>
      </div>
    );
  }

  const renderQuoteCard = (quote: Quote, index: number) => (
    <div 
      key={index} 
      className="p-5 border border-gray-200 rounded-lg card-bg shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_28px_-5px_rgba(79,70,229,0.15)] hover:border-indigo-300 transition-all duration-200 cursor-pointer transform hover:-translate-y-1 flex flex-col"
      onClick={() => setSelectedQuote(quote)}
    >
      <p className="text-gray-800 mb-4 flex-grow overflow-y-auto">{quote.text}</p>
      <div className="flex justify-between items-center mt-auto">
        <span className="text-indigo-600 font-medium">
          {quote.author} ({quote.year})
        </span>
        <ArrowRight className="h-5 w-5 text-indigo-400" />
      </div>
    </div>
  );

  const currentQuote = quotes[currentCarouselIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-indigo-100 p-6">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Concerns about AI</h1>
      </header>
      
      {currentQuote && (
        <div className="max-w-4xl mx-auto mb-12">
          <div 
            className={`bg-white rounded-lg p-6 shadow-lg border border-gray-200 transition-opacity duration-500 ${
              isCarouselFading ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <p className="text-xl text-gray-800 mb-6">{currentQuote.text}</p>
            <div className="flex justify-between items-end">
              <div className="flex">
                {currentQuote.image && (
                  <div className="mr-4 flex-shrink-0">
                    <img 
                      src={currentQuote.image} 
                      alt={currentQuote.author} 
                      className="w-16 h-16 object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div>
                  <p className="text-lg text-indigo-600 font-medium">{currentQuote.author}</p>
                  <p className="text-sm text-gray-600">{currentQuote.bio}</p>
                </div>
              </div>
              <a 
                href={currentQuote.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline ml-4"
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