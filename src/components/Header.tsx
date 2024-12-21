"use client";

import Link from 'next/link';
import { useState } from 'react';
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import { FaBook, FaTools, FaUsers, FaGraduationCap, FaExternalLinkAlt, FaVideo } from 'react-icons/fa';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const materialsLinks = [
    { href: "/biblioteca", icon: <FaBook className="w-5 h-5" />, text: "Biblioteca" },
    { href: "/materiales/hojas-de-ruta", icon: <FaGraduationCap className="w-5 h-5" />, text: "Guías" },
    { href: "/materiales/recursos-externos", icon: <FaExternalLinkAlt className="w-5 h-5" />, text: "Recursos" },
    { href: "/materiales/videoteca", icon: <FaVideo className="w-5 h-5" />, text: "Videoteca" },
  ];

  return (
    <header className="bg-white fixed w-full top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo y enlaces de navegación */}
          <div className="flex justify-between flex-1">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold transition-colors">
                <span className="text-teal-500">Psi</span>{" "}
                <span className="text-blue-500">Colab</span>
              </Link>
            </div>

            {/* Enlaces de navegación - Desktop */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              <Link
                href="/articulos"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 pt-1 transition-all"
              >
                <FaBook className="h-5 w-5" />
                Artículos
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
          </div>

          {/* Botón de menú móvil */}
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

        {/* Menú móvil */}
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
          </div>
        </div>
      </nav>
    </header>
  );
}