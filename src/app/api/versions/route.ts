import { NextResponse } from 'next/server';
import { GetVersionsResponse } from '@/types';
import { getAllVersions } from '@/lib/storage';

/**
 * GET /api/versions
 * Retrieves all saved versions from storage
 */
export async function GET() {
  try {
    const versions = await getAllVersions();

    const response: GetVersionsResponse = {
      success: true,
      versions: versions
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error in get-versions:', error);
    return NextResponse.json(
      { 
        success: false, 
        versions: [],
        message: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
