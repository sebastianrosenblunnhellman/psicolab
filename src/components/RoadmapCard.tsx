import { Roadmap } from '@/utils/roadmaps';
import Link from 'next/link';
import { FaMapMarkedAlt, FaClock, FaBookReader } from 'react-icons/fa';

interface RoadmapCardProps {
  roadmap: Roadmap;
}

export default function RoadmapCard({ roadmap }: RoadmapCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaMapMarkedAlt className="w-6 h-6 text-purple-500" />
          <h3 className="text-xl font-bold text-gray-800">{roadmap.title}</h3>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <FaClock className="w-4 h-4" />
            <span>{roadmap.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaBookReader className="w-4 h-4" />
            <span>{roadmap.level}</span>
          </div>
        </div>

        <p className="text-gray-600 mb-4">{roadmap.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {roadmap.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="space-y-2 mb-6">
          <h4 className="font-semibold text-gray-700">Temas principales:</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {roadmap.topics?.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
          </ul>
        </div>

        <Link
          href={`/materiales/hojas-de-ruta/${roadmap.slug}`}
          className="inline-block w-full text-center py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Ver Hoja de Ruta
        </Link>
      </div>
    </div>
  );
}