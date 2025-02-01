import { getRoadmapBySlug } from '@/utils/roadmaps';
import NetworkAnimation from '@/components/NetworkAnimation';
import { notFound } from 'next/navigation';
import path from 'path';
import fs from 'fs/promises';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
});

interface CourseUnitPageProps {
  params: {
    roadmapSlug: string;
    unitSlug: string;
  };
}

export default async function CourseUnitPage({ params }: CourseUnitPageProps) {
  const { roadmapSlug, unitSlug } = params;
  const unitFilePath = path.join(process.cwd(), 'content', 'courses', `${unitSlug}.md`);

  let unitContent = '';
  let unitFrontmatter = {}; // To store frontmatter data for debugging
  try {
    const fileContent = await fs.readFile(unitFilePath, 'utf8');
    const matterResult = matter(fileContent); // Parse frontmatter
    unitFrontmatter = matterResult.data; // Store frontmatter data
    unitContent = md.render(matterResult.content);
  } catch (error) {
    console.error("Error reading course unit:", error);
    notFound();
  }

  console.log("Unit Slug:", unitSlug); // Debug: Check unitSlug
  console.log("Unit File Path:", unitFilePath); // Debug: Check unitFilePath
  console.log("Unit Frontmatter:", unitFrontmatter); // Debug: Check frontmatter


  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] bg-gradient-to-b from-gray-50 to-white">
        <NetworkAnimation className="absolute inset-0" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-4xl px-4">
            <h1 className="text-4xl font-bold text-gray-800">{unitSlug.replace(/_/g, ' ')}</h1> {/* Display unit name */}
            <p className="text-xl text-gray-600">
              Unidad del curso {roadmapSlug.replace(/_/g, ' ')} {/* Display roadmap name */}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: unitContent }} />
        </div>
      </div>
    </div>
  );
}
