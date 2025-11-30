import { Version } from '@/types';

/**
 * Storage manager for version history
 * Uses in-memory storage for serverless environments (Vercel)
 * Note: Data persists only during the serverless function lifecycle
 * For production, consider using a database like MongoDB, PostgreSQL, or Redis
 */

// In-memory storage (works in serverless environments)
let versionsCache: Version[] = [];

/**
 * Initialize storage (no-op for in-memory)
 */
export async function initStorage() {
  // No initialization needed for in-memory storage
  return Promise.resolve();
}

/**
 * Get all versions from storage
 */
export async function getAllVersions(): Promise<Version[]> {
  return Promise.resolve(versionsCache);
}

/**
 * Save a new version to storage
 */
export async function saveVersion(version: Version): Promise<void> {
  versionsCache.push(version);
  return Promise.resolve();
}

/**
 * Get the most recent version
 */
export async function getLatestVersion(): Promise<Version | null> {
  return Promise.resolve(
    versionsCache.length > 0 ? versionsCache[versionsCache.length - 1] : null
  );
}

/**
 * Clear all versions (useful for testing)
 */
export async function clearAllVersions(): Promise<void> {
  versionsCache = [];
  return Promise.resolve();
}
