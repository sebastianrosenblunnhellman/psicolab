'use client';

import { useState } from 'react';
import { toggleLike } from '@/actions/content-actions';
import { FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface RemoveSavedItemButtonProps {
  slug: string;
  title: string;
  type: 'article' | 'material';
}

export default function RemoveSavedItemButton({ slug, title, type }: RemoveSavedItemButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();

    if (!confirm('¿Estás seguro de que deseas eliminar este contenido de tus guardados?')) {
      return;
    }

    setLoading(true);
    try {
      await toggleLike(slug, title, type);
      router.refresh(); // Refresh to remove the item from the list
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Error al eliminar el contenido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRemove}
      disabled={loading}
      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
      title="Eliminar de guardados"
    >
      <FaTrash className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
    </button>
  );
}
