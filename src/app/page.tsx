import Link from 'next/link';
  import NetworkAnimation from '@/components/NetworkAnimation';
  import BlogCard from '@/components/BlogCard';
  import { getAllArticles } from '@/utils/articles';
  import { featuredArticles } from '@/config/featured';

    export default async function Home() {
      const articles = await getAllArticles();
      const recentArticles = articles.slice(0, 4);

      return (
        <div className="bg-white">
          {/* Hero Section */}
          <section className="container mx-auto px-4 pt-32 pb-24 sm:pt-36 sm:pb-28 md:pt-40 text-center relative min-h-[400px]">
            <div className="relative z-10">
              <h1 className="mx-auto max-w-[20ch] text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6 break-words">
                <span className="text-teal-500 block sm:inline">CONECTANDO </span>
                <span className="text-blue-500 block sm:inline">CONOCIMIENTO</span>
              </h1>
            </div>
            <div className="absolute inset-0">
              <NetworkAnimation />
            </div>
          </section>

          {/* Featured section removed (carousel deleted) */}

          {/* Recent Articles Section */}
          <section className="container mx-auto px-4 py-16">
            {recentArticles.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 mb-12">
                {recentArticles.map((article) => (
                  <BlogCard
                    key={article.slug}
                    slug={article.slug}
                    title={article.title}
                    date={article.date}
                    excerpt={article.excerpt}
                    tags={article.tags}
                    readTime={article.readTime}
                    author={article.author}
                    image={article.image}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 py-8">
                No hay artículos disponibles en este momento.
              </p>
            )}
            <div className="text-center">
              <Link
                href="/articulos"
                className="inline-block px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Más Artículos
              </Link>
            </div>
          </section>
        </div>
      );
    }
