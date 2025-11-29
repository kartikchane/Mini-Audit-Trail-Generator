export interface Version {
  id: string;
  timestamp: string;
  addedWords: string[];
  removedWords: string[];
  oldLength: number;
  newLength: number;
  content: string;
}

export interface SaveVersionRequest {
  content: string;
}

export interface SaveVersionResponse {
  success: boolean;
  version: Version;
  message?: string;
}

export interface GetVersionsResponse {
  success: boolean;
  versions: Version[];
}
