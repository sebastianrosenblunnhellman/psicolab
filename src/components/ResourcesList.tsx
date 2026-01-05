'use client';

import { useState, useMemo, useEffect } from 'react';
import { Resource } from '@/utils/resources';
import SidebarFilter from './SidebarFilter';
import Link from 'next/link';
import { FaBook, FaVideo, FaExternalLinkAlt } from 'react-icons/fa';
import FilteredLayout from './FilteredLayout';
import ResourceCard from '@/components/ResourceCard';

interface ResourcesListProps {
  initialResources: Resource[];
}

export default function ResourcesList({ initialResources }: ResourcesListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const resourcesPerPage = 9; // Increased for grid view
  
  // Auth and saving removed

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
  
  // Removed saved resources logic as only articles can be saved.

  return (
    <FilteredLayout
      filterComponent={
        <SidebarFilter
          tags={allTags}
          authors={allTypes}
          selectedTag={selectedTag}
          selectedAuthor={selectedType}
          onTagChange={handleTagChange}
          onAuthorChange={handleTypeChange}
          authorsLabel="Tipo"
          allAuthorsLabel="Todos los tipos"
        />
      }
    >
      <div className="flex-1 space-y-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedResources.map((resource) => (
              <div key={resource.slug} className="h-full">
                <ResourceCard
                  id={resource.slug}
                  title={resource.title}
                  description={resource.excerpt}
                  image={resource.image || '/images/miniatura.jpg'} // Fallback image
                  type={resource.type}
                  downloadUrl={resource.link}
                  tags={resource.tags}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No se encontraron recursos que coincidan con los criterios de búsqueda.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === page
                      ? 'z-10 bg-teal-50 border-teal-500 text-teal-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </nav>
          </div>
        )}
      </div>
    </FilteredLayout>
  );
}