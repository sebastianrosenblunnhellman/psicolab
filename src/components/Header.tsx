"use client";

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import { FaBook, FaTools, FaUsers, FaGraduationCap, FaExternalLinkAlt, FaVideo, FaBookOpen } from 'react-icons/fa';
import { useUser, UserButton } from "@stackframe/stack";

function HeaderComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const user = useUser();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (user && user.id) {
        try {
          const response = await fetch(`/api/profile/${user.id}`);
          if (response.ok) {
            const data = await response.json();
            setProfilePicture(data.profile_picture_url);
          }
        } catch (error) {
          console.error("Error fetching profile picture:", error);
        }
      }
    };

    fetchProfilePicture();
  }, [user]);

  return (
    <header className="bg-white fixed w-full top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold transition-colors">
              <span className="text-teal-500">Psi</span>{" "}
              <span className="text-blue-500">Colab</span>
            </Link>
          </div>

          {/* Navigation Links - Centered */}
          <div className="hidden md:flex md:items-center md:space-x-8 mx-auto">
            <Link
              href="/articulos"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 pt-1 transition-all"
            >
              <FaBook className="h-5 w-5" />
              Artículos
            </Link>
            <Link
              href="/aprendizaje"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 pt-1 transition-all"
            >
              <FaGraduationCap className="h-5 w-5" />
              Aprendizaje!
            </Link>
            <Link
              href="/recursos"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 pt-1 transition-all"
            >
              <FaTools className="h-5 w-5" />
              Recursos
            </Link>
            <Link
              href="/nosotros"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 pt-1 transition-all"
            >
              <FaUsers className="h-5 w-5" />
              Nosotros
            </Link>
          </div>

          {/* Login Button / User Dropdown - Right */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="ml-4 flex items-center justify-center overflow-hidden rounded-full w-10 h-10 border-2 border-gray-200 hover:border-blue-400 transition-all"
                >
                  {profilePicture ? (
                    <img 
                      src={profilePicture} 
                      alt="Perfil de usuario" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </button>
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                    <Link
                      href="/guardados"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Guardados
                    </Link>
                    <Link
                      href="/perfil"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Editar Perfil
                    </Link>
                    <button
                      onClick={async () => await user.signOut()}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/handler/sign-up"
                className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Iniciar Sesión
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
            >
              {isOpen ? (
                <FiX className="block h-6 w-6" />
              ) : (
                <FiMenu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/articulos"
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <FaBook className="h-5 w-5" />
              Artículos
            </Link>
            <Link
              href="/aprendizaje"
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <FaGraduationCap className="h-5 w-5" />
              Aprendizaje!
            </Link>
            <Link
              href="/recursos"
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <FaTools className="h-5 w-5" />
              Recursos
            </Link>
            <Link
              href="/nosotros"
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <FaUsers className="h-5 w-5" />
              Nosotros
            </Link>

            {/* Mobile Login Button */}
            <Link
              href="/handler/sign-up"
              className="flex items-center gap-2 px-3 py-2 mt-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Iniciar Sesión
            </Link>
          </div>
          {user && (
            <div className="px-4 py-3 border-t border-gray-200 flex items-center gap-3">
              <div className="overflow-hidden rounded-full w-8 h-8 flex-shrink-0">
                {profilePicture ? (
                  <img 
                    src={profilePicture} 
                    alt="Perfil de usuario" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>
              <span className="text-gray-700 font-medium">{user.displayName || 'Usuario'}</span>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default function Header() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeaderComponent />
    </Suspense>
  );
}
