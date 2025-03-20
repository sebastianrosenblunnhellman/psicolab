import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { category, subcategory, resource } = body;
    
    if (!category || !subcategory || !resource) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }
    
    // Read the current resources file
    const resourcesPath = path.join(process.cwd(), 'content', 'resources', 'resources.json');
    const resourcesDataText = await fs.readFile(resourcesPath, 'utf8');
    const resourcesData = JSON.parse(resourcesDataText);
    
    // Validate that the category and subcategory exist
    if (
      !resourcesData.categories[category] || 
      !resourcesData.categories[category].subcategories[subcategory]
    ) {
      return NextResponse.json({ error: 'Invalid category or subcategory' }, { status: 400 });
    }
    
    // Add the resource to the specified location
    resourcesData.categories[category].subcategories[subcategory].resources.push(resource);
    
    // Write back to the file
    await fs.writeFile(
      resourcesPath,
      JSON.stringify(resourcesData, null, 2),
      'utf8'
    );
    
    return NextResponse.json({ success: true, message: 'Resource added successfully' });
  } catch (error) {
    console.error('Error adding resource:', error);
    return NextResponse.json({ error: 'Failed to add resource' }, { status: 500 });
  }
}
