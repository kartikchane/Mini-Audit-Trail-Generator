import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { SaveVersionRequest, SaveVersionResponse } from '@/types';
import { calculateTextDiff, formatTimestamp } from '@/lib/textDiff';
import { saveVersion, getLatestVersion } from '@/lib/storage';

/**
 * POST /api/save-version
 * Saves a new version and calculates diff from previous version
 */
export async function POST(request: NextRequest) {
  try {
    const body: SaveVersionRequest = await request.json();
    const { content } = body;

    if (content === undefined) {
      return NextResponse.json(
        { success: false, message: 'Content is required' },
        { status: 400 }
      );
    }

    // Get the latest version to compare against
    const latestVersion = await getLatestVersion();
    const previousContent = latestVersion ? latestVersion.content : '';

    // Calculate the diff using custom algorithm
    const diff = calculateTextDiff(previousContent, content);

    // Create new version object
    const newVersion = {
      id: uuidv4(),
      timestamp: formatTimestamp(),
      addedWords: diff.addedWords,
      removedWords: diff.removedWords,
      oldLength: diff.oldLength,
      newLength: diff.newLength,
      content: content
    };

    // Save to storage
    await saveVersion(newVersion);

    const response: SaveVersionResponse = {
      success: true,
      version: newVersion
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error in save-version:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
