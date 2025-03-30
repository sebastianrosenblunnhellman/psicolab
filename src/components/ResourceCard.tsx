import Link from 'next/link';
import { useState } from 'react';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import Image from 'next/image';

interface ResourceCardProps {
  id: string;
  title: string;
  description: string;
  image?: string;
  type?: string;
  author?: string;
  isSaved?: boolean;
  downloadUrl?: string;
  onSaveToggle?: (resourceId: string) => void;
}

export default function ResourceCard({
  id,
  title,
  description,
  image = '/images/miniatura.jpg',
  type,
  author,
  isSaved = false,
  downloadUrl,
  onSaveToggle
}: ResourceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onSaveToggle) {
      onSaveToggle(id);
    }
  };

  return (
    <Link
      href={`/recursos/${id}`}
      className="block h-48"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-lg hover:border-teal-500 transition-all duration-300 flex flex-col md:flex-row overflow-hidden h-full">
        {/* Image column - square shape */}
        <div className="md:w-48 w-full h-full relative flex-shrink-0">
          <Image 
            src={image} 
            alt={title}
            width={192}
            height={192}
            className="object-cover h-full w-full"
            priority
          />
        </div>
        
        {/* Content column */}
        <div className="p-3 flex flex-col flex-grow overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-800 hover:text-teal-600 transition-colors line-clamp-2">
              {title}
            </h3>
            
            {/* Only the bookmark icon is kept */}
            {onSaveToggle && (
              <button
                onClick={handleSaveClick}
                className={`ml-2 transition-colors flex-shrink-0 ${isHovered ? 'opacity-100' : 'opacity-70'} ${isSaved ? 'text-teal-500 hover:text-teal-600' : 'text-gray-400 hover:text-teal-500'}`}
                title={isSaved ? 'Quitar de guardados' : 'Guardar recurso'}
              >
                {isSaved ? <FaBookmark className="w-4 h-4" /> : <FaRegBookmark className="w-4 h-4" />}
              </button>
            )}
          </div>
          
          {type && (
            <div className="mb-1">
              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                {type}
              </span>
            </div>
          )}
          
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{description}</p>
          
          {author && (
            <div className="text-xs text-gray-500 mt-auto">
              Por: {author}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
