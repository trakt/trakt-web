/**
 * Result of generation process
 */

import type { Platform } from './Platform.ts';

export interface GenerationResult {
  platform: Platform;
  filePath: string;
  content: string;
}
