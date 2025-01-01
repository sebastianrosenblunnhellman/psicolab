'use client';

    import NetworkAnimation from '@/components/NetworkAnimation';
    import { FaChevronDown } from 'react-icons/fa';
    import { useState } from 'react';

    export default function NosotrosPage() {
      const [openSections, setOpenSections] = useState<string[]>([]);

      const toggleSection = (section: string) => {
        setOpenSections(prev =>
          prev.includes(section)
            ? prev.filter(item => item !== section)
            : [...prev, section]
        );
      };

      const isOpen = (section: string) => openSections.includes(section);

      return (
        <div className="bg-white">
          {/* Hero Section */}
          <div className="relative h-[50vh] bg-gradient-to-b from-gray-50 to-white">
            <NetworkAnimation className="absolute inset-0" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4 max-w-4xl px-4">
                <h1 className="text-6xl font-bold text-blue-500">SOBRE NOSOTROS</h1>
                <p className="text-xl text-gray-600">
                  Impulsando la Psicología Científica en Comunidad
                </p>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <section className="container mx-auto px-4 py-16 max-w-4xl">
            <div className="space-y-6">
              {/* ¿Quiénes somos? */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <button
                  onClick={() => toggleSection('quienes')}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <h2 className="text-2xl font-bold text-gray-800">¿Quiénes somos?</h2>
                  <FaChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      isOpen('quienes') ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen('quienes') && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600">
                      Somos una comunidad de personas apasionadas por la psicología científica que colaboran para difundir y aprender juntas.
                    </p>
                  </div>
                )}
              </div>

              {/* ¿Qué hacemos? */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <button
                  onClick={() => toggleSection('que')}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <h2 className="text-2xl font-bold text-gray-800">¿Qué hacemos?</h2>
                  <FaChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      isOpen('que') ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen('que') && (
                  <div className="px-6 pb-6">
                    <ul className="space-y-4 text-gray-600">
                      <li className="flex items-start">
                        <span className="w-2 h-2 mt-2 mr-2 bg-teal-500 rounded-full"></span>
                        <span><strong>Publicación de Artículos Originales:</strong> Damos voz a autores que desean compartir sus investigaciones y reflexiones.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 mt-2 mr-2 bg-teal-500 rounded-full"></span>
                        <span><strong>Traducción de Artículos Inéditos:</strong> Acercamos al público hispanohablante investigaciones relevantes que aún no están disponibles en nuestro idioma.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 mt-2 mr-2 bg-teal-500 rounded-full"></span>
                        <span><strong>Traducción de Material Audiovisual:</strong> Facilitamos el acceso a contenido multimedia de alto valor para el aprendizaje y la actualización profesional.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 mt-2 mr-2 bg-teal-500 rounded-full"></span>
                        <span><strong>Cursos y Hojas de Ruta:</strong> Proporcionamos cursos y guías en diferentes formatos para apoyar el desarrollo de estudiantes y profesionales de la psicología.</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* ¿Por qué lo hacemos? */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <button
                  onClick={() => toggleSection('porque')}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <h2 className="text-2xl font-bold text-gray-800">¿Por qué lo hacemos?</h2>
                  <FaChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      isOpen('porque') ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen('porque') && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600">
                      Psi Colab nació de una observación simple: la formación en psicología científica puede ser un enorme desafío en nuestros contextos. Creemos firmemente que el conocimiento se construye en comunidad. Por eso, hemos creado este espacio, una red de colaboración donde todos aquellos apasionados por la psicología científica encuentran un lugar estructurado y accesible para compartir y difundir su trabajo.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Call to Action Banner */}
            <div className="mt-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-4">¿Quieres saber cómo puedes ayudar?</h2>
              <a
                href="/contacto"
                className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Únete al Proyecto
              </a>
            </div>
          </section>
        </div>
      );
    }
