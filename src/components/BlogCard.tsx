'use client';

    import Link from 'next/link';
    import { Article } from '@/utils/articles';
    import { FaStar, FaDownload } from 'react-icons/fa';
    import { useState } from 'react';
    import { useUser } from '@auth0/nextjs-auth0/client';

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
      author
    }: BlogCardProps) {
      if (!slug || !title) {
        return null;
      }

      const { user } = useUser();
      const [isSaved, setIsSaved] = useState(false);

      const handleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
          alert('Debes iniciar sesión para guardar como favorito.');
          return;
        }
        setIsSaved(!isSaved);
        console.log(`Save article: ${slug}`);
      };

      const handleDownload = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
          alert('Debes iniciar sesión para descargar el artículo.');
          return;
        }
        console.log(`Download article: ${slug}`);
      };

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
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className={`p-2 text-gray-500 hover:text-teal-500 transition-colors ${isSaved ? 'text-teal-500' : ''}`}
                title="Guardar como favorito"
              >
                <FaStar className="w-5 h-5" />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 text-gray-500 hover:text-teal-500 transition-colors"
                title="Descargar artículo"
              >
                <FaDownload className="w-5 h-5" />
              </button>
            </div>
          </div>
        </article>
      );
    }
