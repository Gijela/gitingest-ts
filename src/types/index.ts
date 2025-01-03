export interface AnalyzeOptions {
  maxFileSize?: number;
  includePatterns?: string[];
  excludePatterns?: string[];
  targetPaths?: string[];
  branch?: string;
  commit?: string;
}

export interface FileInfo {
  path: string;
  content: string;
  size: number;
}

export interface AnalysisResult {
  summary: string;
  tree: string;
  content: string;
  metadata: {
    files: number;
    size: number;
    tokens: number;
  };
}

export interface GitIngestConfig {
  tempDir?: string;
  defaultMaxFileSize?: number;
  defaultPatterns?: {
    include?: string[];
    exclude?: string[];
  };
  keepTempFiles?: boolean;
  customDomainMap?: {
    targetDomain: string;
    originalDomain: string;
  };
} 