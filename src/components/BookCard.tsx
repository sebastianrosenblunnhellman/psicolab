import Image from 'next/image';
import { Book } from '@/utils/books';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-[2/3] w-full">
        <Image
          src={book.coverImage}
          alt={`Portada de ${book.title}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{book.title}</h3>
        <p className="text-gray-600 mb-2">{book.author}</p>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          {book.year && <span>{book.year}</span>}
          {book.pages && <span>· {book.pages} páginas</span>}
          {book.language && <span>· {book.language}</span>}
        </div>
        <p className="text-gray-600 mb-4 line-clamp-3">{book.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {book.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        <a
          href={book.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full text-center py-2 px-4 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
        >
          Descargar PDF
        </a>
      </div>
    </div>
  );
}