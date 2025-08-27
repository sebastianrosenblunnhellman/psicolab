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
    const { slug, title, excerpt, tags = [], author, date, type = 'course', nivel, courseTime, md = '' } = body || {};

    if (!slug || !title || !type) {
      return NextResponse.json({ error: 'Missing required fields: slug, title, type' }, { status: 400 });
    }

    const finalFileName = slug.endsWith('.md') ? slug : `${slug}.md`;
    const coursesDir = join(process.cwd(), 'content', 'courses');
    if (!existsSync(coursesDir)) await mkdir(coursesDir, { recursive: true });

    const fmLines: string[] = [
      '---',
      `title: ${toYAML(title)}`,
      `type: ${toYAML(type)}`,
      excerpt ? `excerpt: ${toYAML(excerpt)}` : '',
      date ? `date: ${toYAML(date)}` : '',
      Array.isArray(tags) ? `tags: ${toYAML(tags)}` : '',
      author ? `author: ${toYAML(author)}` : '',
      nivel ? `nivel: ${toYAML(nivel)}` : '',
      courseTime ? `courseTime: ${toYAML(courseTime)}` : '',
      '---',
      ''
    ].filter(Boolean);

    const content = fmLines.join('\n') + (md || '');
    const filePath = join(coursesDir, finalFileName);
    await writeFile(filePath, content, 'utf8');

    return NextResponse.json({ success: true, message: `Course saved as ${finalFileName}`, path: filePath });
  } catch (error) {
    console.error('Error saving course markdown:', error);
    return NextResponse.json({ error: 'Failed to save course' }, { status: 500 });
  }
}
