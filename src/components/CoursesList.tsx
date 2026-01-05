'use client';

import { useState, useMemo } from 'react';
import PageHeader from '@/components/PageHeader';
import CourseCard from '@/components/CourseCard';
import { MOCK_COURSES } from '@/data/courses';

export default function CoursesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  const filteredCourses = useMemo(() => {
    return MOCK_COURSES.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <PageHeader 
        title="Centro de"
        highlightedTitle="Aprendizaje"
        description="Cursos, guías y talleres para potenciar tu desarrollo profesional"
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Buscar cursos por título, tema o instructor..."
        gradientFrom="from-yellow-500"
        gradientTo="to-orange-500"
      />

      <div className="container mx-auto px-4 pb-20 -mt-10 relative z-20">
        <div className="max-w-7xl mx-auto space-y-8">
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    {...course}
                  />
                ))}
              </div>
            ) : (
               <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-neutral-300 max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                   <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">No se encontraron cursos</h3>
                <p className="text-neutral-500">
                  Prueba ajustando tus criterios de búsqueda.
                </p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-6 text-primary-600 font-medium hover:text-primary-700"
                >
                  Limpiar búsqueda
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
