'use client';

import { useState, useEffect } from 'react';
import { toggleLike, getContentLikeStatus } from '@/actions/content-actions';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

interface LikeButtonProps {
  slug: string;
  title: string;
  type: 'article' | 'material';
  className?: string;
}

export default function LikeButton({ slug, title, type, className = '' }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check initial status
    getContentLikeStatus(slug, type).then(status => {
      setIsLiked(status.isLiked);
    });
  }, [slug, type]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation if inside a card link
    e.stopPropagation();
    
    setLoading(true);
    const previousState = isLiked;
    setIsLiked(!isLiked);

    const result = await toggleLike(slug, title, type);

    if (result.error) {
       setIsLiked(previousState);
       // Optional: Toast error
    } else if (result.isLiked !== undefined) {
        setIsLiked(result.isLiked);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`p-2 rounded-full transition-colors z-20 relative ${className} ${
        isLiked ? 'text-red-500 bg-red-50 hover:bg-red-100' : 'text-gray-400 bg-white/80 hover:bg-white hover:text-red-400'
      }`}
      title={isLiked ? "Quitar de favoritos" : "Guardar en favoritos"}
    >
      {isLiked ? <FaHeart /> : <FaRegHeart />}
    </button>
  );
}
