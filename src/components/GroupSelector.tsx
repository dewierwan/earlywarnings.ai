import React from 'react';

interface GroupSelectorProps {
  groups: string[];
  selectedGroup: string;
  onGroupChange: (group: string) => void;
}

export const GroupSelector: React.FC<GroupSelectorProps> = ({
  groups,
  selectedGroup,
  onGroupChange
}) => {
  return (
    <div className="group-selector">
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {groups.map((group) => (
          <button
            key={group}
            onClick={() => onGroupChange(group)}
            className={`px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm rounded-full ${
              selectedGroup === group
                ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 shadow-sm hover:shadow'
            }`}
          >
            {group}
          </button>
        ))}
      </div>
    </div>
  );
};