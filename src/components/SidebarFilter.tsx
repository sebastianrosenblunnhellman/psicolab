'use client';

import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface SidebarFilterProps {
  tags: string[];
  authors: string[];
  selectedTag: string;
  selectedAuthor: string;
  onTagChange: (tag: string) => void;
  onAuthorChange: (author: string) => void;
  tagsLabel?: string;
  authorsLabel?: string;
  allTagsLabel?: string;
  allAuthorsLabel?: string;
}

export default function SidebarFilter({
  tags,
  authors,
  selectedTag,
  selectedAuthor,
  onTagChange,
  onAuthorChange,
  tagsLabel = 'Categorías',
  authorsLabel = 'Autores',
  allTagsLabel = 'Todas las categorías',
  allAuthorsLabel = 'Todos los autores',
}: SidebarFilterProps) {
  const [isTagsOpen, setIsTagsOpen] = useState(true);
  const [isAuthorsOpen, setIsAuthorsOpen] = useState(true);

  return (
    <div className="w-64 bg-white p-4 border-r border-gray-200">
      {/* Tags Filter */}
      <div className="mb-6">
        <button
          onClick={() => setIsTagsOpen(!isTagsOpen)}
          className="flex items-center justify-between w-full text-left font-semibold text-gray-700 mb-2"
        >
          <span>{tagsLabel}</span>
          {isTagsOpen ? (
            <FiChevronUp className="h-5 w-5" />
          ) : (
            <FiChevronDown className="h-5 w-5" />
          )}
        </button>
        {isTagsOpen && (
          <div className="space-y-2">
            <button
              onClick={() => onTagChange('')}
              className={`w-full text-left px-2 py-1 rounded ${selectedTag === '' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {allTagsLabel}
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagChange(tag)}
                className={`w-full text-left px-2 py-1 rounded ${selectedTag === tag ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Authors Filter */}
      <div className="mb-6">
        <button
          onClick={() => setIsAuthorsOpen(!isAuthorsOpen)}
          className="flex items-center justify-between w-full text-left font-semibold text-gray-700 mb-2"
        >
          <span>{authorsLabel}</span>
          {isAuthorsOpen ? (
            <FiChevronUp className="h-5 w-5" />
          ) : (
            <FiChevronDown className="h-5 w-5" />
          )}
        </button>
        {isAuthorsOpen && (
          <div className="space-y-2">
            <button
              onClick={() => onAuthorChange('')}
              className={`w-full text-left px-2 py-1 rounded ${selectedAuthor === '' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {allAuthorsLabel}
            </button>
            {authors.map((author) => (
              <button
                key={author}
                onClick={() => onAuthorChange(author)}
                className={`w-full text-left px-2 py-1 rounded ${selectedAuthor === author ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {author}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}