import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Book {
  slug: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  downloadUrl: string;
  tags?: string[];
  year?: string;
  pages?: number;
  language?: string;
}

const booksDirectory = path.join(process.cwd(), 'content/books');

export async function getAllBooks(): Promise<Book[]> {
  try {
    const fileNames = fs.readdirSync(booksDirectory);
    const allBooks = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(booksDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        return {
          slug,
          title: data.title || 'Sin título',
          author: data.author || 'Autor desconocido',
          description: data.description || '',
          coverImage: data.coverImage || '/book-img/default-book.jpg',
          downloadUrl: data.downloadUrl || '#',
          tags: Array.isArray(data.tags) ? data.tags : [],
          year: data.year || '',
          pages: data.pages || 0,
          language: data.language || 'Español',
        } as Book;
      });

    return allBooks.sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.error('Error loading books:', error);
    return [];
  }
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  try {
    const fullPath = path.join(booksDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title || 'Sin título',
      author: data.author || 'Autor desconocido',
      description: data.description || '',
      coverImage: data.coverImage || '/book-img/default-book.jpg',
      downloadUrl: data.downloadUrl || '#',
      tags: Array.isArray(data.tags) ? data.tags : [],
      year: data.year || '',
      pages: data.pages || 0,
      language: data.language || 'Español',
    };
  } catch (error) {
    console.error(`Error loading book ${slug}:`, error);
    return null;
  }
}