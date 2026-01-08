'use client';

import { useState } from 'react';
import { FaPaperPlane, FaCheck } from 'react-icons/fa';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      // Reset after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto bg-gradient-to-br from-primary-600 to-accent-600 rounded-3xl p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-2xl">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          
          <div className="text-center md:text-left md:w-1/2 text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Únete a nuestro Newsletter
            </h2>
            <p className="text-primary-50 text-lg opacity-90 max-w-md mx-auto md:mx-0">
              Recibe las últimas actualizaciones de nuestros cursos, artículos y novedades directamente en tu bandeja de entrada.
            </p>
          </div>

          <div className="w-full md:w-1/2 max-w-md">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu correo electrónico"
                  required
                  disabled={status === 'success' || status === 'loading'}
                  className="w-full px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all backdrop-blur-sm"
                />
                {status === 'success' && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-300 animate-fadeIn">
                        <FaCheck />
                    </div>
                )}
              </div>
              
              <button
                type="submit"
                disabled={status !== 'idle'}
                className={`group w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg
                  ${status === 'success' 
                    ? 'bg-green-500 text-white cursor-default' 
                    : 'bg-white text-primary-600 hover:bg-primary-50 hover:shadow-xl hover:-translate-y-1'
                  }`}
              >
                {status === 'loading' ? (
                  <span className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></span>
                ) : status === 'success' ? (
                  <>Suscrito correctamente <FaCheck /></>
                ) : (
                  <>Suscribirse <FaPaperPlane className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>
            <p className="text-xs text-primary-200 mt-4 text-center md:text-left">
              Respetamos tu privacidad. Sin spam, nunca.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
