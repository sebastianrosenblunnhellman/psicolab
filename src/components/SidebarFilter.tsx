'use client';

import { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronUp, FiFilter } from 'react-icons/fi';

interface SidebarFilterProps {
  tags: string[];
  authors: string[];
  selectedTag: string;
  selectedAuthor: string;
  onTagChange: (tag: string) => void;
  onAuthorChange: (author: string) => void;
  tagsLabel?: string;
  authorsLabel?: string;
  allTagsLabel?: string;
  allAuthorsLabel?: string;
  onFilterOpenChange?: (isOpen: boolean) => void;
  // When this number changes, open the drawer on mobile
  externalToggleKey?: number;
}

export default function SidebarFilter({
  tags,
  authors,
  selectedTag,
  selectedAuthor,
  onTagChange,
  onAuthorChange,
  tagsLabel = 'Categorías',
  authorsLabel = 'Autores',
  allTagsLabel = 'Todas las categorías',
  allAuthorsLabel = 'Todos los autores',
  onFilterOpenChange,
  externalToggleKey,
}: SidebarFilterProps) {
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [isAuthorsOpen, setIsAuthorsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Check if we're on mobile based on screen width
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Set initial state
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Changed from 1024 to 768 for better mobile breakpoint
    };
    
    // Check on initial load
    checkMobile();
    
    // Set up listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Keep filters collapsed by default on mobile, but allow opening on desktop
  useEffect(() => {
    if (isMobile) {
      setIsFilterOpen(false);
    } else {
      setIsFilterOpen(true); // Auto-expand on desktop
    }
  }, [isMobile]);

  // Open the drawer when the parent requests it (mobile only)
  useEffect(() => {
    if (isMobile && typeof externalToggleKey === 'number') {
      // Open when key changes
      setIsFilterOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalToggleKey]);

  // Notify parent component when filter state changes
  useEffect(() => {
    if (onFilterOpenChange) {
      onFilterOpenChange(isFilterOpen);
    }
  }, [isFilterOpen, onFilterOpenChange]);

  const toggleFilterOpen = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <>
      {/* Backdrop on mobile when open */}
      {isMobile && isFilterOpen && (
        <div
          className="fixed top-20 right-0 left-0 bottom-0 bg-black/30 z-40"
          onClick={() => setIsFilterOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`${
          isMobile
            ? `fixed top-20 bottom-0 left-0 z-50 bg-white border-r border-gray-200 transition-transform duration-300 ${
                isFilterOpen ? 'translate-x-0' : '-translate-x-full'
              } w-11/12 max-w-sm p-4`
            : `${isFilterOpen ? 'w-64' : 'w-12'} transition-all duration-300 bg-white p-4 border-r border-gray-200 h-fit sticky top-24`
        }`}
      >
      {/* Filter header with toggle */}
      <button 
        className="w-full flex items-center justify-between font-medium text-gray-800 mb-4"
        onClick={toggleFilterOpen}
      >
        <div className="flex items-center">
          <FiFilter className="text-blue-600 h-5 w-5" />
          {isFilterOpen && <span className="text-lg ml-2">Filtros</span>}
        </div>
        {isFilterOpen && (
          isFilterOpen ? (
            <FiChevronUp className="h-5 w-5" />
          ) : (
            <FiChevronDown className="h-5 w-5" />
          )
        )}
      </button>

        {/* Filter content - collapsible */}
        {isFilterOpen && (
          <div className="space-y-6 pb-6">
          {/* Tags Filter */}
          <div className="mb-6">
            <button
              onClick={() => setIsTagsOpen(!isTagsOpen)}
              className="flex items-center justify-between w-full text-left font-semibold text-gray-700 mb-2"
            >
              <span>{tagsLabel}</span>
              {isTagsOpen ? (
                <FiChevronUp className="h-5 w-5" />
              ) : (
                <FiChevronDown className="h-5 w-5" />
              )}
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isTagsOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
              <div className="space-y-2">
                <button
                  onClick={() => onTagChange('')}
                  className={`w-full text-left px-2 py-1 rounded ${selectedTag === '' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {allTagsLabel}
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onTagChange(tag)}
                    className={`w-full text-left px-2 py-1 rounded ${selectedTag === tag ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Authors Filter */}
          <div className="mb-6">
            <button
              onClick={() => setIsAuthorsOpen(!isAuthorsOpen)}
              className="flex items-center justify-between w-full text-left font-semibold text-gray-700 mb-2"
            >
              <span>{authorsLabel}</span>
              {isAuthorsOpen ? (
                <FiChevronUp className="h-5 w-5" />
              ) : (
                <FiChevronDown className="h-5 w-5" />
              )}
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isAuthorsOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
              <div className="space-y-2">
                <button
                  onClick={() => onAuthorChange('')}
                  className={`w-full text-left px-2 py-1 rounded ${selectedAuthor === '' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {allAuthorsLabel}
                </button>
                {authors.map((author) => (
                  <button
                    key={author}
                    onClick={() => onAuthorChange(author)}
                    className={`w-full text-left px-2 py-1 rounded ${selectedAuthor === author ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {author}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Active filters indicator */}
          {(selectedTag || selectedAuthor) && (
            <div className="border-t border-gray-100 pt-4 text-sm">
              <p className="font-medium text-gray-700 mb-2">Filtros activos:</p>
              <div className="flex flex-wrap gap-2">
                {selectedTag && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center">
                    {selectedTag}
                    <button 
                      onClick={() => onTagChange('')}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedAuthor && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center">
                    {selectedAuthor}
                    <button 
                      onClick={() => onAuthorChange('')}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
          </div>
        )}
      
      {/* Filter notification badge when collapsed - shows number of active filters */}
      {!isFilterOpen && (selectedTag || selectedAuthor) && (
        <div className="absolute top-0 right-0 -mt-2 -mr-2 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
          {(selectedTag ? 1 : 0) + (selectedAuthor ? 1 : 0)}
        </div>
      )}
      </div>
    </>
  );
}