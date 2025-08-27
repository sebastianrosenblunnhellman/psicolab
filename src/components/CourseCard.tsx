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
  // Saving disabled for courses
  tags?: string[];
}

export default function CourseCard({
  id,
  title,
  description,
  image = '/images/miniatura.jpg',
  duration,
  level,
  // isSaved and onSaveToggle removed
  tags
}: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Saving disabled

  return (
    <Link
      href={`/aprendizaje/${id}`}
      className="block h-auto sm:h-48"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-lg hover:border-teal-500 transition-all duration-300 flex flex-col sm:flex-row overflow-hidden h-full">
        {/* Image column - square shape */}
        <div className="relative w-full sm:w-48 aspect-square sm:aspect-auto sm:h-full flex-shrink-0">
          <Image 
            src={image} 
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, 192px"
            className="object-cover"
            priority
          />
        </div>
        
        {/* Content column */}
        <div className="p-3 flex flex-col flex-grow overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-800 hover:text-teal-600 transition-colors line-clamp-2">
              {title}
            </h3>
            {/* Saving disabled for courses */}
          </div>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{description}</p>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {tags.map((tag) => (
                <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">{tag}</span>
              ))}
            </div>
          )}
          
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