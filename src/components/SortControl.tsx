import { ArrowUpWideNarrow, ArrowDownWideNarrow } from 'lucide-react';
import { SortDirection } from '../utils/useQuotes';

interface SortControlProps {
  sortDirection: SortDirection;
  onSort: (direction: SortDirection) => void;
}

export function SortControl({ sortDirection, onSort }: SortControlProps) {
  return (
    <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-1">
      <div className="flex gap-1 p-0.5 ml-1">
        <button
          onClick={() => onSort('asc')}
          className={`px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm rounded-md flex items-center ${
            sortDirection === 'asc'
              ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 shadow-sm hover:shadow'
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
              ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 shadow-sm hover:shadow'
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