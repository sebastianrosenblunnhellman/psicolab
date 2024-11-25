"use client";

import Link from 'next/link';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaBook, FaTools, FaUsers } from 'react-icons/fa';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white fixed w-full top-0 z-50">
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
              <Link
                href="/materiales"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 pt-1 transition-all"
              >
                <FaTools className="h-5 w-5" />
                Materiales
              </Link>
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
            <Link
              href="/materiales"
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <FaTools className="h-5 w-5" />
              Materiales
            </Link>
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
