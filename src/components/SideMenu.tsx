"use client";

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { FaBook, FaTools, FaGraduationCap } from 'react-icons/fa';

interface MenuItem {
  label: string;
  items: { label: string; href: string }[];
}

const menuItems: Record<string, MenuItem> = {
  '/articulos': {
    label: 'Artículos',
    items: [
      { label: 'Análisis de la Conducta', href: '/articulos/analisis-de-la-conducta' },
      { label: 'Psicología Clínica', href: '/articulos/psicologia-clinica' },
      { label: 'Neuropsicología', href: '/articulos/neuropsicologia' }
    ]
  },
  '/aprendizaje': {
    label: 'Aprendizaje',
    items: [
      { label: 'Cursos', href: '/aprendizaje/cursos' },
      { label: 'Tutoriales', href: '/aprendizaje/tutoriales' },
      { label: 'Workshops', href: '/aprendizaje/workshops' }
    ]
  },
  '/recursos': {
    label: 'Recursos',
    items: [
      { label: 'Herramientas', href: '/recursos/herramientas' },
      { label: 'Bibliografía', href: '/recursos/bibliografia' },
      { label: 'Material Descargable', href: '/recursos/material' }
    ]
  }
};

export default function SideMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Only show menu for specified routes
  const allowedPaths = ['/articulos', '/aprendizaje', '/recursos'];
  const basePath = '/' + pathname.split('/')[1];
  
  if (!allowedPaths.includes(basePath)) {
    return null;
  }

  const currentMenu = menuItems[basePath];

  return (
    <div className="fixed left-0 top-20 z-40 bg-white shadow-md rounded-r-lg">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-blue-600 transition-colors w-full"
        >
          <span className="text-lg font-medium">{currentMenu.label}</span>
          <FiChevronDown
            className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="absolute left-full top-0 w-64 bg-white shadow-lg rounded-r-lg py-2">
            {currentMenu.items.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}