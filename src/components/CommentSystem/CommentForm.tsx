'use client';

import { useState } from 'react';
import { FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { postComment } from '@/actions/comment-actions';
import Avatar from '../Avatar';

interface CommentFormProps {
  articleSlug: string;
  parentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  userImage?: string | null;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function CommentForm({ 
  articleSlug, 
  parentId, 
  onSuccess, 
  onCancel, 
  userImage,
  placeholder = "Escribe un comentario...",
  autoFocus = false
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    const result = await postComment(articleSlug, content, parentId);

    if (result.error) {
      setError(result.error);
    } else {
      setContent('');
      if (onSuccess) onSuccess();
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-4 items-start w-full">
      <div className="flex-shrink-0 pt-1">
        <Avatar src={userImage} size="sm" />
      </div>
      <form onSubmit={handleSubmit} className="flex-grow">
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white resize-none text-sm min-h-[80px]"
            placeholder={placeholder}
            autoFocus={autoFocus}
            disabled={loading}
          />
        </div>
        
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        
        <div className="flex justify-end gap-2 mt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-primary-700 transition-all shadow-soft hover:shadow-soft-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
            {parentId ? 'Responder' : 'Comentar'}
          </button>
        </div>
      </form>
    </div>
  );
}
