import NetworkAnimation from '@/components/NetworkAnimation';
import ResourcesList from '@/components/ResourcesList';
import { getAllResources } from '@/utils/resources';

export const metadata = {
  title: 'Recursos | Psi Colab',
  description: 'Explora nuestra colección de recursos educativos, incluyendo libros, videos y más.',
};

export default async function ResourcesPage() {
  const resources = await getAllResources();

  return (
    <div className="bg-white">
      {/* Resources Section */}
      <div className="container mx-auto px-4 py-16">
        <ResourcesList initialResources={resources} />
      </div>
    </div>
  );
}
