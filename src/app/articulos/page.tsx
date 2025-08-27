import NetworkAnimation from '@/components/NetworkAnimation';
import ArticlesList from '@/components/ArticlesList';
import { getAllArticles } from '@/utils/articles';

export const metadata = {
  title: 'Psi Colab | Artículos'
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
