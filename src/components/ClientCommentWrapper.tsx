'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@stackframe/stack';

interface Reply {
  id: string;
  articleId: string;
  userId: string;
  userName: string;
  avatarUrl?: string | null;
  content: string;
  createdAt: string;
  updatedAt?: string;
  parentId?: string | null;
}

interface Comment extends Reply {
  replies?: Reply[];
}

interface ClientCommentWrapperProps {
  articleId: string;
}

export default function ClientCommentWrapper({ articleId }: ClientCommentWrapperProps) {
  const user = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch comments for the article
    const fetchComments = async () => {
      if (!articleId) return;
      
      setIsLoading(true);
      setError(null);
      setConnectionError(null);
      
      try {
        console.log('Fetching comments for article:', articleId);
        // Add timestamp to prevent caching issues
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/comments?articleId=${articleId}&t=${timestamp}`);
        
        const responseData = await response.json().catch(() => null);
        
        if (!response.ok) {
          console.error('Error response:', responseData);
          throw new Error(`Error ${response.status}: ${responseData?.error || response.statusText}`);
        }
        
  console.log('Received comments (threads):', responseData);
  setComments(responseData || []);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setError('No se pudieron cargar los comentarios');
  if ((error as any)?.toString?.().includes('fetch')) {
          setConnectionError('Error de conexión con el servidor');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Debes iniciar sesión para comentar');
      return;
    }

    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    setError(null);
    setConnectionError(null);
    
    try {
      console.log('Posting comment for article:', articleId);
      console.log('User info:', { 
        id: user.id,
        displayName: user.displayName,
      });
      
      // Add a small delay to avoid race conditions with database operations
      await new Promise(resolve => setTimeout(resolve, 100));
      
    const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleId,
          content: newComment,
          userId: user.id,
          userName: user.displayName || 'Usuario'
        }),
      });
      
      const responseData = await response.json().catch(() => null);
      
      if (!response.ok) {
        console.error('Error response data:', responseData);
        throw new Error(`Error ${response.status}: ${responseData?.error || response.statusText}`);
      }
      
      console.log('Comment posted successfully:', responseData);
      
  // For top-level comments, prepend to list
  setComments(prev => [responseData, ...prev]);
      setNewComment('');
      
      // Scroll to the newly added comment
      setTimeout(() => {
        document.getElementById('comments-heading')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Error posting comment:', error);
      setError('Error al enviar el comentario. Por favor intenta nuevamente.');
  if ((error as any)?.toString?.().includes('fetch')) {
        setConnectionError('Error de conexión con el servidor');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (commentId: string) => {
    if (!user || !replyText.trim()) return;

    setIsSubmitting(true);
    setError(null);
    setConnectionError(null);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          content: replyText,
          userId: user.id,
          userName: user.displayName || 'Usuario',
          parentId: commentId,
        }),
      });

      const responseData = await response.json().catch(() => null);
      if (!response.ok) throw new Error(`Error ${response.status}`);

      // Insert reply into the correct thread
      setComments(prev => prev.map(c => c.id === commentId ? {
        ...c,
        replies: [...(c.replies || []), responseData],
      } : c));

      setReplyText('');
      setReplyingToId(null);
    } catch (error) {
      console.error('Error posting reply:', error);
      setError('Error al enviar la respuesta');
  if ((error as any)?.toString?.().includes('fetch')) setConnectionError('Error de conexión con el servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comments-container">
      {connectionError && (
        <div className="bg-red-50 p-4 mb-4 rounded-md border border-red-200">
          <p className="text-red-600">{connectionError}</p>
          <p className="text-sm text-gray-600 mt-2">
            Comprueba tu conexión a internet o inténtalo de nuevo más tarde.
          </p>
        </div>
      )}
      
  <div className="comments-list space-y-6 mb-8">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-gray-800">{comment.userName}</h4>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">{comment.content}</p>
              <div className="mt-3">
                <button
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                >
                  {replyingToId === comment.id ? 'Cancelar' : 'Responder'}
                </button>
              </div>

              {replyingToId === comment.id && (
                <div className="mt-3">
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    rows={3}
                    placeholder="Escribe una respuesta..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <button
                    className="mt-2 px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
                    disabled={isSubmitting || !replyText.trim()}
                    onClick={() => handleReplySubmit(comment.id)}
                  >
                    {isSubmitting ? 'Enviando...' : 'Responder'}
                  </button>
                </div>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 space-y-3 pl-4 border-l-2 border-gray-200">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="bg-white p-3 rounded border border-gray-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-semibold text-gray-800 text-sm">{reply.userName}</h5>
                          <span className="text-xs text-gray-500">{new Date(reply.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                      <p className="mt-1 text-gray-700 text-sm whitespace-pre-wrap">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p id="no-comments-message" className="text-gray-500 text-center py-4">No hay comentarios aún. ¡Sé el primero!</p>
        )}
      </div>
      
      {/* Comment form moved below the comments list */}
      {user ? (
        <form onSubmit={handleSubmit} className="mt-8">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Escribe un comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          ></textarea>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar comentario'}
          </button>
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </form>
      ) : (
        <div className="bg-gray-100 p-4 rounded-lg mt-8">
          <p className="text-gray-600">Inicia sesión para comentar</p>
        </div>
      )}
    </div>
  );
}
