import React, { ReactNode, useState, useLayoutEffect, useMemo } from 'react';
import { Quote } from '../data/quotes';

interface MasonryLayoutProps {
  children: ReactNode[];
  columns: number;
  gap?: number;
  sortDirection?: 'asc' | 'desc';
  quotes?: Quote[]; // Optional array of quotes to optimize layout
}

export function MasonryLayout({ 
  children, 
  columns,
  gap = 32,
  sortDirection = 'desc', // Kept for backward compatibility
  quotes = []
}: MasonryLayoutProps) {
  // Only manage the responsive gap, since columns come from parent
  const [columnGap, setColumnGap] = useState(gap);
  
  // Adjust gap based on screen size
  useLayoutEffect(() => {
    const handleResize = () => {
      // Determine appropriate gap size based on screen width
      const newGap = window.innerWidth < 640 ? Math.floor(gap * 0.5) : gap;
      setColumnGap(newGap);
    };
    
    // Call once on mount
    handleResize();
    
    // Add resize listener with debounce for better performance
    let resizeTimer: number;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(handleResize, 100);
    };
    
    window.addEventListener('resize', debouncedResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', debouncedResize);
    };
  }, [gap]);
  
  // Memoize the column distribution with a more balanced approach
  const columnElements = useMemo(() => {
    // Create column arrays and height trackers
    const columnWrapper: Record<string, React.ReactNode[]> = {};
    const columnHeights: number[] = Array(columns).fill(0);
    const result = [];
    
    // Create columns
    for (let i = 0; i < columns; i++) {
      columnWrapper[`column${i}`] = [];
    }
    
    // SORTED BY PRIORITY: Maintain priority order while optimizing layout
    if (quotes.length === children.length) {
      // Process items in their existing order (which should be priority-sorted)
      quotes.forEach((quote, index) => {
        const item = {
          index,
          // Better height estimation based on text content
          estimatedHeight: 
            // Fixed header height
            120 + 
            // Text height - based on string length and line wrapping
            Math.ceil(quote.text.length / 40) * 20 +
            // Bio height - approximately based on bio text length
            Math.min(60, Math.ceil(quote.bio.length / 50) * 20)
        };
        
        // Find the column with the smallest height
        const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
        
        // Add the item to the shortest column
        columnWrapper[`column${shortestColumnIndex}`].push(
          <div 
            key={item.index} 
            className="mb-4 sm:mb-6"
            style={{ marginBottom: `${columnGap}px` }}
          >
            {children[item.index]}
          </div>
        );
        
        // Update the column height
        columnHeights[shortestColumnIndex] += item.estimatedHeight + columnGap;
      });
    } else {
      // FALLBACK: Simple balanced layout when no quotes data is available
      // Simple balance approach
      let currentIndex = 0;
      
      while (currentIndex < children.length) {
        // Find the column with the smallest height
        const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
        
        // Add the item to the shortest column
        columnWrapper[`column${shortestColumnIndex}`].push(
          <div 
            key={currentIndex} 
            className="mb-4 sm:mb-6"
            style={{ marginBottom: `${columnGap}px` }}
          >
            {children[currentIndex]}
          </div>
        );
        
        // Simple height estimation
        const estimatedHeight = 200 + (currentIndex % 3) * 50;
        columnHeights[shortestColumnIndex] += estimatedHeight + columnGap;
        
        // Move to the next item
        currentIndex++;
      }
    }
    
    // Prepare the result
    for (let i = 0; i < columns; i++) {
      result.push(
        <div
          key={i}
          className="flex-1"
          style={{
            marginLeft: i > 0 ? `${columnGap}px` : '0',
          }}
        >
          {columnWrapper[`column${i}`]}
        </div>
      );
    }
    
    return result;
  }, [children, columns, columnGap, quotes]);
  
  // Return a responsive flex container
  return (
    <div className="flex w-full overflow-visible">
      {columnElements}
    </div>
  );
}