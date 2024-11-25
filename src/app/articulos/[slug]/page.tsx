import { getArticleBySlug, getArticleSlugs } from '@/utils/articles';
import NetworkAnimation from '@/components/NetworkAnimation';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug, ['content']);

  if (!article) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-gray-800">Artículo no encontrado</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with NetworkAnimation */}
      <div className="relative h-[70vh] bg-gradient-to-b from-gray-50 to-white">
        <NetworkAnimation className="absolute inset-0" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-6 max-w-4xl px-4">
            <h1 className="text-5xl font-bold text-gray-800">{article.title}</h1>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <time dateTime={article.date}>
                {new Date(article.date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <span>·</span>
              <span>{article.readTime} min de lectura</span>
              {article.author && (
                <>
                  <span>·</span>
                  <span>{article.author}</span>
                </>
              )}
            </div>
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-gray-600 text-xl leading-relaxed">
            {article.excerpt}
          </div>
          <div 
            className="prose prose-lg prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content || '' }}
          />
        </div>
      </div>
    </div>
  );
}
