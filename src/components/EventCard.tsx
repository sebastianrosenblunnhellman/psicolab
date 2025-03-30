import Link from 'next/link';
import { FaCalendar, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import Image from 'next/image';

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  image?: string;
  date: string;
  time?: string;
  location?: string;
  isVirtual?: boolean;
}

export default function EventCard({
  id,
  title,
  description,
  image = '/images/miniatura.jpg',
  date,
  time,
  location,
  isVirtual = false
}: EventCardProps) {
  const formattedDate = new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/eventos/${id}`} className="block h-48">
      <article className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-lg hover:border-teal-500 transition-all duration-300 flex flex-col md:flex-row overflow-hidden h-full">
        {/* Image column - square shape */}
        <div className="md:w-48 w-full h-full relative flex-shrink-0">
          <Image 
            src={image} 
            alt={title}
            width={192}
            height={192}
            className="object-cover h-full w-full"
            priority
          />
        </div>
        
        {/* Content column */}
        <div className="p-3 flex flex-col flex-grow overflow-hidden">
          <div className="mb-2">
            <span className="inline-block bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs font-medium">
              Evento {isVirtual ? 'Virtual' : 'Presencial'}
            </span>
          </div>
          
          <h3 className="text-lg font-bold text-gray-800 mb-2 hover:text-teal-600 transition-colors line-clamp-2">
            {title}
          </h3>
          
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{description}</p>
          
          <div className="flex flex-col space-y-1 text-xs text-gray-500 mt-auto">
            <div className="flex items-center">
              <FaCalendar className="mr-2 w-3 h-3" />
              <span>{formattedDate}</span>
            </div>
            
            {time && (
              <div className="flex items-center">
                <FaClock className="mr-2 w-3 h-3" />
                <span>{time}</span>
              </div>
            )}
            
            {location && (
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-2 w-3 h-3" />
                <span className="truncate">{location}</span>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
