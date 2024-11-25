import Link from 'next/link';
import { Article } from '@/utils/articles';

type BlogCardProps = Article;

export default function BlogCard({
  slug,
  title,
  date,
  excerpt,
  tags,
  readTime,
  author
}: BlogCardProps) {
  if (!slug || !title) {
    return null;
  }

  return (
    <article className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <Link href={`/articulos/${slug}`} className="block">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 hover:text-teal-500 transition-colors">
          {title}
        </h2>
      </Link>
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <time dateTime={date}>
          {new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        {readTime && (
          <>
            <span>·</span>
            <span>{readTime} min de lectura</span>
          </>
        )}
        {author && (
          <>
            <span>·</span>
            <span>{author}</span>
          </>
        )}
      </div>
      <p className="text-gray-600 mb-4">{excerpt}</p>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
