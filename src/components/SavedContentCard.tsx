'use client';

import Link from 'next/link';
import { FaTrash } from 'react-icons/fa';
import Image from 'next/image';

interface SavedContentCardProps {
  id: number;
  content_id: string;
  content_type: string;
  saved_at: string;
  title?: string;
  excerpt?: string;
  onDelete?: (id: number) => void;
  image?: string;
}

export default function SavedContentCard({
  id,
  content_id,
  content_type,
  saved_at,
  title,
  excerpt,
  onDelete,
  image = '/images/miniatura.jpg'
}: SavedContentCardProps) {
  const getContentLink = () => {
    switch (content_type) {
      case 'article':
        return `/articulos/${content_id}`;
      case 'course':
        return `/aprendizaje/${content_id}`;
      case 'resource':
        return `/recursos/${content_id}`;
      default:
        return '#';
    }
  };

  const getContentTypeLabel = () => {
    switch (content_type) {
      case 'article':
        return 'Artículo';
      case 'course':
        return 'Curso';
      case 'resource':
        return 'Recurso';
      default:
        return content_type;
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este contenido guardado?')) {
      onDelete?.(id);
    }
  };

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-lg hover:border-teal-500 transition-all duration-300 mb-4 w-full flex flex-col md:flex-row overflow-hidden h-48">
      {/* Image column - square shape */}
      <div className="md:w-48 w-full h-full relative flex-shrink-0">
        <Image 
          src={image} 
          alt={title || `${getContentTypeLabel()} ${content_id}`}
          width={192}
          height={192}
          className="object-cover h-full w-full"
          priority
        />
      </div>
      
      {/* Content column */}
      <div className="p-3 flex flex-col flex-grow overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-block bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full text-xs font-medium">
            {getContentTypeLabel()}
          </span>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 transition-colors"
            title="Eliminar contenido guardado"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
        
        <Link href={getContentLink()} className="block">
          <h2 className="text-lg font-bold text-gray-800 mb-2 hover:text-teal-500 transition-colors line-clamp-2">
            {title || `${getContentTypeLabel()} ${content_id}`}
          </h2>
        </Link>

        {excerpt && <p className="text-sm text-gray-600 mb-2 line-clamp-2">{excerpt}</p>}

        <div className="text-xs text-gray-500 mt-auto">
          Guardado el:{' '}
          {new Date(saved_at).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      </div>
    </article>
  );
}