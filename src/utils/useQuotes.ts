import { useState, useEffect } from 'react';
import { loadQuotes, Quote } from '../data/quotes';

export function useQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [isCarouselFading, setIsCarouselFading] = useState(false);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const loadedQuotes = await loadQuotes();
        setQuotes(loadedQuotes);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error loading quotes'));
        setLoading(false);
      }
    };
    
    fetchQuotes();
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

  const currentQuote = quotes.length > 0 ? quotes[currentCarouselIndex] : null;

  return {
    quotes,
    loading,
    error,
    currentQuote,
    isCarouselFading,
    setCurrentCarouselIndex
  };
}