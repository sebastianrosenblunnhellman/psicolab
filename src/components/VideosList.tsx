'use client';

import { useState, useMemo } from 'react';
import VideoCard from './VideoCard';
import { Video } from '@/utils/videos';

interface VideosListProps {
  initialVideos: Video[];
}

export default function VideosList({ initialVideos }: VideosListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const videosPerPage = 6;

  // Get unique tags from all videos
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    initialVideos.forEach(video => {
      video.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [initialVideos]);

  // Filter videos based on search term and selected tag
  const filteredVideos = useMemo(() => {
    return initialVideos.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = selectedTag === '' || video.tags?.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [initialVideos, searchTerm, selectedTag]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
  const paginatedVideos = filteredVideos.slice(
    (currentPage - 1) * videosPerPage,
    currentPage * videosPerPage
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

  return (
    <div className="space-y-8">
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        <div className="flex-1 w-full md:w-auto">
          <input
            type="text"
            placeholder="Buscar videos..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={selectedTag}
            onChange={(e) => handleTagChange(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Videos Grid */}
      {paginatedVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedVideos.map((video) => (
            <VideoCard key={video.slug} video={video} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 py-8">
          No se encontraron videos que coincidan con tu búsqueda.
        </p>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 disabled:opacity-50 hover:bg-gray-200 transition-colors"
          >
            Anterior
          </button>
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 disabled:opacity-50 hover:bg-gray-200 transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
