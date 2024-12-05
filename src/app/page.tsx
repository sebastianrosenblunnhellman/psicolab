import Link from 'next/link';
import Newsletter from '@/components/Newsletter';
import NetworkAnimation from '@/components/NetworkAnimation';
import TypewriterText from '@/components/TypewriterText';
import BlogCard from '@/components/BlogCard';
import { getAllArticles } from '@/utils/articles';

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
            <TypewriterText
              prefix="Hecho "
              suffixes={["para estudiantes", "por estudiantes"]}
              typingSpeed={100}
              deletingSpeed={50}
              delayBetween={3000}
            />
          </p>
        </div>
        <div className="absolute inset-0">
          <NetworkAnimation />
        </div>
      </section>

      {/* Recent Articles Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">
          Artículos Recientes
        </h2>
        {recentArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
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

      {/* About Section */}
      <section className="container mx-auto px-4 py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Sobre Psi Colab
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Somos una plataforma dedicada a conectar estudiantes de psicología con conocimiento de calidad. 
            Nuestro objetivo es crear un espacio colaborativo donde el aprendizaje y el intercambio de ideas 
            florezcan, facilitando el acceso a recursos educativos valiosos y promoviendo el desarrollo 
            profesional de futuros psicólogos.
          </p>
          <Link
            href="/nosotros"
            className="inline-block text-teal-500 hover:text-teal-600 font-medium"
          >
            Conoce más sobre nosotros →
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Mantente Actualizado
          </h2>
          <p className="text-gray-600 mb-8">
            Suscríbete para recibir los últimos artículos y recursos directamente en tu correo
          </p>
          <Newsletter />
        </div>
      </section>
    </div>
  );
}