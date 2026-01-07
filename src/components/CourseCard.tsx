import Link from 'next/link';
import Image from 'next/image';
import { FaClock, FaUser, FaStar } from 'react-icons/fa';

interface CourseCardProps {
  title: string;
  description: string;
  image: string;
  instructor: string;
  duration: string;
  level: string;
  rating: number;
  students: number;
  status: 'available' | 'coming_soon' | 'in_progress';
  slug: string;
}

export default function CourseCard({
  title,
  description,
  image,
  instructor,
  duration,
  level,
  rating,
  students,
  status,
  slug
}: CourseCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-neutral-100 shadow-soft hover:shadow-soft-lg transition-all duration-300 overflow-hidden flex flex-col h-full hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative w-full pt-6 px-6 flex justify-center bg-neutral-50/50">
        <div className="relative w-full aspect-square overflow-hidden rounded-xl shadow-sm">
          <Image
            src={image}
            alt={title}
            width={1080}
            height={1080}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        {/* Status Badge */}
        <div className="absolute top-8 right-8 z-10">
          {status === 'coming_soon' && (
            <span className="px-3 py-1 bg-accent-500 text-white text-xs font-bold rounded-full shadow-lg">
              Próximamente
            </span>
          )}
          {status === 'available' && (
            <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
              Disponible
            </span>
          )}
        </div>

        {/* Level Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/30">
            {level}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex text-yellow-400 text-xs">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < Math.floor(rating) ? "fill-current" : "text-gray-300"} />
            ))}
          </div>
          <span className="text-xs text-neutral-500 font-medium">({students} alumnos)</span>
        </div>

        <h3 className="text-xl font-bold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {title}
        </h3>
        
        <p className="text-sm text-neutral-600 mb-4 line-clamp-2 flex-grow">
          {description}
        </p>

        <div className="flex items-center gap-4 text-xs text-neutral-500 mb-6">
          <div className="flex items-center gap-1.5">
            <FaUser className="text-primary-500" />
            <span>{instructor}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaClock className="text-primary-500" />
            <span>{duration}</span>
          </div>
        </div>

        {/* Footer / Action */}
        <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-neutral-500">Precio</span>
            <span className="text-lg font-bold text-primary-600">Gratis</span>
          </div>
          <Link
            href={status === 'available' ? `/cursos/${slug}` : '#'}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              status === 'available'
                ? 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
            }`}
          >
            {status === 'available' ? 'Ver Curso' : 'Notificarme'}
          </Link>
        </div>
      </div>
    </div>
  );
}