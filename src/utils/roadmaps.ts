import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';

export interface Roadmap {
  slug: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  tags?: string[];
  topics?: string[];
  content?: string;
  order?: number;
  parentSlug?: string;
}

const roadmapsDirectory = path.join(process.cwd(), 'content/roadmaps');

export async function getAllRoadmaps(): Promise<Roadmap[]> {
  try {
    const roadmaps: Roadmap[] = [];
    const processDirectory = (dir: string, parentSlug?: string) => {
      const fileNames = fs.readdirSync(dir);
      fileNames.forEach(fileName => {
        if (fileName.endsWith('.md')) {
          const fullPath = path.join(dir, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const { data } = matter(fileContents);
          const slug = fileName.replace(/\.md$/, '');
          
          roadmaps.push({
            slug,
            title: data.title || 'Sin título',
            description: data.description || '',
            duration: data.duration || '4-6 semanas',
            level: data.level || 'Principiante',
            tags: Array.isArray(data.tags) ? data.tags : [],
            topics: Array.isArray(data.topics) ? data.topics : [],
            order: data.order || 0,
            parentSlug
          });
        } else if (fs.statSync(path.join(dir, fileName)).isDirectory()) {
          processDirectory(path.join(dir, fileName), fileName);
        }
      });
    };

    processDirectory(roadmapsDirectory);
    return roadmaps.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Error loading roadmaps:', error);
    return [];
  }
}

export async function getRoadmapBySlug(slug: string): Promise<Roadmap | null> {
  try {
    // First try to find the file directly
    let fullPath = path.join(roadmapsDirectory, `${slug}.md`);
    
    // If not found, search in subdirectories
    if (!fs.existsSync(fullPath)) {
      const searchInDir = (dir: string): string | null => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          if (stat.isDirectory()) {
            const found = searchInDir(filePath);
            if (found) return found;
          } else if (file === `${slug}.md`) {
            return filePath;
          }
        }
        return null;
      };
      
      const foundPath = searchInDir(roadmapsDirectory);
      if (foundPath) {
        fullPath = foundPath;
      } else {
        return null;
      }
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const processedContent = await unified()
      .use(remarkParse)
      .use(remarkHtml)
      .process(content);

    return {
      slug,
      title: data.title || 'Sin título',
      description: data.description || '',
      duration: data.duration || '4-6 semanas',
      level: data.level || 'Principiante',
      tags: Array.isArray(data.tags) ? data.tags : [],
      topics: Array.isArray(data.topics) ? data.topics : [],
      content: processedContent.toString(),
      order: data.order || 0,
      parentSlug: data.parentSlug
    };
  } catch (error) {
    console.error(`Error loading roadmap ${slug}:`, error);
    return null;
  }
}