'use client';

import { FaUsers, FaLightbulb, FaRocket, FaHandshake, FaEnvelope } from 'react-icons/fa';

export default function AboutSection() {
  return (
    <section className="container mx-auto px-4 py-20" id="nosotros">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
              Sobre Nosotros
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* ¿Quiénes somos? */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft p-8 transition-all duration-300 hover:shadow-soft-lg border-t-4 border-t-primary-500">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 text-xl">
                        <FaUsers />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-900">¿Quiénes somos?</h3>
                </div>
                <p className="text-neutral-600 leading-relaxed text-lg">
                    Somos una comunidad de personas apasionadas por la psicología científica que colaboran para difundir y aprender juntas, construyendo puentes entre la investigación y la práctica.
                </p>
            </div>

            {/* ¿Por qué lo hacemos? */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft p-8 transition-all duration-300 hover:shadow-soft-lg border-t-4 border-t-accent-500">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-accent-50 rounded-xl flex items-center justify-center text-accent-600 text-xl">
                        <FaLightbulb />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-900">¿Por qué lo hacemos?</h3>
                </div>
                <p className="text-neutral-600 leading-relaxed">
                    Psi Colab nació porque la formación en psicología científica puede ser un desafío en nuestros contextos. Creemos que el conocimiento se construye en comunidad y debe ser accesible para todos los apasionados por esta disciplina.
                </p>
            </div>

            {/* ¿Qué hacemos? */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft p-8 transition-all duration-300 hover:shadow-soft-lg border-t-4 border-t-primary-500">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 text-xl">
                        <FaRocket />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-900">¿Qué hacemos?</h3>
                </div>
                <ul className="space-y-4 text-neutral-600">
                    <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 mt-2 bg-primary-400 rounded-full flex-shrink-0"></span>
                        <span><strong>Difusión Científica:</strong> Publicamos y compartimos investigaciones y reflexiones de diversos autores.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 mt-2 bg-primary-400 rounded-full flex-shrink-0"></span>
                        <span><strong>Traducciones:</strong> Acercamos investigaciones internacionales al público hispanohablante.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 mt-2 bg-primary-400 rounded-full flex-shrink-0"></span>
                        <span><strong>Formación:</strong> Desarrollamos cursos y guías para potenciar el crecimiento profesional.</span>
                    </li>
                </ul>
            </div>

            {/* ¿Cómo puedes colaborar? */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft p-8 transition-all duration-300 hover:shadow-soft-lg border-t-4 border-t-accent-500">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-accent-50 rounded-xl flex items-center justify-center text-accent-600 text-xl">
                        <FaHandshake />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-900">¿Cómo colaborar?</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                        <span className="block font-bold text-neutral-800 text-sm mb-1">Blog</span>
                        <span className="text-xs text-neutral-500">Envía tus artículos o traducciones.</span>
                    </div>
                    <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                        <span className="block font-bold text-neutral-800 text-sm mb-1">Material</span>
                        <span className="text-xs text-neutral-500">Comparte libros, videos y recursos.</span>
                    </div>
                    <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                        <span className="block font-bold text-neutral-800 text-sm mb-1">Mejora</span>
                        <span className="text-xs text-neutral-500">Envíanos tus ideas y sugerencias.</span>
                    </div>
                    <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                        <span className="block font-bold text-neutral-800 text-sm mb-1">Únete</span>
                        <span className="text-xs text-neutral-500">Forma parte del equipo estructural.</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
            <div className="inline-flex flex-col items-center gap-6 p-8 bg-gradient-to-br from-neutral-50 to-white rounded-3xl border border-neutral-100 shadow-soft">
                <p className="text-neutral-700 font-medium">¿Quieres ser parte de nuestra comunidad?</p>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLScUriQvAZDospfJetheyUQoTak24Cihzr7LvAXyL5uzZktbTA/viewform?usp=header"
                  className="inline-flex items-center gap-2 px-10 py-4 bg-primary-600 text-white hover:bg-primary-700 rounded-xl transition-all duration-300 font-bold shadow-soft hover:shadow-soft-lg hover:-translate-y-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaEnvelope />
                  ¡Participa en el proyecto!
                </a>
            </div>
        </div>
      </div>
    </section>
  );
}