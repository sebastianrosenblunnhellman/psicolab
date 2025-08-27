'use client';

import { useState, useMemo, useEffect } from 'react';
import { Course } from '@/utils/courses';
import SidebarFilter from './SidebarFilter';
import CourseCard from './CourseCard';
import { useUser } from '@stackframe/stack';
import { useCache } from '@/utils/cache';
import FilteredLayout from './FilteredLayout';

interface CoursesListProps {
  initialCourses: Course[];
}

export default function CoursesList({ initialCourses }: CoursesListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedNivel, setSelectedNivel] = useState('');
  const coursesPerPage = 4;
  const user = useUser();
  const { getCachedData, invalidateCache } = useCache();

  // Available tags based on search + selectedNivel
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    initialCourses
      .filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(c => selectedNivel === '' || c.nivel === selectedNivel)
      .forEach(c => c.tags?.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [initialCourses, searchTerm, selectedNivel]);

  // Available niveles based on search + selectedTag
  const availableNiveles = useMemo(() => {
    const niveles = new Set<string>();
    initialCourses
      .filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(c => selectedTag === '' || c.tags?.includes(selectedTag))
      .forEach(c => { if (c.nivel) niveles.add(c.nivel); });
    return Array.from(niveles).sort();
  }, [initialCourses, searchTerm, selectedTag]);

  // Keep selections valid
  useEffect(() => {
    if (selectedTag && !availableTags.includes(selectedTag)) setSelectedTag('');
  }, [availableTags, selectedTag]);
  useEffect(() => {
    if (selectedNivel && !availableNiveles.includes(selectedNivel)) setSelectedNivel('');
  }, [availableNiveles, selectedNivel]);

  // Saving courses is disabled; UI simplified.

  // Filter courses based on search term, selected tag, and selected nivel
  const filteredCourses = useMemo(() => {
    return initialCourses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = selectedTag === '' || course.tags?.includes(selectedTag);
      const matchesNivel = selectedNivel === '' || course.nivel === selectedNivel;
      return matchesSearch && matchesTag && matchesNivel;
    });
  }, [initialCourses, searchTerm, selectedTag, selectedNivel]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
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

  const handleNivelChange = (value: string) => {
    setSelectedNivel(value);
    setCurrentPage(1);
  };

  return (
    <FilteredLayout
      filterComponent={
        <SidebarFilter
    tags={availableTags}
    authors={availableNiveles}
          selectedTag={selectedTag}
          selectedAuthor={selectedNivel}
          onTagChange={handleTagChange}
          onAuthorChange={handleNivelChange}
          authorsLabel="Nivel"
          allAuthorsLabel="Todos los niveles"
        />
      }
    >
      {/* Main Content */}
      <div className="space-y-8">
        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Buscar cursos..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Courses Grid */}
        {paginatedCourses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:gap-8">
            {paginatedCourses.map((course) => (
              <CourseCard
                key={course.slug}
                id={course.slug}
                title={course.title}
                description={course.excerpt}
                duration={course.courseTime}
                level={course.nivel}
                tags={course.tags}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No se encontraron cursos que coincidan con los criterios de búsqueda.</p>
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