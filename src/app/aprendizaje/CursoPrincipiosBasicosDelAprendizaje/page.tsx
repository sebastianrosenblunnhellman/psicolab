'use client';

import { useState, useEffect } from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote';

interface LessonContent {
  title: string;
  content: string;
}

export default function CoursePage() {
  const [currentLesson, setCurrentLesson] = useState('1');
  const [lessons, setLessons] = useState<string[]>([]);
  const [content, setContent] = useState<string>('');
  const [mdxSource, setMdxSource] = useState<any>(null);

  useEffect(() => {
    // Get list of markdown files in the current directory
    const fetchLessons = async () => {
      try {
        const response = await fetch('/api/lessons?course=CursoPrincipiosBasicosDelAprendizaje');
        const data = await response.json();
        setLessons(data.lessons);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    };

    fetchLessons();
  }, []);

  useEffect(() => {
    // Fetch content of selected lesson
    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/lesson-content?course=CursoPrincipiosBasicosDelAprendizaje&lesson=${currentLesson}`);
        const data = await response.json();
        setContent(data.content);
        
        // Process the markdown content with next-mdx-remote
        const { serialize } = await import('next-mdx-remote/serialize');
        const mdxSource = await serialize(data.content);
        setMdxSource(mdxSource);
      } catch (error) {
        console.error('Error fetching lesson content:', error);
      }
    };

    if (currentLesson) {
      fetchContent();
    }
  }, [currentLesson]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4">Lecciones</h2>
        <nav>
          {lessons.map((lesson) => (
            <button
              key={lesson}
              onClick={() => setCurrentLesson(lesson.replace('.md', ''))}
              className={`w-full text-left px-4 py-2 rounded-lg mb-2 ${currentLesson === lesson.replace('.md', '') ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
            >
              Lección {lesson.replace('.md', '')}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="prose max-w-none">
          {mdxSource && <MDXRemote {...mdxSource} />}
        </div>
      </div>
    </div>
  );
}