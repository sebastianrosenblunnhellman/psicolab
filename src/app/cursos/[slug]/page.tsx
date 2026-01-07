import { getCourseBySlug, getAllCourses, getCourseCurriculum } from '@/utils/courses';
import Image from 'next/image';
import Link from 'next/link';
import { FaClock, FaUser, FaStar, FaPlayCircle } from 'react-icons/fa';
import EnrollButton from '@/components/EnrollButton';

interface CoursePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const courses = await getAllCourses();
  return courses.map((course) => ({
    slug: course.slug,
  }));
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  const curriculum = await getCourseCurriculum(slug);

  if (!course) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800">Curso no encontrado</h1>
                <p className="text-gray-600 mt-2">El curso que buscas no existe o ha sido movido.</p>
            </div>
        </div>
    );
  }

  const firstLessonUrl = curriculum.length > 0 && curriculum[0].lessons.length > 0
     ? `/cursos/${course.slug}/${curriculum[0].slug}/${curriculum[0].lessons[0].slug}`
     : '#';

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-neutral-900 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            <Image 
                src={course.image} 
                alt={course.title}
                fill
                className="object-cover"
                priority
            />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded-full">
                    {course.category}
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/30">
                    {course.level}
                </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              {course.title}
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                    <FaUser className="text-primary-500" />
                    <span>{course.instructor}</span>
                </div>
                <div className="flex items-center gap-2">
                    <FaClock className="text-primary-500" />
                    <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < Math.floor(course.rating) ? "fill-current" : "text-gray-600"} />
                        ))}
                    </div>
                    <span>({course.students} alumnos)</span>
                </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
                {/* About Course */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 text-neutral-900">Sobre este curso</h2>
                    <div className="prose prose-lg max-w-none text-neutral-600">
                        <div dangerouslySetInnerHTML={{ __html: course.content }} />
                    </div>
                </section>

                {/* Curriculum */}
                {curriculum.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold mb-6 text-neutral-900">Contenido del curso</h2>
                        <div className="space-y-4">
                            {curriculum.map((module) => (
                                <div key={module.slug} className="border border-neutral-200 rounded-xl overflow-hidden">
                                    <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
                                        <h3 className="font-bold text-neutral-800">{module.title}</h3>
                                        <span className="text-xs text-neutral-500 font-medium">{module.lessons.length} lecciones</span>
                                    </div>
                                    <div className="divide-y divide-neutral-100">
                                        {module.lessons.map((lesson) => (
                                            <Link 
                                                key={lesson.slug} 
                                                href={`/cursos/${course.slug}/${module.slug}/${lesson.slug}`}
                                                className="block hover:bg-neutral-50 transition-colors"
                                            >
                                                <div className="px-6 py-4 flex items-center justify-between group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                                            <FaPlayCircle className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-neutral-700 group-hover:text-primary-700 transition-colors">
                                                                {lesson.title}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                                                        <FaClock className="w-3 h-3" />
                                                        <span>{lesson.duration}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
                <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-soft sticky top-24">
                    <h3 className="text-xl font-bold mb-4">Inscríbete ahora</h3>
                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Precio</span>
                            <span className="text-2xl font-bold text-primary-600">Gratis</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Duración</span>
                            <span className="font-medium">{course.duration}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Nivel</span>
                            <span className="font-medium">{course.level}</span>
                        </div>
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Certificado</span>
                            <span className="font-medium">Sí, al finalizar</span>
                        </div>
                    </div>
                    
                    {curriculum.length > 0 ? (
                        <EnrollButton courseSlug={course.slug} firstLessonUrl={firstLessonUrl} />
                    ) : (
                        <button disabled className="w-full bg-neutral-300 text-neutral-500 font-bold py-3 px-6 rounded-xl cursor-not-allowed mb-4">
                            Próximamente
                        </button>
                    )}
                    
                    <p className="text-xs text-center text-gray-500">
                        Acceso inmediato a todo el contenido
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
