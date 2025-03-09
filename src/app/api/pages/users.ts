import { NextApiRequest, NextApiResponse } from 'next';
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = await prisma.users_sync.findMany({
      take: 10,
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: `Error al obtener usuarios: ${error.message}` });
  } finally {
    await prisma.$disconnect();
  }
}
