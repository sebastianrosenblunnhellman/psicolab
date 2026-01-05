import ArticlesList from '@/components/ArticlesList';
import { getAllArticles } from '@/utils/articles';

export const metadata = {
  title: 'Psi Colab | Blog'
};

export default async function ArticulosPage() {
  const articles = await getAllArticles();

  return (
    <ArticlesList initialArticles={articles} />
  );
}
