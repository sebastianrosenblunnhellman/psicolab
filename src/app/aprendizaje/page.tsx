import CoursesList from '@/components/CoursesList';
import { getAllCourses } from '@/utils/courses';

export const metadata = {
  title: 'Aprendizaje | Psi Colab',
  description: 'Explora nuestros cursos sobre psicología, investigación y práctica clínica.',
};

export default async function AprendizajePage() {
  const courses = await getAllCourses();

  return (
    <div className="bg-white">


      {/* Courses Section */}
      <div className="container mx-auto px-4 py-16">
        <CoursesList initialCourses={courses} />
      </div>
    </div>
  );
}
