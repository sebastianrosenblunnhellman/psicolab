'use client';

import { useState, useEffect } from 'react';
import { Article } from '@/utils/articles'; // Article type
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { useUser } from '@stackframe/stack';

interface ArticleClientWrapperProps {
  article: Article;
}

export default function ArticleClientWrapper({ article }: ArticleClientWrapperProps) {
  // Add any client-side state and effects here
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useUser();
  
  // Any client-side effects
  useEffect(() => {
    const fetchSaved = async () => {
      if (!user) return;
      try {
        const res = await fetch(`/api/saved-content/${user.id}`);
        if (!res.ok) return;
        const data = await res.json();
        setIsBookmarked(!!data.find((i: any) => i.content_id === article.slug && i.content_type === 'article'));
      } catch {}
    };
    fetchSaved();
  }, [article.slug, user]);

  // Client-side event handlers
  const handleBookmarkClick = async () => {
    if (!user) return;
    if (loading) return;
    setLoading(true);
    try {
      if (isBookmarked) {
        const res = await fetch(`/api/saved-content/${user.id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content_id: article.slug }),
        });
        if (res.ok) setIsBookmarked(false);
      } else {
        const res = await fetch(`/api/saved-content/${user.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content_id: article.slug }),
        });
        if (res.ok) setIsBookmarked(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="article-client-wrapper">
      <div className="article-interactions">
        <button
          onClick={handleBookmarkClick}
          className="bookmark-button"
          aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          {/* Icon-only, keep text for screen readers only */}
          {isBookmarked ? (
            <FaBookmark className="w-4 h-4" />
          ) : (
            <FaRegBookmark className="w-4 h-4" />
          )}
          <span className="sr-only">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
        </button>
        {/* Other client-side interactive elements */}
      </div>
      
      {/* Remove or modify any incorrect usage of dangerouslySetInnerHTML here */}
      <div className="article-client-content">
        {/* Client-specific article rendering if needed */}
      </div>
    </div>
  );
}
