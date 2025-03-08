'use client';

import { useState, useMemo, useEffect } from 'react';
import { Resource } from '@/utils/resources';
import SidebarFilter from './SidebarFilter';
import Link from 'next/link';
import { FaBook, FaVideo, FaExternalLinkAlt, FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { useUser } from '@stackframe/stack';
import { useCache } from '@/utils/cache';

interface ResourcesListProps {
  initialResources: Resource[];
}

export default function ResourcesList({ initialResources }: ResourcesListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const resourcesPerPage = 4;
  
  const user = useUser();
  const { getCachedData, invalidateCache } = useCache();
  const [savedResources, setSavedResources] = useState<Record<string, boolean>>({});
  const [savingResources, setSavingResources] = useState<Record<string, boolean>>({});

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
  
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!user) return;
      
      try {
        // Use the cache system to fetch saved resources
        const cacheKey = `user_${user.id}_saved_resources`;
        
        const data = await getCachedData(
          cacheKey,
          async () => {
            const response = await fetch(`/api/saved-content/${user.id}`);
            if (!response.ok) throw new Error('Failed to fetch saved resources');
            return response.json();
          },
          // Cache for 5 minutes
          5 * 60 * 1000
        );
        
        const savedMap: Record<string, boolean> = {};
        
        data.forEach((item: any) => {
          if (item.content_type === 'resource') {
            savedMap[item.content_id] = true;
          }
        });
        
        setSavedResources(savedMap);
      } catch (error) {
        console.error('Error checking saved resources:', error);
      }
    };
    
    checkSavedStatus();
  }, [user, getCachedData]);
  
  const handleSaveResource = async (slug: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!user || savingResources[slug]) return;
    
    setSavingResources(prev => ({ ...prev, [slug]: true }));
    
    try {
      const isSaved = savedResources[slug];
      const method = isSaved ? 'DELETE' : 'POST';
      
      const response = await fetch(`/api/saved-content/${user.id}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content_id: slug,
          content_type: 'resource',
        }),
      });

      if (response.ok) {
        setSavedResources(prev => ({
          ...prev,
          [slug]: !isSaved
        }));
        
        // Invalidate the cache for saved resources
        invalidateCache(`user_${user.id}_saved_resources`);
        
        // Also invalidate any specific resource cache
        invalidateCache(`user_${user.id}_saved_resource_${slug}`);
        
        setTimeout(() => {
          setSavingResources(prev => ({ ...prev, [slug]: false }));
        }, 1000);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
        setSavingResources(prev => ({ ...prev, [slug]: false }));
      }
    } catch (error) {
      console.error('Error saving resource:', error);
      alert('Error al guardar el recurso');
      setSavingResources(prev => ({ ...prev, [slug]: false }));
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
        authorsLabel="Tipo"
        allAuthorsLabel="Todos los tipos"
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
              <div
                key={resource.slug}
                className="group block border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-teal-500 transition-all duration-300 cursor-pointer relative"
              >
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-teal-500 transition-colors">
                        {resource.title}
                      </h3>
                      <p className="text-gray-600 mt-2">{resource.excerpt}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {resource.type && getResourceIcon(resource.type)}
                      <FaExternalLinkAlt className="text-gray-400 group-hover:text-teal-500 transition-colors" />
                    </div>
                  </div>
                  
                  {resource.tags && resource.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {resource.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </a>
                
                {user && (
                  <button
                    onClick={(e) => handleSaveResource(resource.slug, e)}
                    className="absolute top-6 right-6 text-blue-500 hover:text-blue-600 transition-colors"
                    aria-label={savedResources[resource.slug] ? 'Quitar de guardados' : 'Guardar recurso'}
                    disabled={savingResources[resource.slug]}
                  >
                    {savedResources[resource.slug] ? 
                      <FaBookmark className="w-5 h-5" /> : 
                      <FaRegBookmark className="w-5 h-5" />}
                  </button>
                )}
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
    </div>
  );
}