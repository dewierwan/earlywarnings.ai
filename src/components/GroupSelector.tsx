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
    <div className="flex items-center bg-bg-light dark:bg-dark-card rounded-lg border border-border-light dark:border-dark-border shadow-sm p-1">
      <div className="flex flex-wrap gap-1 p-0.5 ml-1">
        {groups.map((group) => (
          <button
            key={group}
            onClick={() => onGroupChange(group)}
            className={`px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm rounded-md ${
              selectedGroup === group
                ? 'bg-accent-blue text-bg-light shadow-md hover:bg-accent-blue/90'
                : 'bg-bg-light dark:bg-dark-card text-text-dark dark:text-dark-text hover:text-accent-blue dark:hover:text-dark-accent border border-border-light dark:border-dark-border hover:border-accent-blue dark:hover:border-dark-accent shadow-sm hover:shadow dark:hover:shadow-dark-hover'
            }`}
          >
            {group}
          </button>
        ))}
      </div>
    </div>
  );
};