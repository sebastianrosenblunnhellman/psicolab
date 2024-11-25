import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ArticleMetadata, Article } from '@/types/article';
import readingTime from 'reading-time';

const articlesDirectory = path.join(process.cwd(), '_articles');

export function ensureArticlesDirectory() {
  if (!fs.existsSync(articlesDirectory)) {
    fs.mkdirSync(articlesDirectory, { recursive: true });
  }
}

export function getArticleFiles(): string[] {
  ensureArticlesDirectory();
  return fs.readdirSync(articlesDirectory)
    .filter(file => file.endsWith('.md') || file.endsWith('.mdx'));
}

export function getArticleBySlug(slug: string): Article | null {
  ensureArticlesDirectory();
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = path.join(articlesDirectory, `${realSlug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const readTimeResult = readingTime(content);

  const article: Article = {
    slug: realSlug,
    title: data.title,
    excerpt: data.excerpt,
    date: data.date,
    author: data.author,
    tags: data.tags || [],
    readTime: `${Math.ceil(readTimeResult.minutes)} min`,
    published: data.published !== false,
    content
  };

  return article;
}

export function getAllArticles(): Article[] {
  ensureArticlesDirectory();
  const slugs = getArticleFiles();
  const articles = slugs
    .map(slug => getArticleBySlug(slug))
    .filter((article): article is Article => 
      article !== null && article.published
    )
    .sort((a, b) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime());

  return articles;
}

export function createNewArticle(title: string, content: string, metadata: Partial<ArticleMetadata>) {
  ensureArticlesDirectory();
  
  const slug = title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '-');

  const date = new Date().toISOString().split('T')[0];
  const readTimeResult = readingTime(content);

  const frontmatter = {
    title,
    date,
    author: metadata.author || 'Admin',
    excerpt: metadata.excerpt || '',
    tags: metadata.tags || [],
    published: metadata.published !== false,
  };

  const fileContent = matter.stringify(content, frontmatter);
  const filePath = path.join(articlesDirectory, `${slug}.md`);

  fs.writeFileSync(filePath, fileContent);

  return {
    slug,
    ...frontmatter,
    readTime: `${Math.ceil(readTimeResult.minutes)} min`,
    content
  };
}

export function updateArticle(slug: string, content: string, metadata: Partial<ArticleMetadata>) {
  const existingArticle = getArticleBySlug(slug);
  if (!existingArticle) {
    throw new Error(`Article with slug ${slug} not found`);
  }

  const updatedFrontmatter = {
    ...existingArticle,
    ...metadata,
    date: metadata.date || existingArticle.date,
    author: metadata.author || existingArticle.author,
    tags: metadata.tags || existingArticle.tags,
    published: metadata.published !== undefined ? metadata.published : existingArticle.published,
  };

  const fileContent = matter.stringify(content, updatedFrontmatter);
  const filePath = path.join(articlesDirectory, `${slug}.md`);

  fs.writeFileSync(filePath, fileContent);

  return {
    slug,
    ...updatedFrontmatter,
    content
  };
}

export function deleteArticle(slug: string): boolean {
  const filePath = path.join(articlesDirectory, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return false;
  }

  fs.unlinkSync(filePath);
  return true;
}
