import { getAllResources } from '@/utils/resources';
import ResourcesListPage from '@/components/ResourcesListPage';

export const metadata = {
  title: 'Psicolab | Materiales'
};

export default async function ResourcesPage() {
  const resources = await getAllResources();
  
  return (
    <ResourcesListPage initialResources={resources} />
  );
}