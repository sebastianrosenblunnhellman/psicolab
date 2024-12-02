import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';

export interface ExternalResource {
  slug: string;
  title: string;
  description: string;
  url: string;
  type: string;
  author: string;
  language: string;
  tags?: string[];
  content?: string;
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

export async function getExternalResourceBySlug(slug: string): Promise<ExternalResource | null> {
  try {
    const fullPath = path.join(externalDirectory, `${slug}.md`);
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
      url: data.url || '#',
      type: data.type || 'Recurso',
      author: data.author || 'Anónimo',
      language: data.language || 'Español',
      tags: Array.isArray(data.tags) ? data.tags : [],
      content: processedContent.toString(),
    };
  } catch (error) {
    console.error(`Error loading external resource ${slug}:`, error);
    return null;
  }
}