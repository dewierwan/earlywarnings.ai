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
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCarouselFading, setIsCarouselFading] = useState(false);
  const [sortDirection, setSortDirection] = useState<SortDirection>('none');

  // Load quotes from API
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const loadedQuotes = await loadQuotes();
        setAllQuotes(loadedQuotes);
        setQuotes(loadedQuotes);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error loading quotes'));
        setLoading(false);
      }
    };
    
    fetchQuotes();
  }, []);

  // Simple autoplay function for the carousel
  const navigateCarousel = (direction: 'next' | 'prev' = 'next') => {
    if (quotes.length === 0) return;
    
    setIsCarouselFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => {
        if (direction === 'next') {
          return (prev + 1) % quotes.length;
        } else {
          return (prev - 1 + quotes.length) % quotes.length;
        }
      });
      setIsCarouselFading(false);
    }, 300);
  };

  // Carousel autoplay effect - follows the sorted order
  useEffect(() => {
    if (quotes.length === 0) return;
    
    const timer = setInterval(() => {
      setIsCarouselFading(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % quotes.length);
        setIsCarouselFading(false);
      }, 300);
    }, 10000);
    
    return () => clearInterval(timer);
  }, [quotes.length]);

  // Sort quotes function - simplified to work with a single quotes array
  const sortQuotes = (direction: SortDirection) => {
    setSortDirection(direction);
    
    // Store current quote reference before sorting
    const currentQuote = quotes[currentIndex];
    let sortedQuotes: Quote[];
    
    if (direction === 'none') {
      // When user selects shuffle option
      sortedQuotes = shuffleArray([...allQuotes]);
    } else {
      // Apply sort by year
      sortedQuotes = [...allQuotes].sort((a, b) => {
        return direction === 'asc' ? a.year - b.year : b.year - a.year;
      });
    }
    
    // Update quotes with new sorted array
    setQuotes(sortedQuotes);
    
    // Try to preserve the current quote after sorting
    if (currentQuote) {
      const newIndex = sortedQuotes.findIndex(q => 
        q.author === currentQuote.author && 
        q.text.substring(0, 50) === currentQuote.text.substring(0, 50)
      );
      
      if (newIndex !== -1) {
        setCurrentIndex(newIndex);
      } else {
        // If quote not found in new order, reset to first quote
        setCurrentIndex(0);
      }
    }
  };

  // Current quote points to the quote in the sorted array
  const currentQuote = quotes.length > 0 ? quotes[currentIndex] : null;

  return {
    quotes,             // Single source of truth - all quotes use the same array and sort
    loading,
    error,
    currentQuote,       // Current quote from the sorted array
    isCarouselFading,
    sortDirection,
    sortQuotes,
    nextQuote: () => navigateCarousel('next'),
    prevQuote: () => navigateCarousel('prev')
  };
}