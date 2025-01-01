import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Video {
  slug: string;
  title: string;
  author: string;
  description: string;
  url: string;
  tags?: string[];
  duration?: string;
  language?: string;
}

const videosDirectory = path.join(process.cwd(), 'content/videos');

export async function getAllVideos(): Promise<Video[]> {
  try {
    const fileNames = fs.readdirSync(videosDirectory);
    const allVideos = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(videosDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        return {
          slug,
          title: data.title || 'Sin título',
          author: data.author || 'Autor desconocido',
          description: data.description || '',
          url: data.url || '',
          tags: Array.isArray(data.tags) ? data.tags : [],
          duration: data.duration || '',
          language: data.language || 'Español',
        } as Video;
      });

    return allVideos.sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.error('Error loading videos:', error);
    return [];
  }
}
