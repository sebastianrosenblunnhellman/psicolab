import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface ExternalResource {
  slug: string;
  title: string;
  description: string;
  url: string;
  type: string;
  author: string;
  language: string;
  tags?: string[];
}

const externalDirectory = path.join(process.cwd(), 'content/external');

export async function getAllExternalResources(): Promise<ExternalResource[]> {
  try {
    const fileNames = fs.readdirSync(externalDirectory);
    const allResources = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(externalDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        return {
          slug,
          title: data.title || 'Sin título',
          description: data.description || '',
          url: data.url || '#',
          type: data.type || 'Recurso',
          author: data.author || 'Anónimo',
          language: data.language || 'Español',
          tags: Array.isArray(data.tags) ? data.tags : [],
        } as ExternalResource;
      });

    return allResources.sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.error('Error loading external resources:', error);
    return [];
  }
}