'use client';

import Link from 'next/link';
import { Article } from '@/utils/articles';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { useUser } from '@stackframe/stack';
import { useState, useEffect } from 'react';

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
}

export default function BlogCard({
  slug,
  title,
  date,
  excerpt,
  tags,
  readTime,
  author
}: BlogCardProps) {
  const user = useUser();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!user) return;
      
      try {
        const response = await fetch(`/api/saved-content/${user.id}?content_id=${slug}`);
        if (response.ok) {
          const data = await response.json();
          setIsSaved(data.some((item: any) => item.content_id === slug));
        }
      } catch (error) {
        console.error('Error checking saved status:', error);
      }
    };
    
    checkSavedStatus();
  }, [user, slug]);
  
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
    <article className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <Link href={`/articulos/${slug}`} className="block">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 hover:text-teal-500 transition-colors">
          {title}
        </h2>
      </Link>
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
      <div className="flex justify-between items-center mb-4">
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <button
          onClick={handleSave}
          className="text-blue-500 hover:text-blue-600 transition-colors"
          aria-label={isSaved ? 'Quitar de guardados' : 'Guardar artículo'}
        >
          {isSaved ? <FaBookmark className="w-5 h-5" /> : <FaRegBookmark className="w-5 h-5" />}
        </button>
      </div>
    </article>
  );
}
