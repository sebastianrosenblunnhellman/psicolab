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
}: SidebarFilterProps) {
  const [isTagsOpen, setIsTagsOpen] = useState(true);
  const [isAuthorsOpen, setIsAuthorsOpen] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Check if we're on mobile based on screen width
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Set initial state
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Check on initial load
    checkMobile();
    
    // Set up listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Open tags by default on desktop
  useEffect(() => {
    if (!isMobile) {
      setIsFilterOpen(true);
      setIsTagsOpen(true);
      setIsAuthorsOpen(true);
    }
  }, [isMobile]);

  return (
    <div className="w-64 bg-white p-4 border-r border-gray-200 h-fit sticky top-24">
      {/* Filter header with toggle */}
      <button 
        className="w-full flex items-center justify-between font-medium text-gray-800 mb-4"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <div className="flex items-center">
          <FiFilter className="mr-2" />
          <span className="text-lg">Filtros</span>
        </div>
        {isFilterOpen ? (
          <FiChevronUp className="h-5 w-5" />
        ) : (
          <FiChevronDown className="h-5 w-5" />
        )}
      </button>

      {/* Filter content - collapsible */}
      {isFilterOpen && (
        <div className="space-y-6">
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
    </div>
  );
}