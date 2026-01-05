import { FaInstagram, FaYoutube, FaLinkedin, FaHeart } from 'react-icons/fa';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/favicon.png" alt="Logo" className="h-10 w-10" />
              <span className="text-2xl font-bold">
                <span className="text-primary-400">Psi</span>
                <span className="text-accent-400">Colab</span>
              </span>
            </div>
            <p className="text-neutral-300 max-w-md leading-relaxed mb-4">
              Haciendo la ciencia psicológica accesible y comprensible para todos. Contenido basado en evidencia, creado con pasión.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-800 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-soft"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-soft"
                aria-label="YouTube"
              >
                <FaYoutube className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:-translate-y-1 shadow-soft"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Navegación</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/articulos" className="text-neutral-300 hover:text-primary-400 transition-colors">
                  Artículos
                </Link>
              </li>
              <li>
                <Link href="/recursos" className="text-neutral-300 hover:text-primary-400 transition-colors">
                  Recursos
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="text-neutral-300 hover:text-primary-400 transition-colors">
                  Nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Contacto</h3>
            <ul className="space-y-2 text-neutral-300">
              <li className="hover:text-primary-400 transition-colors cursor-pointer">
                info@psicolab.com
              </li>
              <li className="text-sm">
                Buenos Aires, Argentina
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-neutral-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-400 text-sm">
              © {new Date().getFullYear()} Psi Colab. Todos los derechos reservados.
            </p>
            <p className="text-neutral-400 text-sm flex items-center gap-2">
              Hecho con <FaHeart className="text-red-500 w-4 h-4 animate-pulse" /> para la comunidad científica
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
