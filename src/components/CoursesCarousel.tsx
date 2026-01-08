'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { Course } from '@/utils/courses';
import CourseCard from '@/components/CourseCard';
import { FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa';

interface CoursesCarouselProps {
  courses: Course[];
}

export default function CoursesCarousel({ courses }: CoursesCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  // Duplicate courses for infinite scroll effect
  const extendedCourses = courses.length > 0 ? [...courses, ...courses] : [];

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
    if (extendedCourses.length === 0) return;

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
  }, [extendedCourses.length]);

  if (courses.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
                    Nuestros Cursos
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></div>
            </div>

            <Link 
                href="/cursos"
                className="hidden sm:inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors group"
            >
                Ver todos
                <span className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                     <FaArrowRight className="w-3 h-3 text-primary-600 group-hover:translate-x-0.5 transition-transform" />
                </span>
            </Link>
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
                        key={`${course.slug}-${index}`} 
                        className="min-w-[280px] md:min-w-[320px] lg:min-w-[340px] snap-center h-full"
                    >
                        <CourseCard {...course} />
                    </div>
                ))}
            </div>
        </div>

        {/* View All Button (Mobile) */}
        <div className="mt-4 sm:hidden">
            <Link
                href="/cursos"
                className="block w-full py-3 text-center bg-primary-50 text-primary-700 rounded-xl font-semibold hover:bg-primary-100 transition-colors"
            >
                Ver todos los cursos
            </Link>
        </div>
      </div>
    </section>
  );
}