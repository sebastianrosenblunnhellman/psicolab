'use server';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Course {
  slug: string;
  title: string;
  type: string;
  excerpt: string;
  date?: string;
  tags?: string[];
  author?: string;
  courseTime?: string;
  nivel?: string;
}

const coursesDirectory = path.join(process.cwd(), 'content/courses');

// Ensure the courses directory exists
function ensureCoursesDirectory() {
  if (!fs.existsSync(coursesDirectory)) {
    fs.mkdirSync(coursesDirectory, { recursive: true });
  }
}

export async function getAllCourses(): Promise<Course[]> {
  try {
    ensureCoursesDirectory();
    
    const fileNames = fs.readdirSync(coursesDirectory);
    const allCoursesData = await Promise.all(
      fileNames
        .filter(fileName => fileName.endsWith('.md'))
        .map(async fileName => {
          try {
            const slug = fileName.replace(/.md$/, '');
            const course = await getCourseBySlug(slug);
            return course;
          } catch (error) {
            console.error(`Error processing course ${fileName}:`, error);
            return null;
          }
        })
    );

    return allCoursesData
      .filter((course): course is Course => course !== null)
      .sort((a, b) => {
        if (!a.date || !b.date) return 0;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  } catch (error) {
    console.error('Error getting all courses:', error);
    return [];
  }
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  try {
    ensureCoursesDirectory();
    
    const fileNames = fs.readdirSync(coursesDirectory);
    const fileName = fileNames.find(
      fn => fn.toLowerCase().replace(/.md$/, '') === decodeURIComponent(slug).toLowerCase()
    );

    if (!fileName) {
      console.warn(`Course not found: ${slug}`);
      return null;
    }

    const fullPath = path.join(coursesDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    // Validate required fields
    if (!data.title || !data.type) {
      console.error(`Course ${slug} is missing required fields`);
      return null;
    }

    const course: Course = {
      slug: fileName.replace(/.md$/, ''),
      title: data.title,
      type: data.type,
      excerpt: data.excerpt || '',
      date: data.date ? new Date(data.date).toISOString() : undefined,
      tags: Array.isArray(data.tags) ? data.tags : [],
      author: data.author,
      courseTime: data.courseTime,
      nivel: data.nivel
    };

    return course;
  } catch (error) {
    console.error(`Error reading course ${slug}:`, error);
    return null;
  }
}