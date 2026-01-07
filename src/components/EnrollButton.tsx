'use client';

import { useState } from 'react';
import { enrollUser } from '@/actions/course-actions';
import { useRouter } from 'next/navigation';
import { FaGraduationCap } from 'react-icons/fa';

interface EnrollButtonProps {
  courseSlug: string;
  firstLessonUrl: string;
}

export default function EnrollButton({ courseSlug, firstLessonUrl }: EnrollButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEnroll = async () => {
    setLoading(true);
    
    const result = await enrollUser(courseSlug);

    if (result.success) {
      // Redirect to first lesson
      router.push(firstLessonUrl);
    } else {
      if (result.error === "Debes iniciar sesión para inscribirte") {
         router.push('/login');
      } else {
         alert(result.error);
      }
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="w-full text-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-xl transition-colors mb-4 flex items-center justify-center gap-2"
    >
      {loading ? 'Procesando...' : (
        <>
            <FaGraduationCap />
            Inscribirse Gratis
        </>
      )}
    </button>
  );
}
