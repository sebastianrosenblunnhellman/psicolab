import { NextResponse } from 'next/server';
import { readFile, access } from 'fs/promises';
import { join } from 'path';
import { constants } from 'fs';

// Default dictionary data structure as fallback
const defaultDictionary = {
  categories: {
    lineaConductual: {
      name: "Línea Conductual",
      subcategories: {
        conductismoRadical: {
          name: "Conductismo Radical"
        },
        analisisConductual: {
          name: "Análisis Conductual"
        }
      }
    },
    lineaCognitiva: {
      name: "Línea Cognitiva",
      subcategories: {
        terapiaCognitiva: {
          name: "Terapia Cognitiva"
        }
      }
    }
  },
  filters: {
    language: ["español", "inglés"],
    type: ["libro", "artículo", "video", "recurso"]
  }
};

export async function GET() {
  try {
    // Define multiple potential paths to look for dictionary.json
    const potentialPaths = [
      join(process.cwd(), 'public', 'dictionary.json'),
      join(process.cwd(), 'dictionary.json'),
      join(process.cwd(), 'src', 'data', 'dictionary.json'),
      join(process.cwd(), 'data', 'dictionary.json')
    ];
    
    let dictionaryJson = null;
    let foundPath = null;
    
    // Try each path until we find the file
    for (const path of potentialPaths) {
      try {
        await access(path, constants.R_OK);
        // If we reach here, the file exists and is readable
        foundPath = path;
        console.log(`Dictionary file found at: ${path}`);
        break;
      } catch (err) {
        // File doesn't exist at this path, continue to next path
        console.log(`Dictionary file not found at: ${path}`);
      }
    }
    
    if (foundPath) {
      try {
        // Read and parse the JSON file
        const dictionaryRaw = await readFile(foundPath, 'utf-8');
        dictionaryJson = JSON.parse(dictionaryRaw);
        console.log("Dictionary data loaded successfully");
      } catch (parseError) {
        console.error("Error parsing dictionary.json:", parseError);
        // Use default dictionary as fallback
        dictionaryJson = defaultDictionary;
      }
    } else {
      console.warn("Dictionary file not found in any location, using default dictionary");
      dictionaryJson = defaultDictionary;
    }
    
    return NextResponse.json(dictionaryJson);
  } catch (error) {
    console.error('Error in dictionary API route:', error);
    // Return default dictionary as fallback
    return NextResponse.json(defaultDictionary);
  }
}
