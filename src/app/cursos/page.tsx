import CoursesList from '@/components/CoursesList';
import { getAllCourses } from '@/utils/courses';

export const metadata = {
  title: 'Psi Colab | Cursos'
};

export default async function CursosPage() {
  const courses = await getAllCourses();

  return (
    <CoursesList initialCourses={courses} />
  );
}
