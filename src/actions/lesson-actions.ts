'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function completeLesson(courseSlug: string, lessonSlug: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autenticado" };

  try {
    // 1. Find Enrollment
    // We first need the course ID from the slug
    const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
    if (!course) return { error: "Curso no encontrado" };

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: course.id
        }
      }
    });

    if (!enrollment) return { error: "No estás inscrito en este curso" };

    // 2. Mark Lesson as Completed (Idempotent)
    // Create CompletedLesson entry if not exists
    await prisma.completedLesson.upsert({
      where: {
        enrollmentId_lessonSlug: {
          enrollmentId: enrollment.id,
          lessonSlug: lessonSlug
        }
      },
      update: {}, // No update needed if exists
      create: {
        enrollmentId: enrollment.id,
        lessonSlug: lessonSlug
      }
    });

    // 3. Update Course Progress
    // Count distinct completed lessons
    const completedCount = await prisma.completedLesson.count({
      where: { enrollmentId: enrollment.id }
    });

    // Calculate percentage
    const progressPct = Math.min(100, (completedCount / course.totalLessons) * 100);
    const isCompleted = progressPct >= 100;

    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        completedLessons: completedCount,
        progressPct: progressPct,
        status: isCompleted ? 'COMPLETADO' : 'EN_CURSO',
        certified: isCompleted // Auto-certify if 100%? Or keep separate logic.
      }
    });

    revalidatePath(`/cursos/${courseSlug}`);
    return { success: true, isCompleted: true };
  } catch (error) {
    console.error("Error completing lesson:", error);
    return { error: "Error al actualizar progreso" };
  }
}

export async function getLessonStatus(courseSlug: string, lessonSlug: string) {
    const session = await auth();
    if (!session?.user?.id) return { isCompleted: false };

    const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
    if (!course) return { isCompleted: false };

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
      include: { completedLessonSlugs: true }
    });

    if (!enrollment) return { isCompleted: false };

    const isCompleted = enrollment.completedLessonSlugs.some(cl => cl.lessonSlug === lessonSlug);
    return { isCompleted };
}
