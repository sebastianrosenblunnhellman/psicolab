import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch user profile
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // First check if profile exists
    const profile = await prisma.user_profile.findUnique({
      where: {
        user_id: params.userId
      }
    });

    if (!profile) {
      // If profile doesn't exist, return empty profile
      return NextResponse.json({
        name: null,
        last_name: null,
        bio: null,
        profile_picture_url: null,
        location: null,
        website: null
      });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Error al obtener el perfil de usuario' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT: Update user profile
export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const body = await request.json();
    const { name, last_name, bio, profile_picture_url, location, website } = body;

    // Check if profile exists
    const existingProfile = await prisma.user_profile.findUnique({
      where: {
        user_id: params.userId
      }
    });

    let profile;

    if (existingProfile) {
      // Update existing profile
      profile = await prisma.user_profile.update({
        where: {
          user_id: params.userId
        },
        data: {
          name,
          last_name,
          bio,
          profile_picture_url,
          location,
          website,
          updated_at: new Date()
        }
      });
    } else {
      // Create new profile
      profile = await prisma.user_profile.create({
        data: {
          user_id: params.userId,
          name,
          last_name,
          bio,
          profile_picture_url,
          location,
          website
        }
      });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el perfil de usuario' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}