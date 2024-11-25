export interface Article {
  slug: string;
  title: string;
  date: string;
  author: string;
  tags: string[];
  excerpt: string;
  content: string;
  readTime: number;
  published: boolean;
  image?: string; // URL de la imagen de portada
}

export interface ArticleMetadata {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
  readTime: string;
  published: boolean;
}
