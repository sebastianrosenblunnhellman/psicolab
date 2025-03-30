import React, { useEffect, useState } from 'react'; // Added useState import
import { FaSearch, FaFilter, FaTimes, FaChevronDown } from 'react-icons/fa';

type ResourceFilterProps = {
  resourcesData: any;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedSubcategory: string;
  setSelectedSubcategory: (subcategory: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const ResourceFilter = ({
  resourcesData,
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  selectedType,
  setSelectedType,
  selectedLanguage,
  setSelectedLanguage,
  searchQuery,
  setSearchQuery,
}: ResourceFilterProps) => {
  // Added state for mobile filter collapse
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Reset subcategory when category changes
  useEffect(() => {
    if (selectedCategory === 'all' || selectedCategory !== 'all') {
      setSelectedSubcategory('all');
    }
  }, [selectedCategory, setSelectedSubcategory]);
  
  // Check if any filter is active
  const isFilterActive = selectedCategory !== 'all' || 
                        selectedSubcategory !== 'all' || 
                        selectedType !== 'all' || 
                        selectedLanguage !== 'all' || 
                        searchQuery !== '';
                        
  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSelectedType('all');
    setSelectedLanguage('all');
    setSearchQuery('');
  };
  
  if (!resourcesData) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4 md:mb-0 flex items-center">
          <FaFilter className="mr-2 text-blue-600" /> Filtrar recursos
        </h2>
        
        {isFilterActive && (
          <button 
            onClick={handleResetFilters}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <FaTimes className="mr-1" /> Limpiar todos los filtros
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search input */}
        <div className="lg:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              id="search"
              placeholder="Título, autor, descripción..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Category filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <div className="relative">
            <select
              id="category"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:ring-blue-500 focus:border-blue-500 shadow-sm pr-10"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Todas las categorías</option>
              {resourcesData && Object.entries(resourcesData.categories).map(([key, category]) => (
                <option key={key} value={key}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <FaChevronDown size={12} />
            </div>
          </div>
        </div>
        
        {/* Subcategory filter */}
        <div>
          <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">Subcategoría</label>
          <div className="relative">
            <select
              id="subcategory"
              className={`block w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:ring-blue-500 focus:border-blue-500 shadow-sm pr-10 ${
                selectedCategory === 'all' ? 'opacity-60 cursor-not-allowed' : ''
              }`}
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              disabled={selectedCategory === 'all'}
            >
              <option value="all">Todas las subcategorías</option>
              {selectedCategory !== 'all' && resourcesData && resourcesData.categories[selectedCategory] && 
                Object.entries(resourcesData.categories[selectedCategory].subcategories).map(([key, subcategory]) => (
                  <option key={key} value={key}>
                    {subcategory.name}
                  </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <FaChevronDown size={12} />
            </div>
          </div>
        </div>
        
        {/* Type filter */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <div className="relative">
            <select
              id="type"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:ring-blue-500 focus:border-blue-500 shadow-sm pr-10"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">Todos los tipos</option>
              {resourcesData && resourcesData.filters.type.map((type, index) => (
                <option key={index} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <FaChevronDown size={12} />
            </div>
          </div>
        </div>
        
        {/* Language filter */}
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Idioma</label>
          <div className="relative">
            <select
              id="language"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:ring-blue-500 focus:border-blue-500 shadow-sm pr-10"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="all">Todos los idiomas</option>
              {resourcesData && resourcesData.filters.language.map((language, index) => (
                <option key={index} value={language}>
                  {language.charAt(0).toUpperCase() + language.slice(1)}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <FaChevronDown size={12} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Active filters */}
      {isFilterActive && (
        <div className="mt-6 border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Filtros activos:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Categoría: {resourcesData.categories[selectedCategory].name}
                <button 
                  onClick={() => setSelectedCategory('all')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <FaTimes />
                </button>
              </span>
            )}
            
            {selectedSubcategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Subcategoría: {resourcesData.categories[selectedCategory].subcategories[selectedSubcategory].name}
                <button 
                  onClick={() => setSelectedSubcategory('all')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <FaTimes />
                </button>
              </span>
            )}
            
            {selectedType !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Tipo: {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
                <button 
                  onClick={() => setSelectedType('all')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <FaTimes />
                </button>
              </span>
            )}
            
            {selectedLanguage !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Idioma: {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}
                <button 
                  onClick={() => setSelectedLanguage('all')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <FaTimes />
                </button>
              </span>
            )}
            
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Búsqueda: "{searchQuery}"
                <button 
                  onClick={() => setSearchQuery('')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <FaTimes />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceFilter;
