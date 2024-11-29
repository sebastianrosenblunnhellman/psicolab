import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Roadmap {
  slug: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  tags?: string[];
  topics?: string[];
  content?: string;
}

const roadmapsDirectory = path.join(process.cwd(), 'content/roadmaps');

export async function getAllRoadmaps(): Promise<Roadmap[]> {
  try {
    const fileNames = fs.readdirSync(roadmapsDirectory);
    const allRoadmaps = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(roadmapsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        return {
          slug,
          title: data.title || 'Sin título',
          description: data.description || '',
          duration: data.duration || '4-6 semanas',
          level: data.level || 'Principiante',
          tags: Array.isArray(data.tags) ? data.tags : [],
          topics: Array.isArray(data.topics) ? data.topics : [],
        } as Roadmap;
      });

    return allRoadmaps.sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.error('Error loading roadmaps:', error);
    return [];
  }
}