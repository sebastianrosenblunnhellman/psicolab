'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@stackframe/stack';
import { FaReply, FaEdit, FaTrash } from 'react-icons/fa';
import Image from 'next/image';

type Comment = {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  users_sync: {
    name: string | null;
    user_profile: {
      profile_picture_url: string | null;
    } | null;
  };
};

interface CommentsProps {
  articleId: string;
}

export default function Comments({ articleId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  // Fetch comments
  useEffect(() => {
    if (!articleId) return;
    
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/comments?articleId=${articleId}`);
        if (!response.ok) {
          throw new Error('Error al cargar los comentarios');
        }
        const data = await response.json();
        setComments(data);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('No se pudieron cargar los comentarios');
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [articleId]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle comment submission
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          articleId,
          content: newComment.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Error al publicar el comentario');
      }

      const addedComment = await response.json();
      
      // Refetch comments to get the latest with user info
      const updatedResponse = await fetch(`/api/comments?articleId=${articleId}`);
      const updatedComments = await updatedResponse.json();
      setComments(updatedComments);
      
      setNewComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
      setError('No se pudo publicar el comentario');
    } finally {
      setIsLoading(false);
    }
  };

  // Start editing a comment
  const handleStartEditing = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditedContent(comment.content);
  };

  // Cancel editing
  const handleCancelEditing = () => {
    setEditingCommentId(null);
    setEditedContent('');
  };

  // Update a comment
  const handleUpdateComment = async (commentId: number) => {
    if (!user || !editedContent.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          content: editedContent.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el comentario');
      }

      // Update local state
      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, content: editedContent.trim(), updated_at: new Date().toISOString() } 
          : comment
      ));
      
      setEditingCommentId(null);
      setEditedContent('');
    } catch (err) {
      console.error('Error updating comment:', err);
      setError('No se pudo actualizar el comentario');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId: number) => {
    if (!user || !window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/comments/${commentId}?userId=${user.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el comentario');
      }

      // Update local state
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('No se pudo eliminar el comentario');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mt-12 bg-gray-50 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Comentarios</h2>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {/* New comment form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
              Deja un comentario
            </label>
            <textarea
              id="comment"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe tu comentario aquí..."
              required
              disabled={isLoading}
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isLoading || !newComment.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Publicando...' : 'Publicar comentario'}
          </button>
        </form>
      ) : (
        <p className="mb-6 text-gray-600">
          <a href="/login" className="text-blue-600 hover:underline">Inicia sesión</a> para dejar un comentario.
        </p>
      )}
      
      {/* Comments list */}
      <div className="space-y-6">
        {isLoading && comments.length === 0 ? (
          <p className="text-gray-500">Cargando comentarios...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-500">No hay comentarios todavía. ¡Sé el primero en comentar!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white p-4 rounded-md shadow-sm">
              <div className="flex items-start gap-3">
                {/* User avatar */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                    {comment.users_sync?.user_profile?.profile_picture_url ? (
                      <Image
                        src={comment.users_sync.user_profile.profile_picture_url}
                        alt={`Avatar de ${comment.users_sync?.name || 'usuario'}`}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500">
                        {(comment.users_sync?.name || 'U').charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Comment content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-800">{comment.users_sync?.name || 'Usuario anónimo'}</h4>
                      <p className="text-xs text-gray-500">
                        {formatDate(comment.created_at)}
                        {comment.created_at !== comment.updated_at && ' (editado)'}
                      </p>
                    </div>
                    
                    {/* Edit/Delete buttons for comment owner */}
                    {user && user.id === comment.user_id && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStartEditing(comment)}
                          className="text-gray-500 hover:text-blue-600"
                          disabled={isLoading}
                          title="Editar comentario"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-gray-500 hover:text-red-600"
                          disabled={isLoading}
                          title="Eliminar comentario"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {editingCommentId === comment.id ? (
                    <div className="mt-2">
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        disabled={isLoading}
                      ></textarea>
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => handleUpdateComment(comment.id)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          disabled={isLoading || !editedContent.trim()}
                        >
                          Guardar
                        </button>
                        <button
                          onClick={handleCancelEditing}
                          className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                          disabled={isLoading}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1 text-gray-700 whitespace-pre-wrap">{comment.content}</div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
