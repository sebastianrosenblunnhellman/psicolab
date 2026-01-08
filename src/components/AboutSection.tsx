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
                    Somos una comunidad de profesionales apasionados por la psicología científica que colaboran para difundir y aprender juntos, construyendo puentes entre la investigación y la práctica.
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
                    Psi Colab nació porque la formación en psicología científica es un gran desafío en nuestros contextos. Creemos que el conocimiento se construye en comunidad y debe ser accesible para todos los apasionados por esta disciplina.
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
                        <span><strong>Difusión Científica:</strong> Publicamos y compartimos investigaciones y artículos de diversos autores.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 mt-2 bg-primary-400 rounded-full flex-shrink-0"></span>
                        <span><strong>Traducciones:</strong> Acercamos investigaciones internacionales al público hispanohablante.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 mt-2 bg-primary-400 rounded-full flex-shrink-0"></span>
                        <span><strong>Formación:</strong> Desarrollamos cursos, talleres y guías para potenciar el crecimiento profesional.</span>
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
                <div className="flex flex-col gap-4">
                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 hover:bg-white hover:border-accent-200 transition-all group">
                        <span className="block font-bold text-neutral-800 text-base mb-1 group-hover:text-accent-600 transition-colors">Blog</span>
                        <span className="text-sm text-neutral-500 leading-relaxed">
                          Envíanos tu artículo y nuestro equipo lo revisará desde el rigor académico. Si cumple los criterios de calidad, lo publicamos en la plataforma, dando visibilidad a tu trabajo.
                        </span>
                    </div>
                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 hover:bg-white hover:border-accent-200 transition-all group">
                        <span className="block font-bold text-neutral-800 text-base mb-1 group-hover:text-accent-600 transition-colors">Docencia</span>
                        <span className="text-sm text-neutral-500 leading-relaxed">
                          ¿Tenés un proyecto educativo en mente? Te ayudamos a estructurarlo, producirlo y publicarlo en la plataforma.
                        </span>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </section>
  );
}