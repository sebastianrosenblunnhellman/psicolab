'use client';

import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface SavedContentFilterProps {
  contentTypes: string[];
  categories: string[];
  selectedType: string;
  selectedCategory: string;
  onTypeChange: (type: string) => void;
  onCategoryChange: (category: string) => void;
  typesLabel?: string;
  allTypesLabel?: string;
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
}: SavedContentFilterProps) {
  const [isTypesOpen, setIsTypesOpen] = useState(true);

  return (
    <div className="w-64 bg-white p-4 border-r border-gray-200">
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
        {isTypesOpen && (
          <div className="space-y-2">
            <button
              onClick={() => onTypeChange('')}
              className={`w-full text-left px-2 py-1 rounded ${selectedType === '' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {allTypesLabel}
            </button>
            {contentTypes.map((type) => (
              <button
                key={type}
                onClick={() => onTypeChange(type)}
                className={`w-full text-left px-2 py-1 rounded ${selectedType === type ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {type === 'article' ? 'Artículo' : 
                 type === 'course' ? 'Curso' : 
                 type === 'resource' ? 'Recurso' : 
                 type}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}