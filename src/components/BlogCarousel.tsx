'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import BlogCard from '@/components/BlogCard';
import { FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa';

interface BlogCarouselProps {
  articles: any[];
}

export default function BlogCarousel({ articles }: BlogCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

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
        if (current.scrollLeft + current.clientWidth >= current.scrollWidth - 10) {
           current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
           scroll('right');
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
                    Últimas entradas del Blog
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></div>
            </div>

            <Link 
                href="/articulos"
                className="hidden sm:inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors group"
            >
                Ver todo el Blog
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
                className="flex overflow-x-auto gap-8 pb-8 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {articles.map((article, index) => (
                    <div 
                        key={`${article.slug}-${index}`}
                        className="min-w-[280px] md:min-w-[320px] lg:min-w-[340px] snap-center animate-fadeIn h-full"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <BlogCard
                            slug={article.slug}
                            title={article.title}
                            date={article.date}
                            excerpt={article.excerpt}
                            tags={article.tags}
                            readTime={article.readTime}
                            author={article.author}
                            image={article.image}
                        />
                    </div>
                ))}
            </div>
        </div>

        {/* View All Button (Mobile) */}
        <div className="mt-8 sm:hidden">
            <Link
                href="/articulos"
                className="block w-full py-3 text-center bg-primary-50 text-primary-700 rounded-xl font-semibold hover:bg-primary-100 transition-colors"
            >
                Ver todo el Blog
            </Link>
        </div>
      </div>
    </section>
  );
}