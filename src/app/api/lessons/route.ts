import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const course = searchParams.get('course');

  if (!course) {
    return NextResponse.json({ error: 'Course parameter is required' }, { status: 400 });
  }

  try {
    // Path to the course directory
    const courseDir = path.join(process.cwd(), 'src/app/aprendizaje', course);
    
    // Check if directory exists
    if (!fs.existsSync(courseDir)) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Get all markdown files in the directory
    const files = fs.readdirSync(courseDir)
      .filter(file => file.endsWith('.md'))
      .sort((a, b) => {
        // Sort numerically if filenames are numbers
        const numA = parseInt(a.replace('.md', ''));
        const numB = parseInt(b.replace('.md', ''));
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        return a.localeCompare(b);
      });

    return NextResponse.json({ lessons: files });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 });
  }
}