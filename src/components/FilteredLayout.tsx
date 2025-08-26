'use client';

import React, { ReactNode, useState, useCallback } from 'react';

interface FilteredLayoutProps {
  filterComponent: ReactNode;
  children: ReactNode;
}

export default function FilteredLayout({ filterComponent, children }: FilteredLayoutProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // Mobile control: bump this key to signal the sidebar to open
  const [mobileFilterToggleKey, setMobileFilterToggleKey] = useState(0);

  const handleFilterOpenChange = useCallback((isOpen: boolean) => {
    setIsFilterOpen(isOpen);
  }, []);

  // Clone the filter component with the additional onFilterOpenChange prop
  const enhancedFilterComponent = React.Children.map(filterComponent, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        onFilterOpenChange: handleFilterOpenChange,
        externalToggleKey: mobileFilterToggleKey
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
        className={`flex-grow w-full transition-all duration-300 ${
          isFilterOpen ? 'lg:ml-6' : ''
        } px-4 lg:px-0`}
      >
        {/* Mobile open-filters button */}
        <div className="lg:hidden mb-4">
          <button
            type="button"
            aria-label="Abrir filtros"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm hover:bg-gray-50"
            onClick={() => setMobileFilterToggleKey((k) => k + 1)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-600">
              <path fillRule="evenodd" d="M3.75 5.25a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm2 6a.75.75 0 01.75-.75h11a.75.75 0 010 1.5h-11a.75.75 0 01-.75-.75zm3 6a.75.75 0 01.75-.75h5a.75.75 0 010 1.5h-5a.75.75 0 01-.75-.75z" clipRule="evenodd" />
            </svg>
            Filtros
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
