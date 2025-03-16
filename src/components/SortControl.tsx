import { ArrowUpWideNarrow, ArrowDownWideNarrow } from 'lucide-react';
import { SortDirection } from '../utils/useQuotes';

interface SortControlProps {
  sortDirection: SortDirection;
  onSort: (direction: SortDirection) => void;
}

export function SortControl({ sortDirection, onSort }: SortControlProps) {
  return (
    <div className="flex items-center bg-bg-light dark:bg-dark-card rounded-lg border border-border-light dark:border-dark-border shadow-sm p-1">
      <div className="flex gap-1 p-0.5 ml-1">
        <button
          onClick={() => onSort('asc')}
          className={`px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm rounded-md flex items-center ${
            sortDirection === 'asc'
              ? 'bg-accent-blue text-bg-light shadow-md hover:bg-accent-blue/90'
              : 'bg-bg-light dark:bg-dark-card text-text-dark dark:text-dark-text hover:text-accent-blue dark:hover:text-dark-accent border border-border-light dark:border-dark-border hover:border-accent-blue dark:hover:border-dark-accent shadow-sm hover:shadow dark:hover:shadow-dark-hover'
          }`}
          aria-label="Sort by year ascending"
          title="Oldest first"
        >
          <ArrowUpWideNarrow size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span className="ml-1 whitespace-nowrap">Oldest first</span>
        </button>
        <button
          onClick={() => onSort('desc')}
          className={`px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm rounded-md flex items-center ${
            sortDirection === 'desc'
              ? 'bg-accent-blue text-bg-light shadow-md hover:bg-accent-blue/90'
              : 'bg-bg-light dark:bg-dark-card text-text-dark dark:text-dark-text hover:text-accent-blue dark:hover:text-dark-accent border border-border-light dark:border-dark-border hover:border-accent-blue dark:hover:border-dark-accent shadow-sm hover:shadow dark:hover:shadow-dark-hover'
          }`}
          aria-label="Sort by year descending"
          title="Newest first"
        >
          <ArrowDownWideNarrow size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span className="ml-1 whitespace-nowrap">Newest first</span>
        </button>
      </div>
    </div>
  );
}