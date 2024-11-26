import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(
  request: NextRequest,
  context: { params: { slug: string } }
) {
  try {
    const filePath = path.join(articlesDirectory, `${context.params.slug}.md`);
    const content = await fs.readFile(filePath, 'utf8');
    const { data, content: markdownContent } = matter(content);

    const article = {
      slug: context.params.slug,
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
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error(`Error loading article ${context.params.slug}:`, error);
    return NextResponse.json(
      { error: 'Article not found' },
      { status: 404 }
    );
  }
}
