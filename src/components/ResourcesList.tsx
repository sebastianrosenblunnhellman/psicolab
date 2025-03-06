'use client';

import { useState, useMemo } from 'react';
import { Resource } from '@/utils/resources';
import SidebarFilter from './SidebarFilter';
import Link from 'next/link';
import { FaBook, FaVideo, FaExternalLinkAlt } from 'react-icons/fa';

interface ResourcesListProps {
  initialResources: Resource[];
}

export default function ResourcesList({ initialResources }: ResourcesListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const resourcesPerPage = 4;

  // Get unique tags from all resources
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    initialResources.forEach(resource => {
      resource.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [initialResources]);

  // Get unique types from all resources
  const allTypes = useMemo(() => {
    const types = new Set<string>();
    initialResources.forEach(resource => {
      if (resource.type) {
        types.add(resource.type);
      }
    });
    return Array.from(types).sort();
  }, [initialResources]);

  // Filter resources based on search term, selected tag, and selected type
  const filteredResources = useMemo(() => {
    return initialResources.filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = selectedTag === '' || resource.tags?.includes(selectedTag);
      const matchesType = selectedType === '' || resource.type === selectedType;
      return matchesSearch && matchesTag && matchesType;
    });
  }, [initialResources, searchTerm, selectedTag, selectedType]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredResources.length / resourcesPerPage);
  const paginatedResources = filteredResources.slice(
    (currentPage - 1) * resourcesPerPage,
    currentPage * resourcesPerPage
  );

  // Reset to first page when filters change
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleTagChange = (value: string) => {
    setSelectedTag(value);
    setCurrentPage(1);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setCurrentPage(1);
  };

  // Helper function to render the appropriate icon based on resource type
  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'libro':
        return <FaBook className="text-blue-600" />;
      case 'video':
        return <FaVideo className="text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar Filter */}
      <SidebarFilter
        tags={allTags}
        authors={allTypes}
        selectedTag={selectedTag}
        selectedAuthor={selectedType}
        onTagChange={handleTagChange}
        onAuthorChange={handleTypeChange}
      />
      
      {/* Main Content */}
      <div className="flex-1 pl-6 space-y-8">
        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Buscar recursos..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Resources List */}
        {paginatedResources.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
            {paginatedResources.map((resource) => (
              <div key={resource.slug} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-2">
                  <span className="mr-2">{getResourceIcon(resource.type)}</span>
                  <span className="text-sm font-medium text-gray-500 capitalize">{resource.type}</span>
                </div>
                <h2 className="text-xl font-bold mb-2">{resource.title}</h2>
                <p className="text-gray-600 mb-4">{resource.excerpt}</p>
                
                {resource.tags && resource.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {resource.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <div>
                    {resource.author && <p className="text-sm text-gray-500">Autor: {resource.author}</p>}
                    {resource.pages && <p className="text-sm text-gray-500">Páginas: {resource.pages}</p>}
                    {resource.date && (
                      <p className="text-sm text-gray-500">
                        Fecha: {new Date(resource.date).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                  
                  {resource.link && (
                    <a 
                      href={resource.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                    >
                      Acceder <FaExternalLinkAlt className="ml-2" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 py-8">
            No se encontraron recursos que coincidan con tu búsqueda.
          </p>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 disabled:opacity-50 hover:bg-gray-200 transition-colors"
            >
              Anterior
            </button>
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg ${
                    currentPage === page
                      ? 'bg-teal-500 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  } transition-colors`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 disabled:opacity-50 hover:bg-gray-200 transition-colors"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}