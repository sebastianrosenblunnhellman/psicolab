import NetworkAnimation from '@/components/NetworkAnimation';
import RoadmapsList from '@/components/RoadmapsList';
import { getAllRoadmaps } from '@/utils/roadmaps';

export const metadata = {
  title: 'Hojas de Ruta | Psi Colab',
  description: 'Explora nuestras guías de aprendizaje estructuradas para psicología.',
};

export default async function RoadmapsPage() {
  const roadmaps = await getAllRoadmaps();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-[50vh] bg-gradient-to-b from-gray-50 to-white">
        <NetworkAnimation className="absolute inset-0" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-4xl px-4">
            <h1 className="text-6xl font-bold text-blue-500">HOJAS DE RUTA</h1>
            <p className="text-xl text-gray-600">
              Guías de aprendizaje estructuradas
            </p>
          </div>
        </div>
      </div>

      {/* Roadmaps Section */}
      <div className="container mx-auto px-4 py-16">
        <RoadmapsList initialRoadmaps={roadmaps} />
      </div>
    </div>
  );
}
