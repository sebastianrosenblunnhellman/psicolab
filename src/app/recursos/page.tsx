import { getAllResources } from '@/utils/resources';
import ResourcesListPage from '@/components/ResourcesListPage';

export const metadata = {
  title: 'Recursos - Psicolab',
  description: 'Explora nuestra biblioteca de recursos de psicología',
};

export default async function ResourcesPage() {
  const resources = await getAllResources();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Recursos</h1>
      <ResourcesListPage initialResources={resources} />
    </div>
  );
}