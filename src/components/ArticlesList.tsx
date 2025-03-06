'use client';

import { useState, useMemo } from 'react';
import BlogCard from './BlogCard';
import { Article } from '@/utils/articles';
import SidebarFilter from './SidebarFilter';

interface ArticlesListProps {
  initialArticles: Article[];
}

export default function ArticlesList({ initialArticles }: ArticlesListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const articlesPerPage = 4;

  // Get unique tags from all articles
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    initialArticles.forEach(article => {
      article.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [initialArticles]);

  // Get unique authors from all articles
  const allAuthors = useMemo(() => {
    const authors = new Set<string>();
    initialArticles.forEach(article => {
      if (article.author) {
        authors.add(article.author);
      }
    });
    return Array.from(authors).sort();
  }, [initialArticles]);

  // Filter articles based on search term, selected tag, and selected author
  const filteredArticles = useMemo(() => {
    return initialArticles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = selectedTag === '' || article.tags?.includes(selectedTag);
      const matchesAuthor = selectedAuthor === '' || article.author === selectedAuthor;
      return matchesSearch && matchesTag && matchesAuthor;
    });
  }, [initialArticles, searchTerm, selectedTag, selectedAuthor]);

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
    <div className="flex">
      {/* Sidebar Filter */}
      <SidebarFilter 
        tags={allTags}
        authors={allAuthors}
        selectedTag={selectedTag}
        selectedAuthor={selectedAuthor}
        onTagChange={handleTagChange}
        onAuthorChange={handleAuthorChange}
      />
      
      {/* Main Content */}
      <div className="flex-1 pl-6 space-y-8">
        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Buscar artículos..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Articles Grid */}
        {paginatedArticles.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
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
          <p className="text-center text-gray-600 py-8">
            No se encontraron artículos que coincidan con tu búsqueda.
          </p>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 disabled:opacity-50 hover:bg-gray-200 transition-colors"
            >
              Anterior
            </button>
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg ${
                    currentPage === page
                      ? 'bg-teal-500 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  } transition-colors`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 disabled:opacity-50 hover:bg-gray-200 transition-colors"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
