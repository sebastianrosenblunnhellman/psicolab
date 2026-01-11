import Link from 'next/link';
import Image from 'next/image';
import { FaExternalLinkAlt, FaDownload } from 'react-icons/fa';
import LikeButton from './LikeButton';

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
  const href = `/recursos/${id}`;

  return (
    <Link href={href} className="block group h-full">
      <article className="bg-white rounded-2xl shadow-soft border border-neutral-100 hover:shadow-soft-lg hover:border-primary-200 transition-all duration-300 overflow-hidden h-full flex flex-col group-hover:-translate-y-1">
        {/* Image */}
        <div className="relative w-full pt-6 px-6 bg-neutral-50/50">
          <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-neutral-100 shadow-sm">
            <Image
              src={image}
              alt={title}
              width={1080}
              height={1080}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              priority={false}
            />
          </div>

          {/* Like Button */}
          <div className="absolute top-8 right-8 z-10">
             <LikeButton slug={id} title={title} type="material" className="shadow-soft" />
          </div>
          
          {/* External link or download badge */}
          {downloadUrl && (
            <div className="absolute top-8 left-8 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-soft flex items-center gap-2 z-10">
              <FaDownload className="w-3.5 h-3.5 text-primary-600" />
              <span className="text-xs font-semibold text-neutral-700">Recurso</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Type badge */}
          {type && (
            <div className="mb-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-50 text-accent-700 border border-accent-100">
                {type}
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className="text-xl font-bold text-neutral-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors leading-tight">
            {title}
          </h3>
          
          {/* Description */}
          {description && (
            <p className="text-sm text-neutral-600 mb-4 line-clamp-3 leading-relaxed flex-grow">
              {description}
            </p>
          )}
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100 mt-auto">
            {author && (
              <div className="flex items-center gap-2 text-xs">
                <div className="w-6 h-6 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {author.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-neutral-700">{author}</span>
              </div>
            )}

            {/* Action indicator */}
            <div className="flex items-center gap-1 text-primary-600 font-medium text-sm ml-auto">
              <span className="group-hover:translate-x-1 transition-transform">Ver más</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
