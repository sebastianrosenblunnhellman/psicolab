'use client';

import { useState, useEffect } from 'react';
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
  // Desktop accordion open/close
  const [isLessonsOpen, setIsLessonsOpen] = useState(true);
  // Mobile drawer for lessons
  const [mobileLessonsOpen, setMobileLessonsOpen] = useState(false);
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
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-white p-4 border-r border-gray-200">
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

      {/* Mobile: Backdrop and Drawer for lessons */}
      {mobileLessonsOpen && (
        <div
          className="fixed top-20 right-0 left-0 bottom-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setMobileLessonsOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        className={`lg:hidden fixed top-20 bottom-0 left-0 z-50 bg-white border-r border-gray-200 transition-transform duration-300 ${
          mobileLessonsOpen ? 'translate-x-0' : '-translate-x-full'
        } w-11/12 max-w-sm p-4`}
      >
        <div className="font-semibold text-gray-700 mb-2">Lecciones</div>
        <div className="space-y-2 mt-2">
          {lessons.map((lesson) => (
            <button
              key={lesson}
              onClick={() => {
                setCurrentLesson(lesson.replace('.md', ''));
                setMobileLessonsOpen(false);
              }}
              className={`w-full text-left px-2 py-2 rounded ${currentLesson === lesson.replace('.md', '') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              {lesson.replace('.md', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-6 lg:p-8">
        {/* Mobile Open Lessons Button */}
        <div className="lg:hidden mb-4">
          <button
            type="button"
            aria-label="Abrir lecciones"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm hover:bg-gray-50"
            onClick={() => setMobileLessonsOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-600">
              <path fillRule="evenodd" d="M3.75 5.25a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm2 6a.75.75 0 01.75-.75h11a.75.75 0 010 1.5h-11a.75.75 0 01-.75-.75zm3 6a.75.75 0 01.75-.75h5a.75.75 0 010 1.5h-5a.75.75 0 01-.75-.75z" clipRule="evenodd" />
            </svg>
            Lecciones
          </button>
        </div>
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
        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">
          {currentLesson !== '1' && currentLesson !== 'exam' && (
            <button
              onClick={() => setCurrentLesson(String(Number(currentLesson) - 1))}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              Lección Anterior
            </button>
          )}
          {currentLesson === '1' && <div className="hidden sm:block"></div>}
          
          <div className="sm:ml-auto">
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
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors w-full sm:w-auto"
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
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors w-full sm:w-auto"
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