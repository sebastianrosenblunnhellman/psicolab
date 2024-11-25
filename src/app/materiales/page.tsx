import { FaBook, FaRoad, FaExternalLinkAlt, FaVideo } from 'react-icons/fa';
import NetworkAnimation from '@/components/NetworkAnimation';
import TypewriterText from '@/components/TypewriterText';

interface Material {
  title: string;
  description: string;
  type: string;
  icon: JSX.Element;
  enterUrl: string;
}

export default function MaterialesPage() {
  const materiales: Material[] = [
    {
      title: "Libros Recomendados",
      description: "Una selección curada de libros de psicología científica de alta calidad, fundamentales para la comprensión profunda de la mente humana.",
      type: "Biblioteca",
      icon: <FaBook className="w-6 h-6" />,
      enterUrl: "/biblioteca"
    },
    {
      title: "Hojas de Ruta",
      description: "Artículos de Psi Colab cuidadosamente seleccionados y organizados en unidades temáticas para facilitar el aprendizaje estructurado.",
      type: "Guías",
      icon: <FaRoad className="w-6 h-6" />,
      enterUrl: "/materiales/hojas-de-ruta"
    },
    {
      title: "Recursos Externos",
      description: "Material seleccionado y organizado de fuentes confiables para complementar tu aprendizaje continuo en psicología.",
      type: "Recursos",
      icon: <FaExternalLinkAlt className="w-6 h-6" />,
      enterUrl: "/materiales/recursos-externos"
    },
    {
      title: "Videoteca",
      description: "Colección exclusiva de videos divulgativos de alta calidad traducidos y doblados del inglés al español, seleccionados por su valor educativo.",
      type: "Videos",
      icon: <FaVideo className="w-6 h-6" />,
      enterUrl: "/materiales/videoteca"
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center relative min-h-[300px]">
        <div className="relative z-10">
          <h1 className="text-6xl font-bold mb-6">
            <span className="text-teal-500">MATERIALES</span>
          </h1>
          <p className="relative z-10 max-w-2xl mx-auto">
            <TypewriterText
              texts={[
                "Recursos para aprender",
                "Recursos para estudiar",
                "Recursos para investigar",
                "Recursos para crecer"
              ]}
              typingSpeed={80}
              deletingSpeed={40}
              delayBetween={2000}
              className="text-xl text-gray-600"
            />
          </p>
        </div>
        <div className="absolute inset-0">
          <NetworkAnimation />
        </div>
      </section>

      {/* Materials Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {materiales.map((material, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4 text-blue-500">
                {material.icon}
                <span className="ml-2 text-sm font-semibold text-gray-500">
                  {material.type}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {material.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {material.description}
              </p>
              <a
                href={material.enterUrl}
                className="text-teal-500 hover:text-teal-600 font-medium"
              >
                Entrar →
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
