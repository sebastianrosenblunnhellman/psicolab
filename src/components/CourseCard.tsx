import Link from 'next/link';
import { useState } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import Image from 'next/image';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  image?: string;
  duration?: string;
  level?: string;
  isSaved?: boolean;
  onSaveToggle?: (courseId: string) => void;
}

export default function CourseCard({
  id,
  title,
  description,
  image = '/images/miniatura.jpg',
  duration,
  level,
  isSaved = false,
  onSaveToggle
}: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onSaveToggle) {
      onSaveToggle(id);
    }
  };

  return (
    <Link
      href={`/aprendizaje/${id}`}
      className="block h-auto sm:h-48"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-lg hover:border-teal-500 transition-all duration-300 flex flex-col sm:flex-row overflow-hidden h-full">
        {/* Image column - square shape */}
        <div className="sm:w-48 w-full h-32 sm:h-full relative flex-shrink-0">
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
            <button
              onClick={handleSaveClick}
              className={`ml-2 transition-colors flex-shrink-0 ${isHovered ? 'opacity-100' : 'opacity-70'} ${isSaved ? 'text-teal-500 hover:text-teal-600' : 'text-gray-400 hover:text-teal-500'}`}
              title={isSaved ? 'Quitar de guardados' : 'Guardar curso'}
            >
              {isSaved ? <FaBookmark className="w-4 h-4" /> : <FaRegBookmark className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{description}</p>
          
          <div className="flex items-center text-xs text-gray-500 space-x-4 mt-auto">
            {duration && (
              <span className="flex items-center">
                <span className="mr-1">⏱</span>
                {duration}
              </span>
            )}
            {level && (
              <span className="flex items-center">
                <span className="mr-1">📚</span>
                {level}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}