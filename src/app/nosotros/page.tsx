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
                  className="w-full px-6 py-4 flex items-center justify-between text-left transition-colors"
                >
                  <h2 className="text-2xl font-bold text-gray-800">¿Quiénes somos?</h2>
                  <FaChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      isOpen('quienes') ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`px-6 pb-6 overflow-hidden transition-max-height duration-300 ease-in-out ${
                    isOpen('quienes') ? 'max-h-96 pb-6' : 'max-h-0 pb-0'
                  }`}
                >
                  <p className="text-gray-600">
                    Somos una comunidad de personas apasionadas por la psicología científica que colaboran para difundir y aprender juntas.
                  </p>
                </div>
              </div>

              {/* ¿Qué hacemos? */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <button
                  onClick={() => toggleSection('que')}
                  className="w-full px-6 py-4 flex items-center justify-between text-left transition-colors"
                >
                  <h2 className="text-2xl font-bold text-gray-800">¿Qué hacemos?</h2>
                  <FaChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      isOpen('que') ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`px-6 pb-6 overflow-hidden transition-max-height duration-300 ease-in-out ${
                    isOpen('que') ? 'max-h-96 pb-6' : 'max-h-0 pb-0'
                  }`}
                >
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
              </div>

              {/* ¿Por qué lo hacemos? */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <button
                  onClick={() => toggleSection('porque')}
                  className="w-full px-6 py-4 flex items-center justify-between text-left transition-colors"
                >
                  <h2 className="text-2xl font-bold text-gray-800">¿Por qué lo hacemos?</h2>
                  <FaChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      isOpen('porque') ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`px-6 pb-6 overflow-hidden transition-max-height duration-300 ease-in-out ${
                    isOpen('porque') ? 'max-h-96 pb-6' : 'max-h-0 pb-0'
                  }`}
                >
                  <p className="text-gray-600">
                    Psi Colab nació de una observación simple: la formación en psicología científica puede ser un enorme desafío en nuestros contextos. Creemos firmemente que el conocimiento se construye en comunidad. Por eso, hemos creado este espacio, una red de colaboración donde todos aquellos apasionados por la psicología científica encuentran un lugar estructurado y accesible para compartir y difundir su trabajo.
                  </p>
                </div>
              </div>
              {/* ¿Cómo puedes colaborar? */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <button
                  onClick={() => toggleSection('colaborar')}
                  className="w-full px-6 py-4 flex items-center justify-between text-left transition-colors"
                >
                  <h2 className="text-2xl font-bold text-gray-800">¿Cómo puedes colaborar?</h2>
                  <FaChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      isOpen('colaborar') ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`px-6 pb-6 overflow-hidden transition-max-height duration-300 ease-in-out ${
                    isOpen('colaborar') ? 'max-h-96 pb-6' : 'max-h-0 pb-0'
                  }`}
                >
                  <p className="text-gray-600 mb-4">
                    Hay muchas maneras en las que puedes aportar al proyecto. ¡Tu contribución es importante!
                  </p>
                  <ol className="list-decimal list-inside text-gray-600 space-y-4">
                    <li>
                      <strong>Artículos</strong>
                      <p>Puedes enviarnos artículos de tu propia autoría o traducciones que hayas realizado. Todo el material será revisado antes de su publicación.</p>
                    </li>
                    <li>
                      <strong>Material</strong>
                      <p>Aceptamos material de todo tipo para indexar, como:</p>
                      <ul className="list-disc list-inside ml-4">
                        <li>Libros en formato PDF</li>
                        <li>Videos relevantes</li>
                        <li>Artículos y recursos externos (blogs, películas, revistas, academias, etc.)</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Sugerencias</strong>
                      <p>Tus ideas y comentarios son valiosos. Si tienes alguna sugerencia para mejorar el proyecto, no dudes en compartirla con nosotros.</p>
                    </li>
                    <li>
                      <strong>Hazte miembro</strong>
                      <p>Únete a nuestro equipo y forma parte estructural del proyecto. Ser miembro implica contribuir activamente en su desarrollo y crecimiento.</p>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Call to Action Banner */}
            <div className="mt-12 text-center">
              <a
                href="mailto:psi.colab.arg@gmail.com"
                className="inline-block px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Contacta!
              </a>
            </div>
          </section>
        </div>
      );
    }
