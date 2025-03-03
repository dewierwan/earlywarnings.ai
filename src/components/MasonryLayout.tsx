import React, { ReactNode, useState, useLayoutEffect, useMemo } from 'react';

interface MasonryLayoutProps {
  children: ReactNode[];
  columns: number;
  gap?: number;
}

export function MasonryLayout({ 
  children, 
  columns,
  gap = 32 
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
  
  // Memoize the column distribution to avoid unnecessary recalculations
  const columnElements = useMemo(() => {
    // Create column arrays
    const columnWrapper: Record<string, React.ReactNode[]> = {};
    const result = [];
    
    // Create columns
    for (let i = 0; i < columns; i++) {
      columnWrapper[`column${i}`] = [];
    }
    
    // Distribute children among columns
    for (let i = 0; i < children.length; i++) {
      const columnIndex = i % columns;
      columnWrapper[`column${columnIndex}`].push(
        <div 
          key={i} 
          className="mb-4 sm:mb-6"
          style={{ marginBottom: `${columnGap}px` }}
        >
          {children[i]}
        </div>
      );
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
  }, [children, columns, columnGap]);
  
  // Return a responsive flex container
  return (
    <div className="flex w-full overflow-visible">
      {columnElements}
    </div>
  );
}