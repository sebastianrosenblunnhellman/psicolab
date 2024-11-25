import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import matter from 'gray-matter';

const articlesDirectory = path.join(process.cwd(), 'content/articles');

export async function GET() {
  try {
    const files = await fs.readdir(articlesDirectory);
    const articles = await Promise.all(
      files
        .filter(file => file.endsWith('.md'))
        .map(async (file) => {
          const filePath = path.join(articlesDirectory, file);
          const content = await fs.readFile(filePath, 'utf8');
          const { data } = matter(content);
          
          return {
            slug: file.replace(/\.md$/, ''),
            title: data.title,
            date: data.date,
            author: data.author,
            tags: data.tags || [],
            excerpt: data.excerpt || '',
            published: data.published !== false,
          };
        })
    );

    const publishedArticles = articles
      .filter(article => article.published)
      .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));

    return NextResponse.json(publishedArticles);
  } catch (error) {
    console.error('Error loading articles:', error);
    return NextResponse.json({ error: 'Error loading articles' }, { status: 500 });
  }
}
