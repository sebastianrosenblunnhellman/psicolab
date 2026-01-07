'use client';

import { useState } from 'react';
import { toggleLike } from '@/actions/content-actions';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface ArticleActionsProps {
  title: string;
  slug: string;
  initialIsLiked?: boolean;
  type?: 'article' | 'material';
}

export default function ArticleActions({ title, slug, initialIsLiked = false, type = 'article' }: ArticleActionsProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLike = async () => {
    setLoading(true);
    // Optimistic update
    const previousState = isLiked;
    setIsLiked(!isLiked);

    const result = await toggleLike(slug, title, type);

    if (result.error) {
       // Revert if error
       setIsLiked(previousState);
       // Maybe show toast?
       if (result.error === "Debes iniciar sesión") {
           router.push('/login');
       }
    } else if (result.isLiked !== undefined) {
        setIsLiked(result.isLiked);
    }
    setLoading(false);
  };

  return (
    <div className="my-6 flex items-center justify-between border-t border-b border-gray-100 py-4">
      <div className="flex items-center gap-4">
        <button
          onClick={handleLike}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
            isLiked 
              ? 'bg-red-50 text-red-600 hover:bg-red-100' 
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
          title={isLiked ? "Quitar de favoritos" : "Guardar en favoritos"}
        >
          {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
          <span className="font-medium">{isLiked ? 'Guardado' : 'Guardar'}</span>
        </button>
      </div>
      
      {/* Share placeholder if needed */}
      <div className="text-sm text-gray-400">
         {/* Share buttons could go here */}
      </div>
    </div>
  );
}
