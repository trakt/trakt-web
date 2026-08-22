export type ExportStatus =
  | { type: 'fetch'; item: string }
  | { type: 'zip' }
  | { type: 'partial'; failed: number }
  | { type: 'complete' };
