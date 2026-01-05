'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Article } from '@/utils/articles';
import Image from 'next/image';
import PageHeader from './PageHeader';
import BlogCard from '@/components/BlogCard';

interface ArticlesListProps {
  initialArticles: Article[];
}

// Removed local BlogCard component definition

export default function ArticlesList({ initialArticles }: ArticlesListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const articlesPerPage = 9; // Increased for full width grid

  // Filter articles based on search term
  const filteredArticles = useMemo(() => {
    return initialArticles.filter(article => {
      return article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [initialArticles, searchTerm]);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );
  
  // Reset to first page when filters change
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };
  
  const handleTagChange = (value: string) => {
    setSelectedTag(value);
    setCurrentPage(1);
  };

  const handleAuthorChange = (value: string) => {
    setSelectedAuthor(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <PageHeader 
        title="Explora nuestro"
        highlightedTitle="Blog"
        description="Descubre contenido basado en evidencia científica sobre psicología y ciencias del comportamiento"
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Buscar artículos por título, tema o contenido..."
      />

      <div className="container mx-auto px-4 pb-20 -mt-10 relative z-20">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Articles Grid */}
          {paginatedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedArticles.map((article) => (
                <BlogCard 
                  key={article.slug}
                  slug={article.slug}
                  title={article.title}
                  date={article.date}
                  excerpt={article.excerpt}
                  tags={article.tags}
                  image={article.image}
                  readTime={article.readTime}
                  author={article.author}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-neutral-300 max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">No se encontraron artículos</h3>
              <p className="text-neutral-500">
                Intenta ajustar tu búsqueda para encontrar lo que buscas.
              </p>
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-6 text-primary-600 font-medium hover:text-primary-700"
              >
                Limpiar búsqueda
              </button>
            </div>
          )}
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-12">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-neutral-200 text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 hover:border-neutral-300 transition-all"
              >
                &larr;
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-all ${
                    currentPage === i + 1
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-neutral-200 text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 hover:border-neutral-300 transition-all"
              >
                &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}