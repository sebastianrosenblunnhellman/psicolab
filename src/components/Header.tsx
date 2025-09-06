"use client";

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaBook, FaTools, FaUsers } from 'react-icons/fa';
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

  // Define mobile menu items - simplified without submenus
  const mobileMenuItems: MobileMenuItem[] = [
    {
      label: 'Artículos',
      href: '/articulos',
      icon: <FaBook className="h-5 w-5" />
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

  // Auth removed: no profile picture or user state

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  // Auth removed: no login popup

  // When the user logs in (cookie updated by Stack Auth), close the popup
  // Auth removed

  // Listen for popup completion messages and refresh parent
  // Auth removed

  // If we're inside the popup after redirect (returnTo), notify opener and close
  // Auth removed

  return (
    <header className="bg-white fixed w-full top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold transition-colors flex items-center gap-2">
              <img src="/favicon.png" alt="Logo" className="h-8 w-8" />
              <span className="text-teal-500">Psi</span>{" "}
              <span className="text-blue-500">Colab</span>
            </Link>
          </div>

          {/* Navigation Links - Right aligned */}
          <div className="hidden md:flex md:items-center md:space-x-8 ml-auto">
            <Link
              href="/articulos"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 pt-1 transition-all"
            >
              <FaBook className="h-5 w-5" />
              Artículos
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

          {/* Right placeholder removed to keep links aligned right */}

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Auth removed: no user avatar */}
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
            {/* Auth removed: no user menu */}
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
