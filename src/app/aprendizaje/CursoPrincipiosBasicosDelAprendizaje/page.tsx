'use client';

import { useState, useEffect } from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote';
import Quiz from '@/components/Quiz';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useUser } from '@stackframe/stack';

const components = {
  Quiz,
};

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
  const user = useUser();

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
    
    // Track course progress when component mounts
    if (user) {
      trackCourseProgress('iniciado');
    }
  }, [user]);

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
        
        // Scroll to the top of the page when content changes
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Error fetching lesson content:', error);
      }
    };

    if (currentLesson) {
      fetchContent();
    }
  }, [currentLesson]);
  
  // Function to track course progress
  const trackCourseProgress = async (status: string) => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/course-progress/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course_id: 1, // Using 1 as the ID for CursoPrincipiosBasicosDelAprendizaje
          status: status
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update course progress');
      }
      
      console.log('Course progress updated:', status);
    } catch (error) {
      console.error('Error updating course progress:', error);
    }
  };

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
          <div className="space-y-2 mt-4">
            {lessons.map((lesson) => (
              <button
                key={lesson}
                onClick={() => setCurrentLesson(lesson.replace('.md', ''))}
                className={`w-full text-left px-2 py-1 rounded ${currentLesson === lesson.replace('.md', '') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {lesson.replace('.md', '')}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="prose max-w-none">
          {mdxSource && <MDXRemote {...mdxSource} components={components} />}
        </div>
        
        {/* Quiz Component */}
        {currentLesson && (
          <Quiz 
            curso="CursoPrincipiosBasicosDelAprendizaje" 
            leccion={currentLesson} 
          />
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          {currentLesson !== '1' && currentLesson !== 'exam' && (
            <button
              onClick={() => setCurrentLesson(String(Number(currentLesson) - 1))}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Lección Anterior
            </button>
          )}
          {currentLesson === '1' && <div></div>}
          
          <div className="ml-auto">
            {currentLesson !== 'exam' ? (
              <button
                onClick={() => {
                  if (currentLesson === '3') {
                    setCurrentLesson('exam');
                  } else {
                    const nextLesson = String(Number(currentLesson) + 1);
                    setCurrentLesson(nextLesson);
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                {currentLesson === '3' ? 'Examen Final' : 'Siguiente Lección'}
              </button>
            ) : (
              <button
                onClick={() => {
                  // Update course progress to 'finalizado'
                  trackCourseProgress('finalizado');
                  alert('¡Curso finalizado!');
                }}
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
              >
                Finalizar Curso
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}