'use server';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';

export interface Article {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
  readTime?: number;
  author?: string;
  content?: string;
}

const articlesDirectory = path.join(process.cwd(), 'content/articles');

export async function getAllArticles(): Promise<Article[]> {
  try {
    const fileNames = fs.readdirSync(articlesDirectory);
    const allArticlesData = await Promise.all(
      fileNames
        .filter(fileName => fileName.endsWith('.md'))
        .map(async fileName => {
          const slug = fileName.replace(/\.md$/, '');
          return getArticleBySlug(slug, ['title', 'date', 'excerpt', 'tags', 'readTime', 'author']);
        })
    );

    return allArticlesData.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error('Error getting all articles:', error);
    return [];
  }
}

export async function getArticleBySlug(slug: string, fields: string[] = []): Promise<Article> {
  try {
    const fileNames = fs.readdirSync(articlesDirectory);
    const fileName = fileNames.find(
      fn => fn.toLowerCase().replace(/\.md$/, '') === decodeURIComponent(slug).toLowerCase()
    );

    if (!fileName) {
      throw new Error(`Article not found: ${slug}`);
    }

    const fullPath = path.join(articlesDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    const article: Article = {
      slug: fileName.replace(/\.md$/, ''),
      title: data.title || 'Sin título',
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      excerpt: data.excerpt || content.slice(0, 200).trim() + '...',
      tags: Array.isArray(data.tags) ? data.tags : [],
      readTime: readTime,
      author: data.author || 'Anónimo',
    };

    if (fields.includes('content')) {
      const processedContent = await unified()
        .use(remarkParse)
        .use(remarkHtml)
        .process(content);
      article.content = processedContent.toString();
    }

    return article;
  } catch (error) {
    console.error(`Error reading article ${slug}:`, error);
    return {
      slug,
      title: 'Error loading article',
      date: new Date().toISOString(),
      excerpt: 'This article could not be loaded.',
      tags: ['error'],
    };
  }
}

export async function getArticleSlugs(): Promise<string[]> {
  try {
    const fileNames = fs.readdirSync(articlesDirectory);
    return fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => fileName.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Error getting article slugs:', error);
    return [];
  }
}
