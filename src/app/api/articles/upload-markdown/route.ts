import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

function toYAML(value: any): string {
  if (Array.isArray(value)) return `[${value.map(v => `'${String(v).replace(/'/g, "''")}'`).join(', ')}]`;
  if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  return `'${String(value).replace(/'/g, "''")}'`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, title, date, excerpt, tags = [], author, published = true, md = '' } = body || {};

    if (!slug || !title) {
      return NextResponse.json({ error: 'Missing required fields: slug, title' }, { status: 400 });
    }

    const finalFileName = slug.endsWith('.md') ? slug : `${slug}.md`;
    const articlesDir = join(process.cwd(), 'content', 'articles');
    if (!existsSync(articlesDir)) await mkdir(articlesDir, { recursive: true });

    const fmLines: string[] = [
      '---',
      `title: ${toYAML(title)}`,
      date ? `date: ${toYAML(date)}` : '',
      excerpt ? `excerpt: ${toYAML(excerpt)}` : '',
      Array.isArray(tags) ? `tags: ${toYAML(tags)}` : '',
      author ? `author: ${toYAML(author)}` : '',
      `published: ${published ? 'true' : 'false'}`,
      '---',
      ''
    ].filter(Boolean);

    const content = fmLines.join('\n') + (md || '');
    const filePath = join(articlesDir, finalFileName);
    await writeFile(filePath, content, 'utf8');

    return NextResponse.json({ success: true, message: `Article saved as ${finalFileName}`, path: filePath });
  } catch (error) {
    console.error('Error saving article markdown:', error);
    return NextResponse.json({ error: 'Failed to save article' }, { status: 500 });
  }
}
