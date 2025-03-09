import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Create a single PrismaClient instance and reuse it
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // In development, use a global variable to prevent multiple instances during hot-reloading
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
  }
  prisma = (global as any).prisma;
}

// GET: Fetch course progress for a user
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const courseProgress = await prisma.course_progress.findMany({
      where: {
        user_id: params.userId
      }
    });

    return NextResponse.json(courseProgress);
  } catch (error) {
    console.error('Error fetching course progress:', error);
    return NextResponse.json(
      { error: 'Error al obtener el progreso del curso' },
      { status: 500 }
    );
  } finally {
    // Don't disconnect in development to maintain connection pool
    if (process.env.NODE_ENV === 'production') {
      await prisma.$disconnect();
    }
  }
}

// POST: Create or update course progress
export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const body = await request.json();
    const { course_id, status } = body;

    // Check if a progress record already exists
    const existingProgress = await prisma.course_progress.findUnique({
      where: {
        user_id_course_id: {
          user_id: params.userId,
          course_id: parseInt(course_id)
        }
      }
    });

    let progress;

    if (existingProgress) {
      // Update existing progress
      progress = await prisma.course_progress.update({
        where: {
          user_id_course_id: {
            user_id: params.userId,
            course_id: parseInt(course_id)
          }
        },
        data: {
          status,
          last_accessed_at: new Date(),
          progress_percentage: status === 'finalizado' ? 100 : existingProgress.progress_percentage
        }
      });
    } else {
      // Create new progress record
      progress = await prisma.course_progress.create({
        data: {
          user_id: params.userId,
          course_id: parseInt(course_id),
          status: 'iniciado',
          progress_percentage: 0
        }
      });
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error updating course progress:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el progreso del curso' },
      { status: 500 }
    );
  } finally {
    // Don't disconnect in development to maintain connection pool
    if (process.env.NODE_ENV === 'production') {
      await prisma.$disconnect();
    }
  }
}