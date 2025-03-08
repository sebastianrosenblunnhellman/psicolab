'use client';

import { useState, useEffect } from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote';
import Quiz from '@/components/Quiz';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface LessonContent {
  title: string;
  content: string;
}

export default function CoursePage() {
  const [currentLesson, setCurrentLesson] = useState('1');
  const [lessons, setLessons] = useState<string[]>([]);
  const [content, setContent] = useState<string>('');
  const [mdxSource, setMdxSource] = useState<any>(null);
  const [isLessonsOpen, setIsLessonsOpen] = useState(true);

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
      <div className="w-64 bg-white p-4 border-r border-gray-200">
        <button
          onClick={() => setIsLessonsOpen(!isLessonsOpen)}
          className="flex items-center justify-between w-full text-left font-semibold text-gray-700 mb-2"
        >
          <span>Lecciones</span>
          {isLessonsOpen ? (
            <FiChevronUp className="h-5 w-5" />
          ) : (
            <FiChevronDown className="h-5 w-5" />
          )}
        </button>
        {isLessonsOpen && (
          <div className="space-y-2">
            {lessons.map((lesson) => (
              <button
                key={lesson}
                onClick={() => setCurrentLesson(lesson.replace('.md', ''))}
                className={`w-full text-left px-2 py-1 rounded ${currentLesson === lesson.replace('.md', '') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Lección {lesson.replace('.md', '')}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="prose max-w-none">
          {mdxSource && <MDXRemote {...mdxSource} />}
        </div>
        
        {/* Quiz Component */}
        {currentLesson && (
          <Quiz 
            curso="CursoPrincipiosBasicosDelAprendizaje" 
            leccion={currentLesson} 
          />
        )}
      </div>
    </div>
  );
}