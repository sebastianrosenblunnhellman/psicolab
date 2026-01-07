'use client';

import { Fragment, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { logout } from '@/actions/logout';
import Avatar from './Avatar';
import { FaUser, FaBook, FaHeart, FaSignOutAlt, FaCog } from 'react-icons/fa';

interface UserDropdownProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    // We might pass the full profile image here if we fetch it separately, 
    // but usually session.user.image is what NextAuth provides. 
    // We'll trust the parent to pass the correct image URL.
  };
}

export default function UserDropdown({ user }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className="flex items-center gap-2 focus:outline-none"
      >
        <Avatar src={user.image} alt={user.name || 'User'} size="sm" className="cursor-pointer hover:opacity-80 transition-opacity" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 border border-gray-100 z-50 animate-fadeIn">
          <div className="px-4 py-3 border-b border-gray-100">
             <p className="text-sm font-medium text-gray-900 truncate">
               {user.name || 'Usuario'}
             </p>
             <p className="text-xs text-gray-500 truncate">
               {user.email}
             </p>
          </div>
          
          <div className="py-1">
            <Link 
              href="/profile" 
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <FaCog className="text-gray-400" />
              Configuración
            </Link>
            <Link 
              href="/mis-cursos" 
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <FaBook className="text-gray-400" />
              Mis Cursos
            </Link>
            <Link 
              href="/mi-contenido" 
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <FaHeart className="text-gray-400" />
              Mi Contenido
            </Link>
          </div>

          <div className="border-t border-gray-100 py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <FaSignOutAlt className="text-red-500" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
