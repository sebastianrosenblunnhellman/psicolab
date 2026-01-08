'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/utils/articles';
import { useState } from 'react';
import LikeButton from './LikeButton';

type BlogCardProps = Partial<Article> & {
  slug: string;
  title: string;
  level?: string;
};

export default function BlogCard({
  slug,
  title,
  date,
  excerpt,
  tags,
  readTime,
  author,
  image = '/images/miniatura.jpg',
  level = 'Principiante'
}: BlogCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  if (!slug || !title) {
    return null;
  }

  return (
    <Link 
      href={`/articulos/${slug}`} 
      className="block group h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article className="bg-white rounded-2xl shadow-soft border border-neutral-100 hover:shadow-soft-lg hover:border-primary-200 transition-all duration-300 overflow-hidden h-full flex flex-col group-hover:-translate-y-1">
        {/* Image */}
        <div className="relative w-full pt-6 px-6 bg-neutral-50/50">
          <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-neutral-100 shadow-sm">
            <Image 
              src={image} 
              alt={title}
              width={1080}
              height={1080}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
          </div>

          {/* Like Button */}
          <div className="absolute top-8 right-8 z-10">
             <LikeButton slug={slug} title={title} type="article" className="shadow-soft" />
          </div>
          
          {/* Read time badge - Adjusted position or remove if conflicting, or move to left */}
          {readTime && (
            <div className="absolute top-8 left-8 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold text-neutral-700 shadow-soft z-10">
              {readTime} min
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Level Badge */}
          <div className="mb-3">
            <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide ${
              level === 'Avanzado' ? 'bg-rose-100 text-rose-700' :
              level === 'Intermedio' ? 'bg-amber-100 text-amber-700' :
              'bg-emerald-100 text-emerald-700'
            }`}>
              {level}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-neutral-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors leading-tight">
            {title}
          </h2>
          
          {/* Excerpt */}
          {excerpt && (
            <p className="text-sm text-neutral-600 mb-4 line-clamp-3 leading-relaxed flex-grow">
              {excerpt}
            </p>
          )}
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100 mt-auto">
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              {author && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {author.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-neutral-700">{author}</span>
                </div>
              )}
              {date && author && <span>·</span>}
              {date && (
                <time dateTime={date} className="text-neutral-500">
                  {new Date(date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              )}
            </div>

            {/* Read more indicator */}
            <div className="flex items-center gap-1 text-primary-600 font-medium text-sm">
              <span className="group-hover:translate-x-1 transition-transform">Leer</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
