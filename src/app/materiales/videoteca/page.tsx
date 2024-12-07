import NetworkAnimation from '@/components/NetworkAnimation';
import TypewriterText from '@/components/TypewriterText';
import VideosList from '@/components/VideosList';
import { getAllVideos } from '@/utils/videos';

export const metadata = {
  title: 'Videoteca | Psi Colab',
  description: 'Explora nuestra colección de videos educativos sobre psicología.',
};

export default async function VideotecaPage() {
  const videos = await getAllVideos();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-[50vh] bg-gradient-to-b from-gray-50 to-white">
        <NetworkAnimation className="absolute inset-0" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-4xl px-4">
            <h1 className="text-6xl font-bold text-blue-500">VIDEOTECA</h1>
            <div className="h-8">
              <TypewriterText
                texts={[
                  'Aprende con contenido audiovisual',
                  'Descubre nuevas perspectivas',
                  'Explora temas complejos',
                  'Mejora tu comprensión',
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

      {/* Videos Section */}
      <div className="container mx-auto px-4 py-16">
        <VideosList initialVideos={videos} />
      </div>
    </div>
  );
}