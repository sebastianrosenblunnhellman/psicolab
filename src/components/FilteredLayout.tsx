'use client';

import React, { ReactNode, useState, useCallback } from 'react';

interface FilteredLayoutProps {
  filterComponent: ReactNode;
  children: ReactNode;
}

export default function FilteredLayout({ filterComponent, children }: FilteredLayoutProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFilterOpenChange = useCallback((isOpen: boolean) => {
    setIsFilterOpen(isOpen);
  }, []);

  // Clone the filter component with the additional onFilterOpenChange prop
  const enhancedFilterComponent = React.Children.map(filterComponent, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        onFilterOpenChange: handleFilterOpenChange
      });
    }
    return child;
  });

  return (
    <div className="flex flex-col lg:flex-row w-full">
      {/* Filter sidebar */}
      <div className="flex-shrink-0 transition-all duration-300">
        {enhancedFilterComponent}
      </div>
      
      {/* Main content - adapts to filter state */}
      <div 
        className={`flex-grow transition-all duration-300 ${
          isFilterOpen ? 'lg:ml-6' : 'ml-4'
        }`}
        style={{ width: isFilterOpen ? 'calc(100% - 16rem)' : 'calc(100% - 3rem)' }}
      >
        {children}
      </div>
    </div>
  );
}
