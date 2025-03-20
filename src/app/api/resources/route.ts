import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const resourcesPath = path.join(process.cwd(), 'content', 'resources', 'resources.json');
    const resourcesData = await fs.readFile(resourcesPath, 'utf8');
    return NextResponse.json(JSON.parse(resourcesData));
  } catch (error) {
    console.error('Error reading resources file:', error);
    return NextResponse.json({ error: 'Failed to read resources data' }, { status: 500 });
  }
}
