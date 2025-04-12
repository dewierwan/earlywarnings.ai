import { useState, useEffect } from 'react';
import { loadQuotes, Quote } from '../data/quotes';

// Priority mapping for sorting
const PRIORITY_ORDER = {
  'Very high': 1,
  'High': 2,
  'Medium': 3,
  'Low': 4,
  'Very low': 5
};

export function useQuotes() {
  const [allQuotes, setAllQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string>('All');

  // Load quotes from API
  useEffect(() => {
    async function fetchQuotes() {
      try {
        const loadedQuotes = await loadQuotes();
        setAllQuotes(loadedQuotes);
        
        // Initial sort with default settings
        const sorted = sortQuotes(loadedQuotes, 'All');
        setFilteredQuotes(sorted);
        setLoading(false);
      } catch (err) {
        console.error('Error loading quotes:', err);
        setError(err instanceof Error ? err : new Error('Unknown error loading quotes'));
        setLoading(false);
      }
    }
    
    fetchQuotes();
  }, []);

  // Pure function to sort quotes by priority only
  function sortQuotes(quotes: Quote[], group: string): Quote[] {
    // First filter by group if needed
    let result = [...quotes];
    if (group !== 'All') {
      result = result.filter(q => q.group === group);
    }
    
    // Sort by priority only (using priority mapping)
    result.sort((a, b) => {
      // Map string priorities to numeric values using the PRIORITY_ORDER mapping
      // Default to lowest priority (5) if not set or not found in mapping
      const aPriority = a.priority ? (PRIORITY_ORDER[a.priority as keyof typeof PRIORITY_ORDER] || 5) : 5;
      const bPriority = b.priority ? (PRIORITY_ORDER[b.priority as keyof typeof PRIORITY_ORDER] || 5) : 5;
      
      // Sort by priority (ascending - lower numbers first)
      return aPriority - bPriority;
    });
    
    return result;
  }
  
  // Function to update filtering
  function updateQuotes(group?: string) {
    const newGroup = group !== undefined ? group : selectedGroup;
    
    // Update state
    if (group !== undefined) setSelectedGroup(group);
    
    // Apply sorting and filtering
    const sorted = sortQuotes(allQuotes, newGroup);
    setFilteredQuotes(sorted);
  }

  // Get all unique groups
  const availableGroups = allQuotes.length > 0 
    ? ['All', ...Array.from(new Set(allQuotes.map(q => q.group))).sort()]
    : ['All'];
  
  // Handler for group filtering
  const filterByGroup = (group: string) => {
    updateQuotes(group);
  };
  
  return {
    quotes: filteredQuotes,
    loading,
    error,
    selectedGroup,
    availableGroups,
    filterByGroup
  };
}