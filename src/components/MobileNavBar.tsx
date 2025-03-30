"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaBook, FaTools, FaUsers, FaGraduationCap } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import { useUser } from '@stackframe/stack';

interface MobileMenuItem {
  label: string;
  href: string;
  icon: JSX.Element;
  submenu?: { label: string; href: string }[];
}

export default function MobileNavBar() {
  const pathname = usePathname();
  const user = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  
  // Close the menu when the path changes (user navigates)
  useEffect(() => {
    setIsOpen(false);
    setExpandedItem(null);
  }, [pathname]);

  // Define main menu items with their submenu items
  const menuItems: MobileMenuItem[] = [
    {
      label: 'Artículos',
      href: '/articulos',
      icon: <FaBook className="h-5 w-5" />,
      submenu: [
        { label: 'Análisis de la Conducta', href: '/articulos/analisis-de-la-conducta' },
        { label: 'Psicología Clínica', href: '/articulos/psicologia-clinica' },
        { label: 'Neuropsicología', href: '/articulos/neuropsicologia' }
      ]
    },
    {
      label: 'Aprendizaje',
      href: '/aprendizaje',
      icon: <FaGraduationCap className="h-5 w-5" />,
      submenu: [
        { label: 'Cursos', href: '/aprendizaje/cursos' },
        { label: 'Tutoriales', href: '/aprendizaje/tutoriales' },
        { label: 'Workshops', href: '/aprendizaje/workshops' }
      ]
    },
    {
      label: 'Recursos',
      href: '/recursos',
      icon: <FaTools className="h-5 w-5" />,
      submenu: [
        { label: 'Herramientas', href: '/recursos/herramientas' },
        { label: 'Bibliografía', href: '/recursos/bibliografia' },
        { label: 'Material Descargable', href: '/recursos/material' }
      ]
    },
    {
      label: 'Nosotros',
      href: '/nosotros',
      icon: <FaUsers className="h-5 w-5" />
    }
  ];

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  const toggleSubmenu = (label: string) => {
    if (expandedItem === label) {
      setExpandedItem(null);
    } else {
      setExpandedItem(label);
    }
  };

  // This is a mobile-only menu, so no need to render for desktop
  if (typeof window !== 'undefined' && window.innerWidth >= 768) {
    return null;
  }

  return null; // This component is no longer needed as we're moving the menu to the header
}
