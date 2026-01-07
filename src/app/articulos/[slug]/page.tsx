import { getAllArticles, getArticleBySlug } from '@/utils/articles';
import CommentsSection from '@/components/CommentsSection';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug, ['content']);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Artículo no encontrado</h1>
          <p className="text-gray-600 mt-2">El artículo que buscas no existe o ha sido movido.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <article className="article-container max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">{article.title}</h1>
          <div className="flex flex-wrap items-center text-gray-600 mb-6 md:mb-8 space-x-2 md:space-x-4">
            <span>{article.date ? new Date(article.date).toLocaleDateString() : ''}</span>
            <span>•</span>
            <span>{article.author}</span>
            <span>•</span>
            <span>{article.readTime} min de lectura</span>
          </div>
          
          {/* Server-rendered content */}
          {article.content && (
            <div className="article-content prose prose-lg max-w-none mt-8" 
                 dangerouslySetInnerHTML={{ __html: article.content }} />
          )}
          
          <CommentsSection />
        </article>
      </div>
    </div>
  );
}
