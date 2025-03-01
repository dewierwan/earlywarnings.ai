import React, { ReactNode, useEffect, useState } from 'react';

interface MasonryLayoutProps {
  children: ReactNode[];
  columns?: number;
  gap?: number;
}

export function MasonryLayout({ 
  children, 
  columns = 3,
  gap = 32 
}: MasonryLayoutProps) {
  // Create responsive column state that defaults to 1 on small screens
  const [adjustedColumns, setAdjustedColumns] = useState(columns);
  const [columnGap, setColumnGap] = useState(gap);
  
  // Adjust columns and gap based on screen size
  useEffect(() => {
    const handleResize = () => {
      // Determine appropriate gap size based on screen width
      const newGap = window.innerWidth < 640 ? Math.floor(gap * 0.5) : gap;
      setColumnGap(newGap);
    };
    
    // Call once on mount
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [gap]);
  
  // Use the passed columns prop which should already be responsive
  // from the parent component's column calculation
  
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
  
  // Return a responsive flex container
  return (
    <div className="flex w-full">
      {result}
    </div>
  );
} 