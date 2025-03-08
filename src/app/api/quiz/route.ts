import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const curso = searchParams.get('curso');
    const leccion = searchParams.get('leccion');

    // Read the quiz data from the JSON file
    const quizFilePath = path.join(process.cwd(), 'content', 'quiz', `${curso}.json`);
    
    // Check if the file exists
    if (!fs.existsSync(quizFilePath)) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Read and parse the JSON file
    const fileContent = fs.readFileSync(quizFilePath, 'utf8');
    const quizData = JSON.parse(fileContent);

    // If both curso and leccion are provided, filter the data
    if (curso && leccion) {
      return NextResponse.json(quizData);
    }

    // Return all quiz data if no specific parameters are provided
    return NextResponse.json(quizData);
  } catch (error) {
    console.error('Error fetching quiz data:', error);
    return NextResponse.json({ error: 'Failed to fetch quiz data' }, { status: 500 });
  }
}