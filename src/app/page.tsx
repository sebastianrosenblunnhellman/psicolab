import Link from 'next/link';
    import NetworkAnimation from '@/components/NetworkAnimation';
    import BlogCard from '@/components/BlogCard';
    import { getAllArticles } from '@/utils/articles';
    import { featuredArticles } from '@/config/featured';
    import FeaturedCarousel from '@/components/FeaturedCarousel';

    export default async function Home() {
      const articles = await getAllArticles();
      const recentArticles = articles.slice(0, 4);

      return (
        <div className="bg-white">
          {/* Hero Section */}
          <section className="container mx-auto px-4 py-24 text-center relative min-h-[400px]">
            <div className="relative z-10">
              <h1 className="text-5xl font-bold mb-6">
                <span className="text-teal-500">CONECTANDO</span>{" "}
                <span className="text-blue-500">CONOCIMIENTO</span>
              </h1>
              <p className="text-xl text-gray-600 relative z-10">
                Hecho por y para estudiantes
              </p>
            </div>
            <div className="absolute inset-0">
              <NetworkAnimation />
            </div>
          </section>

          {/* Featured Articles Carousel */}
          <section className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              Destacado
            </h2>
            <FeaturedCarousel articles={featuredArticles} />
          </section>

          {/* Recent Articles Section */}
          <section className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-12">
              Artículos Recientes
            </h2>
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
