import Link from 'next/link';
import { useState } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

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
  image,
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
      className="block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-lg hover:border-teal-500 transition-all duration-300 overflow-hidden h-full">
        {image && (
          <div className="relative h-48 w-full overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-105"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-800 hover:text-teal-600 transition-colors">
              {title}
            </h3>
            <button
              onClick={handleSaveClick}
              className={`text-2xl transition-colors ${isHovered ? 'opacity-100' : 'opacity-70'} ${isSaved ? 'text-teal-500 hover:text-teal-600' : 'text-gray-400 hover:text-teal-500'}`}
              title={isSaved ? 'Quitar de guardados' : 'Guardar curso'}
            >
              {isSaved ? <FaBookmark /> : <FaRegBookmark />}
            </button>
          </div>
          <p className="text-gray-600 mb-4">{description}</p>
          <div className="flex items-center text-sm text-gray-500 space-x-4">
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