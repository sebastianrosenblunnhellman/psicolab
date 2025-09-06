'use client';

import Link from 'next/link';
import { Article } from '@/utils/articles';
import { useState, useEffect } from 'react';
import Image from 'next/image';

type BlogCardProps = Partial<Article> & {
  slug: string;
  title: string;
};

export default function BlogCard({
  slug,
  title,
  date,
  excerpt,
  tags,
  readTime,
  author,
  image = '/images/miniatura.jpg'
}: BlogCardProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Saved status removed
  
  // Save/unsave removed
  
  if (!slug || !title) {
    return null;
  }

  return (
    <Link 
      href={`/articulos/${slug}`} 
      className="block h-auto md:h-48"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-lg hover:border-teal-500 transition-all duration-300 flex flex-col md:flex-row overflow-hidden h-full">
        {/* Image column - square shape */}
        <div className="relative w-full md:w-48 aspect-square md:aspect-auto md:h-full flex-shrink-0">
          <Image 
            src={image} 
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 192px"
            className="object-cover"
            priority
          />
        </div>
        
        {/* Content column */}
        <div className="p-3 flex flex-col flex-grow overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-lg font-bold text-gray-800 hover:text-teal-500 transition-colors line-clamp-2">
              {title}
            </h2>
            
            {/* Bookmark removed */}
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
            {date && (
              <time dateTime={date}>
                {new Date(date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
            )}
            {readTime && (
              <>
                <span>·</span>
                <span>{readTime} min</span>
              </>
            )}
            {author && (
              <>
                <span>·</span>
                <span className="truncate">{author}</span>
              </>
            )}
          </div>
          
          {excerpt && <p className="text-sm text-gray-600 mb-2 line-clamp-2">{excerpt}</p>}
          
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto">
              {tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 2 && (
                <span className="text-gray-500 text-xs">
                  +{tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
