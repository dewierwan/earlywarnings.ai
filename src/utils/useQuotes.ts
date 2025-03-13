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
  const [sortDirection, setSortDirection] = useState<SortDirection>('none');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');

  // Load quotes from API
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const loadedQuotes = await loadQuotes();
        setAllQuotes(loadedQuotes);
        
        // Organize quotes by group initially
        // Groups are already normalized from the API
        const groupMap = new Map<string, Quote[]>();
        loadedQuotes.forEach(quote => {
          const group = quote.group || 'Uncategorized';
          if (!groupMap.has(group)) {
            groupMap.set(group, []);
          }
          groupMap.get(group)?.push(quote);
        });
        
        // Flatten into a single array while maintaining group order
        let organizedQuotes: Quote[] = [];
        const groups = Array.from(groupMap.keys()).sort(); // Sort groups alphabetically
        groups.forEach(group => {
          const groupQuotes = groupMap.get(group) || [];
          // Shuffle quotes within each group
          organizedQuotes = organizedQuotes.concat(shuffleArray(groupQuotes));
        });
        
        setQuotes(organizedQuotes);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error loading quotes'));
        setLoading(false);
      }
    };
    
    fetchQuotes();
  }, []);


  // Sort quotes function - supports sorting within groups or overall
  const sortQuotes = (direction: SortDirection) => {
    setSortDirection(direction);
    
    let sortedQuotes: Quote[];
    
    // Get the base set of quotes (either all quotes or just the current group)
    let baseQuotes = allQuotes;
    if (selectedGroup !== 'All') {
      baseQuotes = allQuotes.filter(q => q.group === selectedGroup);
    }
    
    if (direction === 'none') {
      // When user selects shuffle option
      if (selectedGroup === 'All') {
        // When showing all quotes in sections, we need to maintain groups
        // but shuffle within each group
        
        // Group quotes first, ensuring normalized group names
        const groupMap = new Map<string, Quote[]>();
        baseQuotes.forEach(quote => {
          const group = quote.group || 'Uncategorized'; // Group is already normalized from the API
          if (!groupMap.has(group)) {
            groupMap.set(group, []);
          }
          groupMap.get(group)?.push(quote);
        });
        
        // Then shuffle within each group and flatten
        sortedQuotes = [];
        const groups = Array.from(groupMap.keys()).sort(); // Keep groups alphabetical
        groups.forEach(group => {
          const groupQuotes = groupMap.get(group) || [];
          sortedQuotes = sortedQuotes.concat(shuffleArray(groupQuotes));
        });
      } else {
        // Just shuffle the current group
        sortedQuotes = shuffleArray([...baseQuotes]);
      }
    } else {
      // Sort by year
      if (selectedGroup === 'All') {
        // When showing all quotes in sections, maintain groups but sort within groups
        
        // Group quotes first, ensuring normalized group names
        const groupMap = new Map<string, Quote[]>();
        baseQuotes.forEach(quote => {
          const group = quote.group || 'Uncategorized'; // Group is already normalized from the API
          if (!groupMap.has(group)) {
            groupMap.set(group, []);
          }
          groupMap.get(group)?.push(quote);
        });
        
        // Then sort within each group by year and flatten
        sortedQuotes = [];
        const groups = Array.from(groupMap.keys()).sort(); // Keep groups alphabetical
        groups.forEach(group => {
          const groupQuotes = groupMap.get(group) || [];
          const sortedGroupQuotes = [...groupQuotes].sort((a, b) => {
            return direction === 'asc' ? a.year - b.year : b.year - a.year;
          });
          sortedQuotes = sortedQuotes.concat(sortedGroupQuotes);
        });
      } else {
        // Apply sort by year for current group
        sortedQuotes = [...baseQuotes].sort((a, b) => {
          return direction === 'asc' ? a.year - b.year : b.year - a.year;
        });
      }
    }
    
    // Update quotes with new sorted array
    setQuotes(sortedQuotes);
  };

  // Get all unique groups with proper normalization
  const availableGroups = allQuotes.length > 0 
    ? ['All', ...Array.from(new Set(allQuotes.map(q => q.group || 'Uncategorized'))).sort()]
    : ['All'];
    
  // Function to filter quotes by group
  const filterByGroup = (group: string) => {
    setSelectedGroup(group);
    
    let filteredQuotes: Quote[];
    
    // Only filter if not "All"
    if (group !== 'All') {
      filteredQuotes = allQuotes.filter(q => q.group === group);
      
      // Apply current sort direction to the filtered quotes
      if (sortDirection !== 'none') {
        filteredQuotes = [...filteredQuotes].sort((a, b) => {
          return sortDirection === 'asc' ? a.year - b.year : b.year - a.year;
        });
      } else {
        // Shuffle if no sort is applied
        filteredQuotes = shuffleArray([...filteredQuotes]);
      }
    } else {
      // When showing all quotes (sections view)
      if (sortDirection === 'none') {
        // When no sorting, group and shuffle within each group
        
        // Group quotes first, ensuring normalized group names
        const groupMap = new Map<string, Quote[]>();
        allQuotes.forEach(quote => {
          const group = quote.group || 'Uncategorized'; // Group is already normalized from the API
          if (!groupMap.has(group)) {
            groupMap.set(group, []);
          }
          groupMap.get(group)?.push(quote);
        });
        
        // Then shuffle within each group and flatten
        filteredQuotes = [];
        const groups = Array.from(groupMap.keys()).sort(); // Keep groups alphabetical
        groups.forEach(group => {
          const groupQuotes = groupMap.get(group) || [];
          filteredQuotes = filteredQuotes.concat(shuffleArray(groupQuotes));
        });
      } else {
        // When sorted by year, group and sort within each group
        
        // Group quotes first, ensuring normalized group names
        const groupMap = new Map<string, Quote[]>();
        allQuotes.forEach(quote => {
          const group = quote.group || 'Uncategorized'; // Group is already normalized from the API
          if (!groupMap.has(group)) {
            groupMap.set(group, []);
          }
          groupMap.get(group)?.push(quote);
        });
        
        // Then sort within each group by year and flatten
        filteredQuotes = [];
        const groups = Array.from(groupMap.keys()).sort(); // Keep groups alphabetical
        groups.forEach(group => {
          const groupQuotes = groupMap.get(group) || [];
          const sortedGroupQuotes = [...groupQuotes].sort((a, b) => {
            return sortDirection === 'asc' ? a.year - b.year : b.year - a.year;
          });
          filteredQuotes = filteredQuotes.concat(sortedGroupQuotes);
        });
      }
    }
    
    // Update quotes with new filtered array
    setQuotes(filteredQuotes);
  };
  
  return {
    quotes,             // Single source of truth - all quotes use the same array and sort
    loading,
    error,
    sortDirection,
    selectedGroup,
    availableGroups,
    sortQuotes,
    filterByGroup
  };
}