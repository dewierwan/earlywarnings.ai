import { ArrowUpWideNarrow, ArrowDownWideNarrow } from 'lucide-react';
import { SortDirection } from '../utils/useQuotes';

interface SortControlProps {
  sortDirection: SortDirection;
  onSort: (direction: SortDirection) => void;
}

export function SortControl({ sortDirection, onSort }: SortControlProps) {
  return (
    <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-1">
      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mr-1 ml-2 whitespace-nowrap">Sort by year:</span>
      <div className="flex gap-1 p-0.5">
        <button
          onClick={() => onSort('asc')}
          className={`p-1 sm:p-1.5 rounded-md ${
            sortDirection === 'asc'
              ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
              : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
          }`}
          aria-label="Sort by year ascending"
          title="Oldest first"
        >
          <ArrowUpWideNarrow size={16} className="sm:w-[18px] sm:h-[18px]" />
        </button>
        <button
          onClick={() => onSort('desc')}
          className={`p-1 sm:p-1.5 rounded-md ${
            sortDirection === 'desc'
              ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
              : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
          }`}
          aria-label="Sort by year descending"
          title="Newest first"
        >
          <ArrowDownWideNarrow size={16} className="sm:w-[18px] sm:h-[18px]" />
        </button>
      </div>
    </div>
  );
}