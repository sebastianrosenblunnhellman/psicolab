import { auth } from "@/auth";
import { getUserEnrollments } from "@/actions/course-actions";
import Link from "next/link";
import { FaPlay, FaCheckCircle, FaAward } from "react-icons/fa";
import { redirect } from "next/navigation";
import { getCourseCurriculum } from "@/utils/courses";

export default async function MyCoursesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const enrollments = await getUserEnrollments();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis Cursos</h1>

        {enrollments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
            <h3 className="mt-2 text-sm font-medium text-gray-900">No estás inscrito en ningún curso</h3>
            <p className="mt-1 text-sm text-gray-500">Comienza a aprender hoy mismo.</p>
            <div className="mt-6">
              <Link
                href="/cursos"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Explorar Cursos
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {await Promise.all(enrollments.map(async (enrollment) => {
              const curriculum = await getCourseCurriculum(enrollment.course.slug);
              let continueUrl = `/cursos/${enrollment.course.slug}`; // Fallback

              // Find first uncompleted lesson
              if (curriculum.length > 0) {
                 let found = false;
                 // Default to very first lesson
                 continueUrl = `/cursos/${enrollment.course.slug}/${curriculum[0].slug}/${curriculum[0].lessons[0].slug}`;
                 
                 for (const module of curriculum) {
                    if (found) break;
                    for (const lesson of module.lessons) {
                        const isCompleted = enrollment.completedLessonSlugs.some(cl => cl.lessonSlug === lesson.slug);
                        if (!isCompleted) {
                            continueUrl = `/cursos/${enrollment.course.slug}/${module.slug}/${lesson.slug}`;
                            found = true;
                            break;
                        }
                    }
                 }
              }

              return (
              <div key={enrollment.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-32 bg-primary-100 relative">
                   {/* Placeholder for course thumbnail if we had one in DB or joined with content */}
                   <div className="absolute inset-0 flex items-center justify-center text-primary-300">
                      <FaAward className="h-16 w-16 opacity-50" />
                   </div>
                   {enrollment.certified && (
                     <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                       <FaAward /> Certificado
                     </div>
                   )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {enrollment.course.title}
                  </h3>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progreso</span>
                      <span>{Math.round(enrollment.progressPct)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${enrollment.progressPct}%` }}
                      ></div>
                    </div>
                  </div>

                  <Link 
                    href={continueUrl}
                    className="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                  >
                    {enrollment.status === 'COMPLETADO' ? 'Repasar Curso' : 'Continuar Aprendiendo'}
                  </Link>
                </div>
              </div>
            )}))}
          </div>
        )}
      </div>
    </div>
  );
}
