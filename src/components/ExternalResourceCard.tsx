import { ExternalResource } from '@/utils/externalResources';
import { FaExternalLinkAlt, FaTag } from 'react-icons/fa';

interface ExternalResourceCardProps {
  resource: ExternalResource;
}

export default function ExternalResourceCard({ resource }: ExternalResourceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">{resource.title}</h3>
          <span className="text-sm text-gray-500">{resource.type}</span>
        </div>

        <p className="text-gray-600 mb-4">{resource.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {resource.tags?.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
            >
              <FaTag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <span>{resource.author}</span>
          <span>{resource.language}</span>
        </div>

        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full gap-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span>Visitar Recurso</span>
          <FaExternalLinkAlt className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}