import NetworkAnimation from '@/components/NetworkAnimation';
import TypewriterText from '@/components/TypewriterText';

export default function NosotrosPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center relative min-h-[300px]">
        <div className="relative z-10">
          <h1 className="text-6xl font-bold mb-6">
            <span className="text-blue-500">NOSOTROS</span>
          </h1>
          <p className="text-xl text-gray-600 relative z-10 max-w-2xl mx-auto">
            <TypewriterText
              prefix="Somos "
              suffixes={[
                "estudiantes",
                "investigadores",
                "colaboradores",
                "apasionados"
              ]}
              typingSpeed={80}
              deletingSpeed={40}
              delayBetween={2000}
            />
          </p>
        </div>
        <div className="absolute inset-0">
          <NetworkAnimation />
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Nuestra Misión</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Conectar y empoderar a estudiantes de psicología a través del conocimiento compartido,
              creando un espacio colaborativo donde el aprendizaje y la investigación se encuentran.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Aprendizaje Continuo</h3>
              <p className="text-gray-600">
                Creemos en el poder del conocimiento compartido y el aprendizaje permanente.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Colaboración</h3>
              <p className="text-gray-600">
                Fomentamos un ambiente de apoyo mutuo y trabajo en equipo.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Innovación</h3>
              <p className="text-gray-600">
                Buscamos constantemente nuevas formas de mejorar la experiencia de aprendizaje.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">¿Quieres ser parte?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Estamos siempre buscando estudiantes apasionados que quieran contribuir con sus conocimientos
            y experiencias.
          </p>
          <a
            href="/contacto"
            className="inline-block bg-teal-500 text-white px-8 py-3 rounded-lg hover:bg-teal-600 transition-colors font-medium"
          >
            Únete al equipo
          </a>
        </div>
      </section>
    </div>
  );
}
