import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const course = searchParams.get('course');
  const lesson = searchParams.get('lesson');

  if (!course || !lesson) {
    return NextResponse.json({ error: 'Course and lesson parameters are required' }, { status: 400 });
  }

  try {
    // Path to the lesson file
    const filePath = path.join(process.cwd(), 'src/app/aprendizaje', course, `${lesson}.md`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Read file content
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { content } = matter(fileContent);

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error fetching lesson content:', error);
    return NextResponse.json({ error: 'Failed to fetch lesson content' }, { status: 500 });
  }
}