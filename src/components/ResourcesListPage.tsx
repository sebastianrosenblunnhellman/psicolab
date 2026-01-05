"use client";

import { useState, useMemo } from 'react';
import { Resource } from '@/utils/resources';
import ResourceCard from '@/components/ResourceCard';
import PageHeader from '@/components/PageHeader';

interface ResourcesListPageProps {
  initialResources: Resource[];
}

export default function ResourcesListPage({ initialResources }: ResourcesListPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const resourcesPerPage = 12; // Increased for full width grid

  // Filter by search term
  const filteredResources = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return initialResources.filter(resource => {
      return q === '' || resource.title.toLowerCase().includes(q) || resource.excerpt.toLowerCase().includes(q);
    });
  }, [initialResources, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredResources.length / resourcesPerPage);
  const paginatedResources = filteredResources.slice(
    (currentPage - 1) * resourcesPerPage,
    currentPage * resourcesPerPage
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <PageHeader 
        title="Materiales"
        highlightedTitle="Educativos"
        description="Materiales, guías y herramientas para profundizar tu conocimiento en psicología"
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Buscar materiales por título, tipo o contenido..."
        gradientFrom="from-accent-600"
        gradientTo="to-primary-500"
      />

      <div className="container mx-auto px-4 pb-20 -mt-10 relative z-20">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Lista en grid */}
          {paginatedResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                  tags={resource.tags}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-neutral-300 max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">No se encontraron materiales</h3>
              <p className="text-neutral-500">
                Prueba con otros términos de búsqueda.
              </p>
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-6 text-primary-600 font-medium hover:text-primary-700"
              >
                Limpiar búsqueda
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-12">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-neutral-200 text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 hover:border-neutral-300 transition-all"
              >
                &larr;
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-all ${
                    currentPage === i + 1
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-neutral-200 text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 hover:border-neutral-300 transition-all"
              >
                &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
