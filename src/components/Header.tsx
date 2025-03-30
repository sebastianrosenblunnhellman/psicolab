"use client";

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaBook, FaTools, FaUsers, FaGraduationCap } from 'react-icons/fa';
import { useUser } from "@stackframe/stack";
import { usePathname } from 'next/navigation';

interface MobileMenuItem {
  label: string;
  href: string;
  icon: JSX.Element;
}

function HeaderComponent() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const user = useUser();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  // Define mobile menu items - simplified without submenus
  const mobileMenuItems: MobileMenuItem[] = [
    {
      label: 'Artículos',
      href: '/articulos',
      icon: <FaBook className="h-5 w-5" />
    },
    {
      label: 'Aprendizaje',
      href: '/aprendizaje',
      icon: <FaGraduationCap className="h-5 w-5" />
    },
    {
      label: 'Recursos',
      href: '/recursos',
      icon: <FaTools className="h-5 w-5" />
    },
    {
      label: 'Nosotros',
      href: '/nosotros',
      icon: <FaUsers className="h-5 w-5" />
    }
  ];

  // Close menus when the path changes (user navigates)
  useEffect(() => {
    setIsOpen(false);
    setIsUserDropdownOpen(false);
  }, [pathname]);

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

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

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
          <div className="md:hidden flex items-center gap-2">
            {user && (
              <div className="flex items-center justify-center overflow-hidden rounded-full w-8 h-8 border-2 border-gray-200">
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
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <FiX className="block h-6 w-6" />
              ) : (
                <FiMenu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Simplified Hamburger Menu */}
        <div className={`md:hidden fixed top-20 right-0 left-0 bottom-0 bg-white z-50 overflow-y-auto transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="pt-2 pb-3 space-y-1 px-4">
            {/* Mobile Navigation Menu - Simple links without submenus */}
            {mobileMenuItems.map((item) => (
              <div key={item.label} className="py-2 border-b border-gray-100">
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 py-3 ${
                    isActive(item.href) 
                      ? 'text-blue-600 font-medium' 
                      : 'text-gray-600'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span className="text-lg">{item.label}</span>
                </Link>
              </div>
            ))}
            
            {/* Mobile User Menu */}
            {user ? (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <p className="text-sm text-gray-500 pb-2">Cuenta</p>
                <Link
                  href="/guardados"
                  className="flex items-center gap-2 py-2 text-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Guardados</span>
                </Link>
                <Link
                  href="/perfil"
                  className="flex items-center gap-2 py-2 text-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Editar Perfil</span>
                </Link>
                <button
                  onClick={async () => {
                    await user.signOut();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 py-2 text-left text-red-600"
                >
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <a
                  href="/handler/sign-up"
                  className="block w-full py-3 mt-2 px-4 bg-blue-500 text-white rounded-md text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Iniciar Sesión
                </a>
              </div>
            )}
          </div>
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
