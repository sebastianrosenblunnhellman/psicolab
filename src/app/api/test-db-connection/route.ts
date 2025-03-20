import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test the database connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    // Also try to count users to verify schema access
    const userCount = await prisma.users_sync.count();
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      database_test: result,
      user_count: userCount
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Database connection failed',
        error: String(error),
        error_name: error.name,
        error_code: error.code,
      },
      { status: 500 }
    );
  }
}
