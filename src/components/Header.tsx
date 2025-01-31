"use client";

    import Link from 'next/link';
    import { useState } from 'react';
    import { useUser } from '@auth0/nextjs-auth0/client'; // Import useUser
    import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
    import { FaBook, FaTools, FaUsers, FaGraduationCap, FaExternalLinkAlt, FaVideo, FaBookOpen } from 'react-icons/fa';

    export default function Header() {
      const { user, error, isLoading } = useUser(); // Initialize user state
      const [isOpen, setIsOpen] = useState(false);
      const [isDropdownOpen, setIsDropdownOpen] = useState(false);
      const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false); // State for user dropdown

      const materialsLinks = [
        { href: "/materiales/biblioteca", icon: <FaBookOpen className="w-5 h-5" />, text: "Biblioteca" },
        { href: "/materiales/videoteca", icon: <FaVideo className="w-5 h-5" />, text: "Videoteca" },
        { href: "/materiales/recursos-externos", icon: <FaExternalLinkAlt className="w-5 h-5" />, text: "Recursos" },
      ];

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
                  href="/hojas-de-ruta"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 pt-1 transition-all"
                >
                  <FaGraduationCap className="h-5 w-5" />
                  Aprendizaje!
                </Link>
                
                {/* Materiales Dropdown */}
                <div className="relative">
                  <button
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 pt-1 transition-all"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <FaTools className="h-5 w-5" />
                    Materiales
                    <FiChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div
                      className="absolute top-full left-0 w-48 py-2 mt-1 bg-white rounded-lg shadow-lg"
                      onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                      {materialsLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                        >
                          {link.icon}
                          {link.text}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

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
                  // User Dropdown
                  <div className="relative">
                    <button
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      <img src={user.picture} alt={user.name} className="w-6 h-6 rounded-full" />
                      <FiChevronDown className={`w-4 h-4 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isUserDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
                        <Link
                          href="/mis-cursos"
                          className="block px-4 py-2 text-gray-600 hover:bg-gray-50"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          Mis Cursos
                        </Link>
                        <Link
                          href="/guardados"
                          className="block px-4 py-2 text-gray-600 hover:bg-gray-50"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          Favoritos
                        </Link>
                        <Link
                          href="/editar-perfil"
                          className="block px-4 py-2 text-gray-600 hover:bg-gray-50"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          Editar Perfil
                        </Link>
                        <a
                          href="/api/auth/logout"
                          className="block px-4 py-2 text-gray-600 hover:bg-gray-50"
                        >
                          Cerrar Sesión
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  // Replace Link with <a> for Auth0 login
                  <a
                    href="/api/auth/login"
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
                  href="/hojas-de-ruta"
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <FaGraduationCap className="h-5 w-5" />
                  Aprendizaje!
                </Link>
                
                {/* Mobile Materials Links */}
                {materialsLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 px-3 py-2 ml-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.icon}
                    {link.text}
                  </Link>
                ))}

                <Link
                  href="/nosotros"
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <FaUsers className="h-5 w-5" />
                  Nosotros
                </Link>

                {/* Mobile Login Button */}
                {user ? (
                  // Mobile User Dropdown
                  <div className="space-y-1">
                    <Link
                      href="/mis-cursos"
                      className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Mis Cursos
                    </Link>
                    <Link
                      href="/guardados"
                      className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Favoritos
                    </Link>
                    <Link
                      href="/editar-perfil"
                      className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Editar Perfil
                    </Link>
                    <a
                      href="/api/auth/logout"
                      className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Cerrar Sesión
                    </a>
                  </div>
                ) : (
                  <Link
                    href="/api/auth/login"
                    className="flex items-center gap-2 px-3 py-2 mt-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                )}
              </div>
            </div>
          </nav>
        </header>
      );
    }
