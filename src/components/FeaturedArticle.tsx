import Link from 'next/link';
    import Image from 'next/image';

    interface FeaturedArticleProps {
      slug: string;
      title: string;
      excerpt: string;
      image?: string;
    }

    export default function FeaturedArticle({ slug, title, excerpt, image }: FeaturedArticleProps) {
      const defaultImage = '/images/default-article.jpg';

      return (
        <Link
          href={`/articulos/${slug}`}
          className="block bg-white hover:shadow-sm transition-all duration-200"
        >
          <article className="h-full">
            <div className="relative w-full h-48">
              <Image
                src={image || defaultImage}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
              <p className="text-gray-600">{excerpt}</p>
            </div>
          </article>
        </Link>
      );
    }
