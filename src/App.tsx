import React, { useState, useEffect } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { loadQuotes, Quote } from './data/quotes';
import { Modal } from './components/Modal';
import { MasonryLayout } from './components/MasonryLayout';

function App() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    loadQuotes()
      .then(setQuotes)
      .finally(() => setLoading(false));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-indigo-100 p-6">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">AI Concern Quotes</h1>
      </header>
      
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