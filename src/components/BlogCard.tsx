'use client';

import Link from 'next/link';
import { Article } from '@/utils/articles';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { useUser } from '@stackframe/stack';
import { useState, useEffect } from 'react';
import { useCache } from '@/utils/cache';
import Image from 'next/image';

type BlogCardProps = Partial<Article> & {
  slug: string;
  title: string;
};

interface BlogCardProps {
  slug: string;
  title: string;
  date?: string;
  excerpt?: string;
  tags?: string[];
  readTime?: string;
  author?: string;
  image?: string;
}

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
  const user = useUser();
  const { getCachedData, invalidateCache } = useCache();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!user) return;
      
      try {
        // Use the cache system to fetch saved status
        const cacheKey = `user_${user.id}_saved_article_${slug}`;
        
        const data = await getCachedData(
          cacheKey,
          async () => {
            const response = await fetch(`/api/saved-content/${user.id}?content_id=${slug}`);
            if (!response.ok) throw new Error('Failed to fetch saved status');
            return response.json();
          },
          // Cache for 5 minutes
          5 * 60 * 1000
        );
        
        setIsSaved(data.some((item: any) => item.content_id === slug));
      } catch (error) {
        console.error('Error checking saved status:', error);
      }
    };
    
    checkSavedStatus();
  }, [user, slug, getCachedData]);
  
  const handleSave = async () => {
    if (!user || isSaving) return;
    
    setIsSaving(true);
    try {
      const method = isSaved ? 'DELETE' : 'POST';
      const response = await fetch(`/api/saved-content/${user.id}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content_id: slug,
          content_type: 'article',
        }),
      });

      if (response.ok) {
        setIsSaved(!isSaved);
        
        // Invalidate the cache for this article's saved status
        invalidateCache(`user_${user.id}_saved_article_${slug}`);
        
        // Also invalidate any cached lists of saved content
        invalidateCache(`user_${user.id}_saved_content`);
        
        setTimeout(() => setIsSaving(false), 1000);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
        setIsSaving(false);
      }
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Error al guardar el contenido');
      setIsSaving(false);
    }
  };
  
  if (!slug || !title) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-lg hover:border-teal-500 transition-all duration-300 flex flex-col md:flex-row overflow-hidden">
      {/* Image column - exactly matching content height */}
      <div className="md:w-1/4 relative flex-shrink-0">
        <Image 
          src={image} 
          alt={title}
          width={250}
          height={250}
          className="object-cover h-full w-full"
          priority
        />
      </div>
      
      {/* Content column */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/articulos/${slug}`} className="block">
            <h2 className="text-2xl font-bold text-gray-800 hover:text-teal-500 transition-colors">
              {title}
            </h2>
          </Link>
          
          <button
            onClick={handleSave}
            className="ml-2 text-blue-500 hover:text-blue-600 transition-colors flex-shrink-0"
            aria-label={isSaved ? 'Quitar de guardados' : 'Guardar artículo'}
          >
            {isSaved ? <FaBookmark className="w-5 h-5" /> : <FaRegBookmark className="w-5 h-5" />}
          </button>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          {date && (
            <time dateTime={date}>
              {new Date(date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          )}
          {readTime && (
            <>
              <span>·</span>
              <span>{readTime} min de lectura</span>
            </>
          )}
          {author && (
            <>
              <span>·</span>
              <span>{author}</span>
            </>
          )}
        </div>
        
        {excerpt && <p className="text-gray-600 mb-4">{excerpt}</p>}
        
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto">
            {tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="text-gray-500 text-sm">
                +{tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
