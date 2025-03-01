import React, { ReactNode } from 'react';

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
  // Create column arrays
  const columnWrapper = {};
  const result = [];
  
  // Create columns
  for (let i = 0; i < columns; i++) {
    columnWrapper[`column${i}`] = [];
  }
  
  // Distribute children among columns
  for (let i = 0; i < children.length; i++) {
    const columnIndex = i % columns;
    columnWrapper[`column${columnIndex}`].push(
      <div key={i} style={{ marginBottom: `${gap}px` }}>
        {children[i]}
      </div>
    );
  }
  
  // Prepare the result
  for (let i = 0; i < columns; i++) {
    result.push(
      <div
        key={i}
        style={{
          marginLeft: i > 0 ? `${gap}px` : '0',
          flex: 1,
        }}
      >
        {columnWrapper[`column${i}`]}
      </div>
    );
  }
  
  return (
    <div style={{ display: 'flex' }}>
      {result}
    </div>
  );
} 