import { useState, useEffect } from 'react';
import { loadQuotes, Quote } from '../data/quotes';

// Fisher-Yates shuffle implementation for client-side shuffling
function shuffleArray<T>(array: T[]): T[] {
  // Create a copy of the array to avoid mutating the original
  const shuffled = [...array];
  
  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

export type SortDirection = 'asc' | 'desc' | 'none';

export function useQuotes() {
  const [allQuotes, setAllQuotes] = useState<Quote[]>([]);
  const [featuredQuotes, setFeaturedQuotes] = useState<Quote[]>([]);
  const [sortedQuotes, setSortedQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [isCarouselFading, setIsCarouselFading] = useState(false);
  const [sortDirection, setSortDirection] = useState<SortDirection>('none');

  // Load quotes from API
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const loadedQuotes = await loadQuotes();
        setAllQuotes(loadedQuotes);
        setFeaturedQuotes(loadedQuotes); // Keep a separate copy for the featured quotes
        setSortedQuotes(loadedQuotes);   // Copy for sorting in the grid below
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error loading quotes'));
        setLoading(false);
      }
    };
    
    fetchQuotes();
  }, []);

  // Carousel effect - uses the featuredQuotes array which is never sorted
  useEffect(() => {
    if (featuredQuotes.length === 0) return;
    
    const transitionQuote = () => {
      setIsCarouselFading(true);
      setTimeout(() => {
        setCurrentCarouselIndex((prev) => (prev + 1) % featuredQuotes.length);
        setIsCarouselFading(false);
      }, 1000);
    };

    const timer = setInterval(transitionQuote, 9000);
    return () => clearInterval(timer);
  }, [featuredQuotes.length]);

  // Sort quotes by year - only affects the grid quotes, not the featured quote
  const sortQuotes = (direction: SortDirection) => {
    setSortDirection(direction);
    
    if (direction === 'none') {
      // When user selects the shuffle option, reshuffle the quotes
      // rather than reverting to original order
      setSortedQuotes(shuffleArray([...allQuotes]));
      return;
    }
    
    const sorted = [...sortedQuotes].sort((a, b) => {
      if (direction === 'asc') {
        return a.year - b.year;
      } else {
        return b.year - a.year;
      }
    });
    
    setSortedQuotes(sorted);
  };

  const currentQuote = featuredQuotes.length > 0 ? featuredQuotes[currentCarouselIndex] : null;

  return {
    quotes: sortedQuotes, // Return sorted quotes for the grid
    loading,
    error,
    currentQuote,        // This comes from the unsorted featuredQuotes
    isCarouselFading,
    setCurrentCarouselIndex,
    sortDirection,
    sortQuotes
  };
}