'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Article } from '@/utils/articles';
import SidebarFilter from './SidebarFilter';
import Image from 'next/image';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { useUser } from '@stackframe/stack';
import { useCache } from '@/utils/cache';
import FilteredLayout from './FilteredLayout';

interface ArticlesListProps {
  initialArticles: Article[];
}

interface BlogCardProps {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
  image?: string;
  readTime: number;
  author: string;
}

function BlogCard({ slug, title, date, excerpt, tags, image = '/images/miniatura.jpg', readTime, author }: BlogCardProps) {
  const user = useUser();
  const { getCachedData, invalidateCache } = useCache();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Check if the article is saved
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
          5 * 60 * 1000
        );
        
        setIsSaved(data.some((item: any) => item.content_id === slug));
      } catch (error) {
        console.error('Error checking saved status:', error);
      }
    };
    
    checkSavedStatus();
  }, [user, slug, getCachedData]);
  
  // Handle save/unsave
  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
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
        invalidateCache(`user_${user.id}_saved_article_${slug}`);
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
  
  return (
    <Link
      href={`/articulos/${slug}`}
      className="block h-48"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-lg hover:border-teal-500 transition-all duration-300 flex flex-col md:flex-row overflow-hidden h-full">
        {/* Image column - square shape */}
        <div className="md:w-48 w-full h-full relative flex-shrink-0">
          <Image 
            src={image} 
            alt={title}
            width={192}
            height={192}
            className="object-cover h-full w-full"
            priority
          />
        </div>
        
        {/* Content column */}
        <div className="p-3 flex flex-col flex-grow overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-900 hover:text-teal-500 transition-colors line-clamp-2">{title}</h3>
            
            {user && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleSaveClick(e);
                }}
                className={`ml-2 transition-colors flex-shrink-0 ${isHovered ? 'opacity-100' : 'opacity-70'} ${isSaved ? 'text-teal-500 hover:text-teal-600' : 'text-gray-400 hover:text-teal-500'}`}
                title={isSaved ? 'Quitar de guardados' : 'Guardar artículo'}
              >
                {isSaved ? <FaBookmark className="w-4 h-4" /> : <FaRegBookmark className="w-4 h-4" />}
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap items-center text-xs text-gray-600 mb-2">
            <span>{new Date(date).toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <span>{author}</span>
            <span className="mx-2">•</span>
            <span>{readTime} min de lectura</span>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2">{excerpt}</p>
          
          {tags && tags.length > 0 && (
            <div className="mt-auto flex flex-wrap gap-1">
              {tags.slice(0, 2).map(tag => (
                <span 
                  key={tag} 
                  className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 2 && (
                <span className="text-gray-500 text-xs">
                  +{tags.length - 2} más
                </span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
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
    <FilteredLayout
      filterComponent={
        <SidebarFilter 
          tags={allTags}
          authors={allAuthors}
          selectedTag={selectedTag}
          selectedAuthor={selectedAuthor}
          onTagChange={handleTagChange}
          onAuthorChange={handleAuthorChange}
        />
      }
    >
      <div className="flex-1 space-y-6">
        {/* Search Bar */}
        <div>
          <input
            type="text"
            placeholder="Buscar artículos..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        
        {/* Selected filters indicator on mobile */}
        {(selectedTag || selectedAuthor) && (
          <div className="lg:hidden flex flex-wrap gap-2 bg-gray-50 p-3 rounded-lg">
            <span className="text-sm text-gray-700">Filtros:</span>
            {selectedTag && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center">
                {selectedTag}
              </span>
            )}
            {selectedAuthor && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center">
                {selectedAuthor}
              </span>
            )}
          </div>
        )}

        {/* Articles Grid */}
        {paginatedArticles.length > 0 ? (
          <div className="flex flex-col space-y-6">
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
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 disabled:opacity-50 hover:bg-gray-200 transition-colors"
            >
              Anterior
            </button>
            <span className="text-gray-600">
              Página {currentPage} de {totalPages}
            </span>
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
    </FilteredLayout>
  );
}