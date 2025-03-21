import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: Request) {
  try {
    const { fileName, content } = await request.json();
    
    if (!fileName || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Ensure the filename ends with .md
    const finalFileName = fileName.endsWith('.md') ? fileName : `${fileName}.md`;
    
    // Path to resources directory
    const resourcesDir = join(process.cwd(), 'content', 'resources');
    
    // Create directory if it doesn't exist
    if (!existsSync(resourcesDir)) {
      await mkdir(resourcesDir, { recursive: true });
    }
    
    // Path to the new file
    const filePath = join(resourcesDir, finalFileName);
    
    // Write the markdown content to the file
    await writeFile(filePath, content);
    
    return NextResponse.json({
      success: true,
      message: `Resource saved as ${finalFileName}`,
      path: filePath
    });
  } catch (error) {
    console.error('Error saving markdown resource:', error);
    return NextResponse.json(
      { error: 'Failed to save resource' },
      { status: 500 }
    );
  }
}
