'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { MOCK_COURSES } from '@/data/courses';
import CourseCard from '@/components/CourseCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function CoursesCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);

  // Duplicate courses for infinite scroll effect
  const extendedCourses = [...MOCK_COURSES, ...MOCK_COURSES];

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { current } = carouselRef;
      const scrollAmount = 350; // Adjust based on card width
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { current } = carouselRef;
        // Check if we reached the end to loop back (simple reset)
        if (current.scrollLeft + current.clientWidth >= current.scrollWidth - 10) {
           current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
           scroll('right');
        }
      }
    }, 4000); // Auto-scroll every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
                Nuestros Cursos
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
            {/* Arrows */}
            <button 
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-30 p-4 rounded-full bg-white shadow-xl text-neutral-600 hover:text-primary-600 transition-all border border-neutral-100 opacity-0 group-hover:opacity-100 hidden md:block"
                aria-label="Scroll left"
            >
                <FaChevronLeft className="text-xl" />
            </button>
            
            <button 
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-30 p-4 rounded-full bg-white shadow-xl text-neutral-600 hover:text-primary-600 transition-all border border-neutral-100 opacity-0 group-hover:opacity-100 hidden md:block"
                aria-label="Scroll right"
            >
                <FaChevronRight className="text-xl" />
            </button>

            {/* Carousel items */}
            <div 
                ref={carouselRef}
                className="flex overflow-x-auto gap-6 pb-8 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {extendedCourses.map((course, index) => (
                    <div 
                        key={`${course.id}-${index}`} 
                        className="min-w-[280px] md:min-w-[320px] lg:min-w-[340px] snap-center h-full"
                    >
                        <CourseCard {...course} />
                    </div>
                ))}
            </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
            <Link
                href="/aprendizaje"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 rounded-xl font-semibold border-2 border-primary-200 hover:border-primary-400 hover:bg-primary-50 transition-all duration-300 hover:-translate-y-1 shadow-soft hover:shadow-soft-lg"
            >
                Ver todos los cursos
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
            </Link>
        </div>
      </div>
    </section>
  );
}
