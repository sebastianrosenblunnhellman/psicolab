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
  const [selectedType, setSelectedType] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const resourcesPerPage = 8;

  // Available types (from front matter "type")
  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    initialResources.forEach(r => r.type && types.add(r.type));
    return Array.from(types).sort();
  }, [initialResources]);

  // Available authors (from front matter "author")
  const availableAuthors = useMemo(() => {
    const authors = new Set<string>();
    initialResources.forEach(r => r.author && authors.add(r.author));
    return Array.from(authors).sort();
  }, [initialResources]);

  // Filter by search term and type
  const filteredResources = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return initialResources.filter(resource => {
      const matchesType = selectedType === '' || resource.type === selectedType;
      const matchesAuthor = selectedAuthor === '' || resource.author === selectedAuthor;
      const matchesSearch = q === '' || resource.title.toLowerCase().includes(q) || resource.excerpt.toLowerCase().includes(q);
      return matchesType && matchesAuthor && matchesSearch;
    });
  }, [initialResources, selectedType, selectedAuthor, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredResources.length / resourcesPerPage);
  const paginatedResources = filteredResources.slice(
    (currentPage - 1) * resourcesPerPage,
    currentPage * resourcesPerPage
  );

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setCurrentPage(1);
  };
  const handleAuthorChange = (value: string) => {
    setSelectedAuthor(value);
    setCurrentPage(1);
  };
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <FilteredLayout
      filterComponent={
        <SidebarFilter
          // Usamos 'authors' para representar listas genéricas; aquí pasamos tipos y autores reales.
          authors={[...availableTypes]}
          selectedAuthor={selectedType}
          onAuthorChange={handleTypeChange}
          authorsLabel="Tipo"
          allAuthorsLabel="Todos los tipos"
          // Añadimos un segundo bloque como 'tags' para autores reales (aprovechamos el componente existente)
          tags={[...availableAuthors]}
          selectedTag={selectedAuthor}
          onTagChange={handleAuthorChange}
          tagsLabel="Autor"
          allTagsLabel="Todos los autores"
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

        {/* Lista vertical de cards (misma forma que artículos) */}
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
                tags={resource.tags}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 py-8">
            No se encontraron recursos con el filtro seleccionado.
          </p>
        )}
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 sm:gap-4 mt-6">
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
