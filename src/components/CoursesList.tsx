'use client';

import { useState, useMemo } from 'react';
import { Course } from '@/utils/courses';
import SidebarFilter from './SidebarFilter';
import Link from 'next/link';
import { FaBook, FaClock, FaGraduationCap } from 'react-icons/fa';

interface CoursesListProps {
  initialCourses: Course[];
}

export default function CoursesList({ initialCourses }: CoursesListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedNivel, setSelectedNivel] = useState('');
  const coursesPerPage = 4;

  // Get unique tags from all courses
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    initialCourses.forEach(course => {
      course.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [initialCourses]);

  // Get unique niveles from all courses
  const allNiveles = useMemo(() => {
    const niveles = new Set<string>();
    initialCourses.forEach(course => {
      if (course.nivel) {
        niveles.add(course.nivel);
      }
    });
    return Array.from(niveles).sort();
  }, [initialCourses]);

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
    <div className="flex">
      {/* Sidebar Filter */}
      <SidebarFilter
        tags={allTags}
        authors={allNiveles}
        selectedTag={selectedTag}
        selectedAuthor={selectedNivel}
        onTagChange={handleTagChange}
        onAuthorChange={handleNivelChange}
      />
      
      {/* Main Content */}
      <div className="flex-1 pl-6 space-y-8">
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
          <div className="grid grid-cols-1 gap-8">
            {paginatedCourses.map((course) => (
              <div key={course.slug} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      <Link href={`/aprendizaje/${course.slug}`} className="hover:text-blue-600 transition-colors duration-200">
                        {course.title}
                      </Link>
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{course.excerpt}</p>
                  
                  <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4">
                    {course.courseTime && (
                      <div className="flex items-center">
                        <FaClock className="mr-1" />
                        <span>{course.courseTime}</span>
                      </div>
                    )}
                    
                    {course.nivel && (
                      <div className="flex items-center">
                        <FaGraduationCap className="mr-1" />
                        <span>Nivel: {course.nivel}</span>
                      </div>
                    )}
                    
                    {course.author && (
                      <div className="flex items-center">
                        <span>Por: {course.author}</span>
                      </div>
                    )}
                  </div>
                  
                  {course.tags && course.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {course.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          onClick={() => handleTagChange(tag)}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
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
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                Anterior
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === page ? 'bg-blue-50 text-blue-600 z-10' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
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