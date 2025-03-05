import NetworkAnimation from '@/components/NetworkAnimation';
import ArticlesList from '@/components/ArticlesList';
import { getAllArticles } from '@/utils/articles';

export const metadata = {
  title: 'Artículos | Psi Colab',
  description: 'Explora nuestros artículos sobre psicología, investigación y práctica clínica.',
};

export default async function ArticulosPage() {
  const articles = await getAllArticles();

  return (
    <div className="bg-white">
      

      {/* Articles Section */}
      <div className="container mx-auto px-4 py-16">
        <ArticlesList initialArticles={articles} />
      </div>
    </div>
  );
}
