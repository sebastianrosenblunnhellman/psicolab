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
    <div 
      className="h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-lg hover:border-teal-500 transition-all duration-300 flex flex-col md:flex-row overflow-hidden h-full">
        {/* Image column */}
        <div className="md:w-1/4 relative flex-shrink-0">
          <Image 
            src={image} 
            alt={title}
            width={250}
            height={250}
            className="object-cover h-full w-full"
            priority
          />
        </div>
        
        {/* Content column */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <Link href={`/recursos/${id}`} className="block">
              <h3 className="text-xl font-bold text-gray-800 hover:text-teal-600 transition-colors">
                {title}
              </h3>
            </Link>
            
            {/* Only the bookmark icon is kept */}
            {onSaveToggle && (
              <button
                onClick={handleSaveClick}
                className={`ml-2 text-blue-500 hover:text-blue-600 transition-colors flex-shrink-0 ${isHovered ? 'opacity-100' : 'opacity-70'}`}
                title={isSaved ? 'Quitar de guardados' : 'Guardar recurso'}
              >
                {isSaved ? <FaBookmark className="w-5 h-5" /> : <FaRegBookmark className="w-5 h-5" />}
              </button>
            )}
          </div>
          
          {type && (
            <div className="mb-2">
              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                {type}
              </span>
            </div>
          )}
          
          <p className="text-gray-600 mb-4">{description}</p>
          
          {author && (
            <div className="text-sm text-gray-500 mt-auto">
              Por: {author}
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
