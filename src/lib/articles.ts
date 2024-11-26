import path from 'path';
import { promises as fs } from 'fs';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
});

const articlesDirectory = path.join(process.cwd(), 'content/articles');

export interface Article {
  slug: string;
  title: string;
  date: string;
  author: string;
  tags: string[];
  excerpt: string;
  readTime: number;
  content: string;
  published: boolean;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const filePath = path.join(articlesDirectory, `${slug}.md`);
    const content = await fs.readFile(filePath, 'utf8');
    const { data, content: markdownContent } = matter(content);

    const article: Article = {
      slug,
      title: data.title,
      date: data.date,
      author: data.author,
      tags: data.tags || [],
      excerpt: data.excerpt || markdownContent.slice(0, 200) + '...',
      readTime: Math.ceil(markdownContent.split(/\s+/).length / 200),
      content: md.render(markdownContent),
      published: data.published !== false,
    };

    if (!article.published) {
      return null;
    }

    return article;
  } catch (error) {
    console.error(`Error loading article ${slug}:`, error);
    return null;
  }
}

export async function getAllArticles(): Promise<Article[]> {
  try {
    const fileNames = await fs.readdir(articlesDirectory);
    const articles = await Promise.all(
      fileNames
        .filter(fileName => fileName.endsWith('.md'))
        .map(async fileName => {
          const slug = fileName.replace(/\.md$/, '');
          const article = await getArticleBySlug(slug);
          return article;
        })
    );

    return articles
      .filter((article): article is Article => article !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error loading articles:', error);
    return [];
  }
}
