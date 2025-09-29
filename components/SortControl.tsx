import React from 'react';
import { SortIcon } from './icons/SortIcon';

export type SortOption = 'Newest First' | 'Oldest First' | 'Total Amount (High-Low)';

const SORT_OPTIONS: SortOption[] = ['Newest First', 'Oldest First', 'Total Amount (High-Low)'];

interface SortControlProps {
  currentSort: SortOption;
  onSortChange: (option: SortOption) => void;
}

export const SortControl: React.FC<SortControlProps> = ({ currentSort, onSortChange }) => {
  return (
    <div className="flex items-center space-x-2 bg-white p-1.5 rounded-full shadow-sm shrink-0">
      <SortIcon className="w-5 h-5 text-gray-400 mx-2" />
      {SORT_OPTIONS.map(option => (
        <button
          key={option}
          onClick={() => onSortChange(option)}
          className={`px-3 py-1.5 rounded-full font-semibold transition-colors duration-200 text-xs sm:text-sm ${
            currentSort === option
              ? 'bg-primary text-white shadow-sm'
              : 'text-gray-600 hover:bg-secondary/20'
          }`}
          aria-pressed={currentSort === option}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
