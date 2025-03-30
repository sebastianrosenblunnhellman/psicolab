'use client';

import { useState, useMemo } from 'react';
import { Resource } from '@/utils/resources';
import SidebarFilter from '@/components/SidebarFilter';
import ResourceCard from '@/components/ResourceCard';
import FilteredLayout from '@/components/FilteredLayout';

interface ResourcesListPageProps {
  initialResources: Resource[];
}

export default function ResourcesListPage({ initialResources }: ResourcesListPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const resourcesPerPage = 4;

  // Get unique tags from all resources
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    initialResources.forEach(resource => {
      resource.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [initialResources]);
  
  // Get unique authors from all resources
  const allAuthors = useMemo(() => {
    const authors = new Set<string>();
    initialResources.forEach(resource => {
      if (resource.author) {
        authors.add(resource.author);
      }
    });
    return Array.from(authors).sort();
  }, [initialResources]);

  // Filter resources based on search term, selected tag, and selected author
  const filteredResources = useMemo(() => {
    return initialResources.filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = selectedTag === '' || resource.tags?.includes(selectedTag);
      const matchesAuthor = selectedAuthor === '' || resource.author === selectedAuthor;
      return matchesSearch && matchesTag && matchesAuthor;
    });
  }, [initialResources, searchTerm, selectedTag, selectedAuthor]);
  
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

  const handleAuthorChange = (value: string) => {
    setSelectedAuthor(value);
    setCurrentPage(1);
  };

  // Simple mock function for save toggle (to be replaced with actual implementation)
  const handleSaveToggle = (resourceId: string) => {
    console.log(`Toggle save for resource: ${resourceId}`);
    // Implement actual save logic here
  };

  return (
    <FilteredLayout
      filterComponent={
        <SidebarFilter 
          tags={allTags}
          authors={allAuthors}
          selectedTag={selectedTag}
          selectedAuthor={selectedAuthor}
          onTagChange={handleTagChange}
          onAuthorChange={handleAuthorChange}
        />
      }
    >
      <div className="space-y-6">
        {/* Search Bar */}
        <div>
          <input
            type="text"
            placeholder="Buscar recursos..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        
        {/* Selected filters indicator on mobile */}
        {(selectedTag || selectedAuthor) && (
          <div className="lg:hidden flex flex-wrap gap-2 bg-gray-50 p-3 rounded-lg">
            <span className="text-sm text-gray-700">Filtros:</span>
            {selectedTag && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center">
                {selectedTag}
              </span>
            )}
            {selectedAuthor && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center">
                {selectedAuthor}
              </span>
            )}
          </div>
        )}

        {/* Resources Grid - Using ResourceCard component */}
        {paginatedResources.length > 0 ? (
          <div className="flex flex-col space-y-6">
            {paginatedResources.map((resource) => (
              <ResourceCard 
                key={resource.slug}
                id={resource.slug}
                title={resource.title}
                description={resource.excerpt}
                image={resource.image || '/images/miniatura.jpg'}
                type={resource.type}
                author={resource.author}
                downloadUrl={resource.link}
                onSaveToggle={handleSaveToggle}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 py-8">
            No se encontraron recursos que coincidan con tu búsqueda.
          </p>
        )}
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gray-100 text-gray-800 disabled:opacity-50 hover:bg-gray-200 transition-colors text-sm sm:text-base"
            >
              Anterior
            </button>
            <span className="text-gray-600 text-sm sm:text-base">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gray-100 text-gray-800 disabled:opacity-50 hover:bg-gray-200 transition-colors text-sm sm:text-base"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </FilteredLayout>
  );
}
