'use server';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true
});

function wrapReferencesSection(html: string): string {
  if (!html || html.includes('references-section')) {
    return html;
  }

  const headingRegex = /<h[1-6][^>]*>.*?Referencias.*?<\/h[1-6]>/i;
  const match = headingRegex.exec(html);

  if (!match || match.index === undefined) {
    return html;
  }

  const headingMarkup = match[0];
  const summaryText = headingMarkup.replace(/<[^>]+>/g, '').trim() || 'Referencias';
  const headingStart = match.index;
  const contentStart = headingStart + headingMarkup.length;

  const before = html.slice(0, headingStart);
  const after = html.slice(contentStart);

  return (
    `${before}<details class="references-section"><summary>${summaryText}</summary>` +
    `<div class="references-content">${after}</div></details>`
  );
}

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
  image?: string;
  level?: string;
}

const articlesDirectory = path.join(process.cwd(), 'content/articles');

// Ensure the articles directory exists
function ensureArticlesDirectory() {
  if (!fs.existsSync(articlesDirectory)) {
    fs.mkdirSync(articlesDirectory, { recursive: true });
  }
}

export async function getAllArticles(): Promise<Article[]> {
  try {
    ensureArticlesDirectory();
    
    const fileNames = fs.readdirSync(articlesDirectory);
    const allArticlesData = await Promise.all(
      fileNames
        .filter(fileName => fileName.endsWith('.md'))
        .map(async fileName => {
          try {
            const slug = fileName.replace(/\.md$/, '');
            const article = await getArticleBySlug(slug, ['title', 'date', 'excerpt', 'tags', 'readTime', 'author']);
            return article;
          } catch (error) {
            console.error(`Error processing article ${fileName}:`, error);
            return null;
          }
        })
    );

    // Filter out any null articles and sort by date
    return allArticlesData
      .filter((article): article is Article => article !== null)
      .sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  } catch (error) {
    console.error('Error getting all articles:', error);
    return [];
  }
}

export async function getArticleBySlug(slug: string, fields: string[] = []): Promise<Article | null> {
  try {
    ensureArticlesDirectory();
    
    const fileNames = fs.readdirSync(articlesDirectory);
    const fileName = fileNames.find(
      fn => fn.toLowerCase().replace(/\.md$/, '') === decodeURIComponent(slug).toLowerCase()
    );

    if (!fileName) {
      console.warn(`Article not found: ${slug}`);
      return null;
    }

    const fullPath = path.join(articlesDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Validate required fields
    if (!data.title || !data.date) {
      console.error(`Article ${slug} is missing required fields`);
      return null;
    }

    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    const article: Article = {
      slug: fileName.replace(/\.md$/, ''),
      title: data.title,
      date: new Date(data.date).toISOString(),
      excerpt: data.excerpt || content.slice(0, 200).trim() + '...',
      tags: Array.isArray(data.tags) ? data.tags : [],
      readTime: readTime,
      author: data.author || 'Anónimo',
                  content: '', // Initialize with empty string
                  published: data.published !== false, // Default to true if not specified
                  image: typeof data.image === 'string' && data.image.length > 0 ? data.image : '/images/miniatura.jpg',
                  level: data.level || 'Principiante',
                };    // Only add content if specifically requested or if fields array is empty (get all)
    if (fields.length === 0 || fields.includes('content')) {
      const renderedHtml = md.render(content);
      article.content = wrapReferencesSection(renderedHtml);
    }

    return article;
  } catch (error) {
    console.error(`Error reading article ${slug}:`, error);
    return null;
  }
}

export async function getArticleSlugs(): Promise<string[]> {
  try {
    ensureArticlesDirectory();
    
    const fileNames = fs.readdirSync(articlesDirectory);
    return fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => fileName.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Error getting article slugs:', error);
    return [];
  }
}