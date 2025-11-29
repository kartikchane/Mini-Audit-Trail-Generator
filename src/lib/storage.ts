import { promises as fs } from 'fs';
import path from 'path';
import { Version } from '@/types';

const DATA_FILE = path.join(process.cwd(), 'data.json');

/**
 * Storage manager for version history
 * Uses JSON file for persistence (can be replaced with database)
 */

export async function initStorage() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    // File doesn't exist, create it with empty array
    await fs.writeFile(DATA_FILE, JSON.stringify({ versions: [] }, null, 2));
  }
}

export async function getAllVersions(): Promise<Version[]> {
  try {
    await initStorage();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return parsed.versions || [];
  } catch (error) {
    console.error('Error reading versions:', error);
    return [];
  }
}

export async function saveVersion(version: Version): Promise<void> {
  try {
    await initStorage();
    const versions = await getAllVersions();
    versions.push(version);
    await fs.writeFile(
      DATA_FILE, 
      JSON.stringify({ versions }, null, 2),
      'utf-8'
    );
  } catch (error) {
    console.error('Error saving version:', error);
    throw new Error('Failed to save version');
  }
}

export async function getLatestVersion(): Promise<Version | null> {
  const versions = await getAllVersions();
  return versions.length > 0 ? versions[versions.length - 1] : null;
}
