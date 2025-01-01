'use client';

    import Link from 'next/link';
    import { useRef, useEffect } from 'react';
    import { FeaturedArticle } from '@/config/featured';

    const pastelColors = [
      'bg-rose-100',
      'bg-sky-100',
      'bg-lime-100',
      'bg-violet-100',
    ];

    interface FeaturedCarouselProps {
      articles: FeaturedArticle[];
    }

    export default function FeaturedCarousel({ articles }: FeaturedCarouselProps) {
      const carouselRef = useRef<HTMLDivElement>(null);
      const intervalRef = useRef<NodeJS.Timeout | null>(null);
      const scrollSpeed = 1; // Adjust for speed

      useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        const scrollCarousel = () => {
          if (carousel) {
            carousel.scrollLeft += scrollSpeed;
            if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth) {
              carousel.scrollLeft = 0;
            }
          }
        };

        intervalRef.current = setInterval(scrollCarousel, 30); // Adjust for smoothness

        return () => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        };
      }, []);

      const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        const target = e.currentTarget;
        target.classList.add('scale-105', 'shadow-lg', 'border-2', 'border-gray-200');
      };

      const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        target.classList.remove('scale-105', 'shadow-lg', 'border-2', 'border-gray-200');
        if (!intervalRef.current) {
          const carousel = carouselRef.current;
          if (!carousel) return;

          const scrollCarousel = () => {
            if (carousel) {
              carousel.scrollLeft += scrollSpeed;
              if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth) {
                carousel.scrollLeft = 0;
              }
            }
          };

          intervalRef.current = setInterval(scrollCarousel, 30);
        }
      };

      return (
        <div
          ref={carouselRef}
          className="relative flex overflow-x-auto scroll-smooth snap-x snap-mandatory py-4"
        >
          {articles.map((article, index) => (
            <div
              key={article.slug}
              className={`relative w-72 h-64 flex-shrink-0 snap-start rounded-lg overflow-hidden transition-all duration-300 ${pastelColors[index % pastelColors.length]} mx-2 last:mr-0 first:ml-0`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link href={`/articulos/${article.slug}`} className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-2xl font-bold text-gray-800 text-center px-4">
                  {article.title}
                </h3>
              </Link>
            </div>
          ))}
        </div>
      );
    }
