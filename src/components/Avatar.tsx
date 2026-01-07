import React from 'react';
import { FaUser } from 'react-icons/fa';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function Avatar({ src, alt, size = 'md', className = '' }: AvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-20 w-20',
    xl: 'h-32 w-32',
  };

  const containerClasses = `relative rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border border-gray-200 ${sizeClasses[size]} ${className}`;

  if (src) {
    return (
      <div className={containerClasses}>
        <img 
          src={src} 
          alt={alt || 'Avatar'} 
          className="h-full w-full object-cover" 
        />
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <FaUser className="text-gray-400 h-1/2 w-1/2" />
    </div>
  );
}
