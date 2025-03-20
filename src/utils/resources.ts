'use server';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Resource {
  slug: string;
  title: string;
  type: string;
  excerpt: string;
  date?: string;
  tags?: string[];
  author?: string;
  pages?: number;
  cover?: string;
  link?: string;
  image?: string; // Ensure image is included in the Resource type
}

const resourcesDirectory = path.join(process.cwd(), 'content/resources');

// Ensure the resources directory exists
function ensureResourcesDirectory() {
  if (!fs.existsSync(resourcesDirectory)) {
    fs.mkdirSync(resourcesDirectory, { recursive: true });
  }
}

export async function getAllResources(): Promise<Resource[]> {
  try {
    ensureResourcesDirectory();
    
    const fileNames = fs.readdirSync(resourcesDirectory);
    const allResourcesData = await Promise.all(
      fileNames
        .filter(fileName => fileName.endsWith('.md'))
        .map(async fileName => {
          try {
            const slug = fileName.replace(/.md$/, '');
            const resource = await getResourceBySlug(slug);
            return resource;
          } catch (error) {
            console.error(`Error processing resource ${fileName}:`, error);
            return null;
          }
        })
    );

    return allResourcesData
      .filter((resource): resource is Resource => resource !== null)
      .sort((a, b) => {
        if (!a.date || !b.date) return 0;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  } catch (error) {
    console.error('Error getting all resources:', error);
    return [];
  }
}

export async function getResourceBySlug(slug: string): Promise<Resource | null> {
  try {
    ensureResourcesDirectory();
    
    const fileNames = fs.readdirSync(resourcesDirectory);
    const fileName = fileNames.find(
      fn => fn.toLowerCase().replace(/.md$/, '') === decodeURIComponent(slug).toLowerCase()
    );

    if (!fileName) {
      console.warn(`Resource not found: ${slug}`);
      return null;
    }

    const fullPath = path.join(resourcesDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    // Validate required fields
    if (!data.title || !data.type) {
      console.error(`Resource ${slug} is missing required fields`);
      return null;
    }

    const resource: Resource = {
      slug: fileName.replace(/.md$/, ''),
      title: data.title,
      type: data.type,
      excerpt: data.excerpt || '',
      date: data.date ? new Date(data.date).toISOString() : undefined,
      tags: Array.isArray(data.tags) ? data.tags : [],
      author: data.author,
      pages: data.pages,
      cover: data.cover,
      link: data.link,
      image: data.image || '/images/miniatura.jpg', // Default image if not provided
    };

    return resource;
  } catch (error) {
    console.error(`Error reading resource ${slug}:`, error);
    return null;
  }
}

export async function getResourceSlugs(): Promise<string[]> {
  try {
    ensureResourcesDirectory();
    
    const fileNames = fs.readdirSync(resourcesDirectory);
    return fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => fileName.replace(/.md$/, ''));
  } catch (error) {
    console.error('Error getting resource slugs:', error);
    return [];
  }
}