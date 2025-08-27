import { getAllResources } from '@/utils/resources';
import ResourcesListPage from '@/components/ResourcesListPage';

export const metadata = {
  title: 'Psicolab | Recursos'
};

export default async function ResourcesPage() {
  const resources = await getAllResources();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <ResourcesListPage initialResources={resources} />
    </div>
  );
}