import NetworkAnimation from '@/components/NetworkAnimation';
import TypewriterText from '@/components/TypewriterText';
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
      {/* Hero Section */}
      <div className="relative h-[50vh] bg-gradient-to-b from-gray-50 to-white">
        <NetworkAnimation className="absolute inset-0" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-4xl px-4">
            <h1 className="text-6xl font-bold text-blue-500">ARTÍCULOS</h1>
            <div className="h-8">
              <TypewriterText
                texts={[
                  'Explora el conocimiento psicológico',
                  'Descubre nuevas perspectivas',
                  'Aprende de la investigación',
                  'Mejora tu práctica clínica',
                ]}
                typingSpeed={80}
                deletingSpeed={40}
                delayBetween={2000}
                className="text-xl text-gray-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className="container mx-auto px-4 py-16">
        <ArticlesList initialArticles={articles} />
      </div>
    </div>
  );
}
