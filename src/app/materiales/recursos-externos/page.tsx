import NetworkAnimation from '@/components/NetworkAnimation';
import ExternalResourcesList from '@/components/ExternalResourcesList';
import { getAllExternalResources } from '@/utils/externalResources';

export const metadata = {
  title: 'Recursos Externos | Psi Colab',
  description: 'Explora nuestra colección de recursos externos seleccionados para tu aprendizaje.',
};

export default async function ExternalResourcesPage() {
  const resources = await getAllExternalResources();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-[50vh] bg-gradient-to-b from-gray-50 to-white">
        <NetworkAnimation className="absolute inset-0" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-4xl px-4">
            <h1 className="text-6xl font-bold text-blue-500">RECURSOS EXTERNOS</h1>
            <p className="text-xl text-gray-600">
              Contenido seleccionado de fuentes confiables
            </p>
          </div>
        </div>
      </div>

      {/* Resources Section */}
      <div className="container mx-auto px-4 py-16">
        <ExternalResourcesList initialResources={resources} />
      </div>
    </div>
  );
}