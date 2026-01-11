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

export interface Course {
  slug: string;
  title: string;
  description: string;
  image: string;
  instructor: string;
  duration: string;
  level: string;
  rating: number;
  students: number;
  status: 'available' | 'coming_soon' | 'in_progress';
  category: string;
  content: string;
  date?: string;
}

export interface Lesson {
  slug: string;
  title: string;
  duration: string;
  videoUrl?: string;
  content: string;
}

export interface Module {
  slug: string;
  title: string; // Derived from folder name (e.g., "01-fundamentos" -> "Fundamentos")
  lessons: Lesson[];
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
    
    const entries = fs.readdirSync(coursesDirectory, { withFileTypes: true });
    
    const courses = await Promise.all(
      entries.map(async (entry) => {
        let slug = entry.name.replace(/\.md$/, '');
        
        // Skip dotfiles or unwanted directories
        if (entry.name.startsWith('.')) return null;

        return await getCourseBySlug(slug);
      })
    );

    return courses
      .filter((course): course is Course => course !== null)
      .sort((a, b) => {
        if (a.date && b.date) {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return a.title.localeCompare(b.title);
      });
  } catch (error) {
    console.error('Error getting all courses:', error);
    return [];
  }
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  try {
    if (!slug) return null;
    slug = decodeURIComponent(slug);

    ensureCoursesDirectory();
    
    let fullPath = path.join(coursesDirectory, `${slug}.md`);

    // Check if it's a folder-based course
    const folderPath = path.join(coursesDirectory, slug);
    if (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()) {
      fullPath = path.join(folderPath, 'index.md');
    }

    if (!fs.existsSync(fullPath)) {
      // Try searching case-insensitive if exact match failed
      const entries = fs.readdirSync(coursesDirectory);
      const match = entries.find(e => e.toLowerCase().replace(/\.md$/, '') === slug.toLowerCase());
      if (match) {
        slug = match.replace(/\.md$/, ''); // Update slug to correct case
        const matchedPath = path.join(coursesDirectory, match);
        if (fs.statSync(matchedPath).isDirectory()) {
            fullPath = path.join(matchedPath, 'index.md');
        } else {
            fullPath = matchedPath;
        }
      } else {
         // console.warn(`Course not found: ${slug}`);
         return null;
      }
    }

    // Final check to ensure we found a file
    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    if (!data.title) {
      console.error(`Course ${slug} is missing required fields`);
      return null;
    }

    const course: Course = {
      slug: slug,
      title: data.title,
      description: data.description || '',
      image: data.image || '/images/miniaturaB.png',
      instructor: data.instructor || 'Instructor PsiColab',
      duration: data.duration || 'Por determinar',
      level: data.level || 'Todos los niveles',
      rating: data.rating || 5.0,
      students: data.students || 0,
      status: (data.status === 'available' || data.status === 'coming_soon' || data.status === 'in_progress') ? data.status : 'coming_soon',
      category: data.category || 'General',
      content: md.render(content),
      date: data.date ? new Date(data.date).toISOString() : undefined,
    };

    return course;
  } catch (error) {
    console.error(`Error reading course ${slug}:`, error);
    return null;
  }
}

export async function getCourseCurriculum(courseSlug: string): Promise<Module[]> {
  if (!courseSlug) return [];
  courseSlug = decodeURIComponent(courseSlug);

  const coursePath = path.join(coursesDirectory, courseSlug);
  
  if (!fs.existsSync(coursePath) || !fs.statSync(coursePath).isDirectory()) {
    return [];
  }

  const entries = fs.readdirSync(coursePath, { withFileTypes: true });
  
  // Filter for directories (modules)
  const moduleDirs = entries
    .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
    .sort((a, b) => a.name.localeCompare(b.name));

  const modules: Module[] = await Promise.all(moduleDirs.map(async (moduleDir) => {
    const modulePath = path.join(coursePath, moduleDir.name);
    const lessonFiles = fs.readdirSync(modulePath)
        .filter(file => file.endsWith('.md') && file !== 'index.md') // Exclude index.md
        .sort((a, b) => a.localeCompare(b));

    const lessons: Lesson[] = await Promise.all(lessonFiles.map(async (file) => {
        const content = fs.readFileSync(path.join(modulePath, file), 'utf8');
        const { data, content: markdownContent } = matter(content);
        
        return {
            slug: file.replace(/\.md$/, ''),
            title: data.title || file.replace(/\.md$/, ''),
            duration: data.duration || '10 min',
            videoUrl: data.videoUrl,
            content: md.render(markdownContent)
        };
    }));

    // Check for folder-based lessons (e.g. module/lesson-slug/index.md)
    const lessonDirs = fs.readdirSync(modulePath, { withFileTypes: true })
        .filter(entry => entry.isDirectory());

    const folderLessons = await Promise.all(lessonDirs.map(async (dir) => {
        const lessonIndexPath = path.join(modulePath, dir.name, 'index.md');
        if (fs.existsSync(lessonIndexPath)) {
             const content = fs.readFileSync(lessonIndexPath, 'utf8');
             const { data, content: markdownContent } = matter(content);
             return {
                slug: dir.name,
                title: data.title || dir.name,
                duration: data.duration || '10 min',
                videoUrl: data.videoUrl,
                content: md.render(markdownContent)
             };
        }
        return null;
    }));

    const validFolderLessons = folderLessons.filter((l): l is Lesson => l !== null);

    // Combine and sort
    const allLessons = [...lessons, ...validFolderLessons].sort((a, b) => a.title.localeCompare(b.title));

    // Format module title from "01-fundamentos" to "Fundamentos"
    const formattedTitle = moduleDir.name
        .replace(/^\d+-/, '') // Remove leading numbers
        .replace(/-/g, ' ')   // Replace hyphens with spaces
        .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letters

    return {
        slug: moduleDir.name,
        title: formattedTitle,
        lessons: allLessons
    };
  }));

  return modules;
}

export async function getLesson(courseSlug: string, moduleSlug: string, lessonSlug: string): Promise<Lesson | null> {
    if (!courseSlug || !moduleSlug || !lessonSlug) return null;
    courseSlug = decodeURIComponent(courseSlug);
    moduleSlug = decodeURIComponent(moduleSlug);
    lessonSlug = decodeURIComponent(lessonSlug);

    let lessonPath = path.join(coursesDirectory, courseSlug, moduleSlug, `${lessonSlug}.md`);

    // Check for folder-based lesson
    if (!fs.existsSync(lessonPath)) {
        const folderLessonPath = path.join(coursesDirectory, courseSlug, moduleSlug, lessonSlug, 'index.md');
        if (fs.existsSync(folderLessonPath)) {
            lessonPath = folderLessonPath;
        } else {
            return null;
        }
    }

    const content = fs.readFileSync(lessonPath, 'utf8');
    const { data, content: markdownContent } = matter(content);

    return {
        slug: lessonSlug,
        title: data.title || lessonSlug,
        duration: data.duration || '10 min',
        videoUrl: data.videoUrl,
        content: md.render(markdownContent)
    };
}
