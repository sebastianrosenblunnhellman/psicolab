'use client';

import { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronUp, FiFilter } from 'react-icons/fi';

interface SavedContentFilterProps {
  contentTypes: string[];
  categories: string[];
  selectedType: string;
  selectedCategory: string;
  onTypeChange: (type: string) => void;
  onCategoryChange: (category: string) => void;
  typesLabel?: string;
  allTypesLabel?: string;
  onFilterOpenChange?: (isOpen: boolean) => void;
}

export default function SavedContentFilter({
  contentTypes,
  categories,
  selectedType,
  selectedCategory,
  onTypeChange,
  onCategoryChange,
  typesLabel = 'Tipo de Contenido',
  allTypesLabel = 'Todos los tipos',
  onFilterOpenChange,
}: SavedContentFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isTypesOpen, setIsTypesOpen] = useState(false);
  
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
    <div className={`${isFilterOpen ? 'w-64' : 'w-12'} transition-all duration-300 bg-white p-4 border-r border-gray-200 h-fit sticky top-24 lg:top-24 z-10`}>
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
        <div className="space-y-6">
          {/* Content Types Filter */}
          <div className="mb-6">
            <button
              onClick={() => setIsTypesOpen(!isTypesOpen)}
              className="flex items-center justify-between w-full text-left font-semibold text-gray-700 mb-2"
            >
              <span>{typesLabel}</span>
              {isTypesOpen ? (
                <FiChevronUp className="h-5 w-5" />
              ) : (
                <FiChevronDown className="h-5 w-5" />
              )}
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isTypesOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
              <div className="space-y-2">
                <button
                  onClick={() => onTypeChange('')}
                  className={`w-full text-left px-2 py-1 rounded ${selectedType === '' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {allTypesLabel}
                </button>
                {contentTypes
                  .filter((t) => t === 'article')
                  .map((type) => (
                  <button
                    key={type}
                    onClick={() => onTypeChange(type)}
                    className={`w-full text-left px-2 py-1 rounded ${selectedType === type ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {type === 'article' ? 'Artículo' : type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Filter notification badge when collapsed - shows active filters */}
      {!isFilterOpen && selectedType && (
        <div className="absolute top-0 right-0 -mt-2 -mr-2 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
          1
        </div>
      )}
    </div>
  );
}