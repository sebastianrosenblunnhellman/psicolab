import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex space-x-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <FaFacebook className="w-6 h-6" />
              <span className="sr-only">Facebook</span>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-pink-600 transition-colors"
            >
              <FaInstagram className="w-6 h-6" />
              <span className="sr-only">Instagram</span>
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-black transition-colors"
            >
              <FaTiktok className="w-6 h-6" />
              <span className="sr-only">TikTok</span>
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-black transition-colors"
            >
              <FaXTwitter className="w-6 h-6" />
              <span className="sr-only">X</span>
            </a>
          </div>
          <div className="text-center">
            <p className="text-gray-500">
              © {new Date().getFullYear()} Psi Colab. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
