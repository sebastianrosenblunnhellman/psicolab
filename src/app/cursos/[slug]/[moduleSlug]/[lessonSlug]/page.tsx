import { getLesson, getCourseCurriculum, getCourseBySlug, getAllCourses } from '@/utils/courses';
import Link from 'next/link';
import { FaPlayCircle, FaCheckCircle, FaLock, FaThLarge } from 'react-icons/fa';
import LessonCompleteButton from '@/components/LessonCompleteButton';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

interface LessonPageProps {
  params: Promise<{
    slug: string;
    moduleSlug: string;
    lessonSlug: string;
  }>;
}

export async function generateStaticParams() {
    const courses = await getAllCourses();
    let paths: { slug: string; moduleSlug: string; lessonSlug: string }[] = [];

    for (const course of courses) {
        const curriculum = await getCourseCurriculum(course.slug);
        for (const module of curriculum) {
            for (const lesson of module.lessons) {
                paths.push({
                    slug: course.slug,
                    moduleSlug: module.slug,
                    lessonSlug: lesson.slug,
                });
            }
        }
    }
    return paths;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, moduleSlug, lessonSlug } = await params;
  const lesson = await getLesson(slug, moduleSlug, lessonSlug);
  const curriculum = await getCourseCurriculum(slug);
  const course = await getCourseBySlug(slug);
  
  const session = await auth();
  let completedLessonSlugs: string[] = [];

  if (session?.user?.id && course) {
    const enrollment = await prisma.enrollment.findFirst({
        where: {
            userId: session.user.id,
            course: {
                slug: slug
            }
        },
        include: {
            completedLessonSlugs: true
        }
    });
    
    if (enrollment) {
        completedLessonSlugs = enrollment.completedLessonSlugs.map(cl => cl.lessonSlug);
    }
  }

  if (!lesson || !course) {
    return <div>Lección no encontrada</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="flex-none h-16 border-b border-neutral-200 bg-white flex items-center px-4 justify-between z-10 relative">
        <div className="flex items-center gap-4">
            <Link 
                href="/mis-cursos" 
                className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-100 rounded-lg text-neutral-600 transition-colors text-sm font-medium"
                title="Volver a mis cursos"
            >
                <FaThLarge />
                <span>Mis Cursos</span>
            </Link>
            <div className="h-6 w-px bg-neutral-200 hidden md:block"></div>
            <div>
                <h1 className="text-sm font-bold text-neutral-900 truncate max-w-[200px] md:max-w-md">
                    {course.title}
                </h1>
                <p className="text-xs text-neutral-500 truncate max-w-[200px] md:max-w-md">
                    {lesson.title}
                </p>
            </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content (Video + Material) */}
        <main className="flex-1 overflow-y-auto bg-neutral-50 p-6 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Video Container */}
                <div className="bg-black rounded-xl overflow-hidden aspect-video shadow-lg relative">
                    {lesson.videoUrl ? (
                         // Simple iframe for YouTube/Vimeo support
                         // In a real app, use a robust player component
                        lesson.videoUrl.includes('youtube') || lesson.videoUrl.includes('youtu.be') ? (
                             <iframe 
                                src={lesson.videoUrl.replace('watch?v=', 'embed/')} 
                                className="w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                             ></iframe>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-neutral-400">
                                <div className="text-center">
                                    <FaPlayCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p>Reproductor de video (URL no compatible con embed simple)</p>
                                    <a href={lesson.videoUrl} target="_blank" rel="noreferrer" className="text-primary-400 hover:underline mt-2 block">
                                        Ver en fuente original
                                    </a>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-neutral-400">
                             <div className="text-center">
                                <p>Esta lección no tiene video asociado.</p>
                             </div>
                        </div>
                    )}
                </div>

                {/* Lesson Content */}
                <div className="bg-white rounded-xl p-8 border border-neutral-200 shadow-sm">
                    <h2 className="text-2xl font-bold mb-6 text-neutral-900">{lesson.title}</h2>
                    <div className="prose prose-lg max-w-none text-neutral-600">
                        <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                    </div>

                    {/* Complete Button */}
                    <LessonCompleteButton courseSlug={slug} lessonSlug={lessonSlug} />
                </div>
            </div>
        </main>

        {/* Sidebar (Curriculum) - Hidden on mobile */}
        <aside className="w-80 bg-white border-l border-neutral-200 overflow-y-auto hidden lg:block">
            <div className="p-4 border-b border-neutral-200">
                <h3 className="font-bold text-neutral-800">Contenido del curso</h3>
            </div>
            <div className="py-2">
                {curriculum.map((module) => (
                    <div key={module.slug} className="mb-2">
                        <div className="px-4 py-2 bg-neutral-50 border-y border-neutral-100">
                            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                                {module.title}
                            </h4>
                        </div>
                        <div>
                            {module.lessons.map((l) => {
                                const isActive = l.slug === lessonSlug && module.slug === moduleSlug;
                                const isCompleted = completedLessonSlugs.includes(l.slug);
                                return (
                                    <Link 
                                        key={l.slug}
                                        href={`/cursos/${course.slug}/${module.slug}/${l.slug}`}
                                        className={`flex items-start gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors ${isActive ? 'bg-primary-50 border-r-4 border-primary-500' : ''}`}
                                    >
                                        <div className="mt-1">
                                            {isCompleted ? (
                                                <FaCheckCircle className="w-4 h-4 text-green-500" />
                                            ) : isActive ? (
                                                <FaPlayCircle className="w-4 h-4 text-primary-600" />
                                            ) : (
                                                <div className="w-4 h-4 rounded-full border-2 border-neutral-300" />
                                            )}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-medium ${isActive ? 'text-primary-900' : 'text-neutral-700'}`}>
                                                {l.title}
                                            </p>
                                            <p className="text-xs text-neutral-400 mt-1">{l.duration}</p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
      </div>
    </div>
  );
}