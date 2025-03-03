import { useState, useEffect } from 'react';

export function useResponsive() {
  const [columns, setColumns] = useState(3);

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

  return { columns };
}