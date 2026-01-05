"use client";

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaBook, FaTools, FaGraduationCap } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

interface MobileMenuItem {
  label: string;
  href: string;
  icon: JSX.Element;
}

function HeaderComponent() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const mobileMenuItems: MobileMenuItem[] = [
    {
      label: 'Blog',
      href: '/articulos',
      icon: <FaBook className="h-5 w-5" />
    },
    {
      label: 'Materiales',
      href: '/recursos',
      icon: <FaTools className="h-5 w-5" />
    },
    {
      label: 'Aprendizaje',
      href: '/aprendizaje',
      icon: <FaGraduationCap className="h-5 w-5" />
    }
  ];

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-soft' 
        : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img 
                  src="/favicon.png" 
                  alt="Logo" 
                  className="h-10 w-10 transition-transform group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <span className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">Psi</span>
                <span className="bg-gradient-to-r from-accent-600 to-accent-500 bg-clip-text text-transparent">Colab</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8 flex-1 ml-8">
            <Link
              href="/articulos"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/articulos')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-neutral-600 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              <FaBook className="h-4 w-4" />
              Blog
            </Link>
            <Link
              href="/recursos"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/recursos')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-neutral-600 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              <FaTools className="h-4 w-4" />
              Materiales
            </Link>
            <Link
              href="/aprendizaje"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/aprendizaje')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-neutral-600 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              <FaGraduationCap className="h-4 w-4" />
              Aprendizaje
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex md:items-center md:gap-4">
            <button
              className="px-4 py-2 text-primary-600 font-medium hover:text-primary-700 transition-colors"
            >
              Iniciar Sesión
            </button>
            <button
              className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-sm hover:shadow-md"
            >
              Registrarse
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-neutral-600 hover:bg-primary-50 hover:text-primary-600 transition-all"
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-1">
            {mobileMenuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive(item.href)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-neutral-600 hover:bg-primary-50 hover:text-primary-600'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col gap-2 px-4">
              <button
                className="w-full py-2 text-center text-primary-600 font-medium hover:text-primary-700 transition-colors border border-primary-100 rounded-lg"
              >
                Iniciar Sesión
              </button>
              <button
                className="w-full py-2 text-center bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-sm"
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default function Header() {
  return (
    <Suspense fallback={<div className="h-16 bg-white"></div>}>
      <HeaderComponent />
    </Suspense>
  );
}
