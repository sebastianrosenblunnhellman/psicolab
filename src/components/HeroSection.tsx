'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import NetworkAnimation from './NetworkAnimation';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-white pt-8 pb-16 md:pt-12 md:pb-24">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
        <NetworkAnimation />
      </div>

      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-primary-100/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-accent-100/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Content Area */}
          <div className={`lg:col-span-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 shadow-sm mb-8">
              <span className="inline-block w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-bold text-primary-700 uppercase tracking-wider">Psicología colaborativa</span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black mb-12 leading-[1.1] text-neutral-900 tracking-tight uppercase">
              Conectando
              <span className="block text-primary-600">Conocimiento</span>
            </h1>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 mb-16">
              <Link 
                href="/aprendizaje" 
                className="group px-10 py-5 bg-primary-600 text-white rounded-2xl font-bold shadow-soft hover:shadow-soft-lg hover:bg-primary-700 transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <span className="flex items-center justify-center gap-2">
                  Explorar cursos
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              <Link 
                href="/articulos" 
                className="px-10 py-5 bg-white text-neutral-800 rounded-2xl font-bold border-2 border-neutral-100 hover:border-primary-200 hover:bg-neutral-50 transition-all duration-300 hover:-translate-y-1 text-center shadow-sm"
              >
                Ver Artículos
              </Link>
            </div>

            {/* Stats Integrated */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12 pt-8 border-t border-neutral-100 max-w-2xl">
              <div>
                <div className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-1">Modelo</div>
                <div className="text-lg md:text-xl font-black text-neutral-900 leading-tight">Acceso<br/>Abierto</div>
              </div>
              <div>
                <div className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-1">Calidad</div>
                <div className="text-lg md:text-xl font-black text-neutral-900 leading-tight">Contenido<br/>Curado</div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-1">Visión</div>
                <div className="text-lg md:text-xl font-black text-neutral-900 leading-tight">Comunidad<br/>Activa</div>
              </div>
            </div>
          </div>

          {/* Visual Element Area (Hidden on mobile/tablet, visual weight for desktop) */}
          <div className="hidden lg:col-span-4 lg:flex justify-end relative">
             {/* This space is intentionally left with the network animation background, 
                 but could host a 3D asset or specific illustration in the future. */}
             <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-primary-500/10 to-accent-500/10 animate-pulse blur-2xl"></div>
          </div>

        </div>
      </div>
    </section>
  );
}