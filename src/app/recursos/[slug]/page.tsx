import { getResourceBySlug, getAllResources } from '@/utils/resources';
import Link from 'next/link';
import { FaDownload, FaArrowLeft } from 'react-icons/fa';

interface ResourcePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const resources = await getAllResources();
  return resources.map((resource) => ({
    slug: resource.slug,
  }));
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug, true);

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Recurso no encontrado</h1>
          <p className="text-gray-600 mt-2">El recurso que buscas no existe o ha sido movido.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link 
            href="/recursos" 
            className="inline-flex items-center text-gray-500 hover:text-primary-600 mb-8 transition-colors text-sm font-medium"
        >
            <FaArrowLeft className="mr-2 w-3 h-3" />
            Volver a Materiales
        </Link>

        <article className="prose prose-lg max-w-none">
            <header className="mb-10 not-prose">
                <span className="text-primary-600 text-xs font-bold uppercase tracking-widest mb-2 block">
                    {resource.type}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                    {resource.title}
                </h1>
                {resource.author && (
                    <p className="text-gray-500 font-medium">Por {resource.author}</p>
                )}
            </header>

            {/* Render Markdown Content */}
            <div className="text-gray-700 leading-relaxed">
                {resource.content ? (
                    <div dangerouslySetInnerHTML={{ __html: resource.content }} />
                ) : (
                    <p>{resource.excerpt}</p>
                )}
            </div>

            {resource.link && (
                <div className="mt-12 not-prose">
                    <a 
                        href={resource.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-primary-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-primary-700 transition-all shadow-md hover:shadow-lg"
                    >
                        <FaDownload />
                        Acceder al Material Completo
                    </a>
                </div>
            )}
        </article>
      </div>
    </div>
  );
}
