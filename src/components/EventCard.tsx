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
    <Link href={`/eventos/${id}`} className="block h-full">
      <article className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-lg hover:border-teal-500 transition-all duration-300 flex flex-col md:flex-row overflow-hidden h-full">
        {/* Image column */}
        <div className="md:w-1/4 relative flex-shrink-0">
          <Image 
            src={image} 
            alt={title}
            width={250}
            height={250}
            className="object-cover h-full w-full"
            priority
          />
        </div>
        
        {/* Content column */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="mb-4">
            <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
              Evento {isVirtual ? 'Virtual' : 'Presencial'}
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-teal-600 transition-colors">
            {title}
          </h3>
          
          <p className="text-gray-600 mb-4">{description}</p>
          
          <div className="flex flex-col space-y-2 text-sm text-gray-500 mt-auto">
            <div className="flex items-center">
              <FaCalendar className="mr-2" />
              <span>{formattedDate}</span>
            </div>
            
            {time && (
              <div className="flex items-center">
                <FaClock className="mr-2" />
                <span>{time}</span>
              </div>
            )}
            
            {location && (
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                <span>{location}</span>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
