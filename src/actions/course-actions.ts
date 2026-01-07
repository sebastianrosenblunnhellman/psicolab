'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCourseBySlug, getCourseCurriculum } from '@/utils/courses';

export async function getUserEnrollments() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: true,
    },
    orderBy: { updatedAt: 'desc' }
  });

  return enrollments;
}

export async function enrollUser(courseSlug: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Debes iniciar sesión para inscribirte" };

  try {
    // 1. Get Course ID from DB or File System (Lazy Sync)
    let course = await prisma.course.findUnique({
      where: { slug: courseSlug }
    });

    if (!course) {
        // Not in DB, try fetching from file system
        const fileCourse = await getCourseBySlug(courseSlug);
        
        if (!fileCourse) {
            return { error: "Curso no encontrado" };
        }

        // Calculate total lessons for progress tracking
        const curriculum = await getCourseCurriculum(courseSlug);
        let totalLessons = 0;
        curriculum.forEach(module => {
            totalLessons += module.lessons.length;
        });

        // Sync to DB
        course = await prisma.course.create({
            data: {
                slug: fileCourse.slug,
                title: fileCourse.title,
                description: fileCourse.description,
                thumbnailUrl: fileCourse.image,
                isFree: true, // Assuming free for now based on context
                totalLessons: totalLessons > 0 ? totalLessons : 1, // Avoid division by zero
            }
        });
    }

    // 2. Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: course.id
        }
      }
    });

    if (existingEnrollment) {
      return { success: true, message: "Ya estás inscrito" };
    }

    // 3. Create Enrollment
    await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        courseId: course.id,
        status: 'EN_CURSO',
        progressPct: 0,
        completedLessons: 0
      }
    });

    revalidatePath(`/cursos/${courseSlug}`);
    revalidatePath('/mis-cursos');
    
    return { success: true };
  } catch (error) {
    console.error("Error enrolling user:", error);
    return { error: "Hubo un error al procesar tu inscripción" };
  }
}