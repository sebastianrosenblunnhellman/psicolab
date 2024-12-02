import { getExternalResourceBySlug } from '@/utils/externalResources';
import NetworkAnimation from '@/components/NetworkAnimation';
import { notFound } from 'next/navigation';

interface ExternalResourcePageProps {
  params: {
    slug: string;
  };
}

export default async function ExternalResourcePage({ params }: ExternalResourcePageProps) {
  const resource = await getExternalResourceBySlug(params.slug);

  if (!resource) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] bg-gradient-to-b from-gray-50 to-white">
        <NetworkAnimation className="absolute inset-0" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-4xl px-4">
            <h1 className="text-4xl font-bold text-gray-800">{resource.title}</h1>
            <div className="flex items-center justify-center gap-4 text-gray-600">
              <span>{resource.type}</span>
              <span>·</span>
              <span>{resource.author}</span>
              <span>·</span>
              <span>{resource.language}</span>
            </div>
            {resource.tags && resource.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {resource.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg prose-gray max-w-none">
            <div dangerouslySetInnerHTML={{ __html: resource.content || '' }} />
          </div>
        </div>
      </div>
    </div>
  );
}