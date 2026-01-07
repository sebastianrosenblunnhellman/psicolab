'use client';

import { useState, useEffect } from 'react';
import { completeLesson, getLessonStatus } from '@/actions/lesson-actions';
import { FaCheckCircle, FaCircle } from 'react-icons/fa';
import confetti from 'canvas-confetti';

interface LessonCompleteButtonProps {
  courseSlug: string;
  lessonSlug: string;
}

export default function LessonCompleteButton({ courseSlug, lessonSlug }: LessonCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getLessonStatus(courseSlug, lessonSlug).then(status => setIsCompleted(status.isCompleted));
  }, [courseSlug, lessonSlug]);

  const handleComplete = async () => {
    if (isCompleted) return; // Already done

    setLoading(true);
    const result = await completeLesson(courseSlug, lessonSlug);

    if (result.success) {
      setIsCompleted(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    setLoading(false);
  };

  return (
    <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center">
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        {isCompleted ? '¡Lección Completada!' : '¿Terminaste esta lección?'}
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        {isCompleted 
          ? 'Has marcado esta lección como finalizada. ¡Buen trabajo!' 
          : 'Marca la lección como completada para guardar tu progreso.'}
      </p>
      
      <button
        onClick={handleComplete}
        disabled={loading || isCompleted}
        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white transition-all transform hover:scale-105 active:scale-95 ${
          isCompleted 
            ? 'bg-green-500 cursor-default' 
            : 'bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-primary-500/30'
        }`}
      >
        {loading ? (
            <span className="animate-pulse">Procesando...</span>
        ) : isCompleted ? (
            <>
                <FaCheckCircle className="text-xl" />
                <span>Completado</span>
            </>
        ) : (
            <>
                <FaCircle className="text-xs opacity-50" />
                <span>Finalizar Lección</span>
            </>
        )}
      </button>
    </div>
  );
}
