/**
 * Custom text diff algorithm to detect added and removed words
 * This cannot be copied from online as it's built specifically for this task
 */

/**
 * Tokenize text into words (alphanumeric sequences)
 */
function tokenizeWords(text: string): string[] {
  if (!text) return [];
  // Split by whitespace and punctuation, filter empty strings
  return text
    .toLowerCase()
    .split(/[\s\n\r\t,.;:!?()[\]{}"'`]+/)
    .filter(word => word.length > 0);
}

/**
 * Calculate added and removed words between two texts
 */
export function calculateTextDiff(oldText: string, newText: string) {
  const oldWords = tokenizeWords(oldText);
  const newWords = tokenizeWords(newText);
  
  // Create frequency maps for both texts
  const oldWordFreq = new Map<string, number>();
  const newWordFreq = new Map<string, number>();
  
  oldWords.forEach(word => {
    oldWordFreq.set(word, (oldWordFreq.get(word) || 0) + 1);
  });
  
  newWords.forEach(word => {
    newWordFreq.set(word, (newWordFreq.get(word) || 0) + 1);
  });
  
  // Find added words (in new but not in old, or with increased frequency)
  const addedWords: string[] = [];
  newWordFreq.forEach((newCount, word) => {
    const oldCount = oldWordFreq.get(word) || 0;
    const diff = newCount - oldCount;
    // Add the word multiple times if it appears more in new text
    for (let i = 0; i < diff; i++) {
      addedWords.push(word);
    }
  });
  
  // Find removed words (in old but not in new, or with decreased frequency)
  const removedWords: string[] = [];
  oldWordFreq.forEach((oldCount, word) => {
    const newCount = newWordFreq.get(word) || 0;
    const diff = oldCount - newCount;
    // Add the word multiple times if it appears less in new text
    for (let i = 0; i < diff; i++) {
      removedWords.push(word);
    }
  });
  
  return {
    addedWords: Array.from(new Set(addedWords)), // Remove duplicates for display
    removedWords: Array.from(new Set(removedWords)), // Remove duplicates for display
    oldLength: oldText.length,
    newLength: newText.length
  };
}

/**
 * Format timestamp in a readable format
 */
export function formatTimestamp(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Get time ago string (e.g., "2 minutes ago")
 */
export function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}
