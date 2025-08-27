import Link from 'next/link';
import Image from 'next/image';
import { FaExternalLinkAlt } from 'react-icons/fa';

interface ResourceCardProps {
  id: string;
  title: string;
  description: string;
  image?: string;
  type?: string;
  author?: string;
  downloadUrl?: string;
  tags?: string[];
}

export default function ResourceCard({
  id,
  title,
  description,
  image = '/images/miniatura.jpg',
  type,
  author,
  downloadUrl,
  tags
}: ResourceCardProps) {
  const href = downloadUrl || `/recursos/${id}`;
  const linkProps = downloadUrl
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {};

  return (
    <Link href={href} className="block group h-auto md:h-48" {...linkProps}>
      <article className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-lg hover:border-teal-500 transition-all duration-300 flex flex-col md:flex-row overflow-hidden h-full">
        {/* Imagen - cuadrada en mobile, columna fija en desktop */}
        <div className="relative w-full md:w-48 aspect-square md:aspect-auto md:h-full flex-shrink-0">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 192px"
            className="object-cover"
            priority={false}
          />
          {downloadUrl && (
            <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 shadow-sm text-gray-600 group-hover:text-teal-600">
              <FaExternalLinkAlt className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-3 flex flex-col flex-grow overflow-hidden">
          <h3 className="text-base font-semibold text-gray-800 group-hover:text-teal-600 transition-colors line-clamp-2">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
          )}
          {/* Zona inferior: tipo */}
          {type && (
            <div className="mt-auto pt-2">
              <span className="inline-block w-fit bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                {type}
              </span>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
