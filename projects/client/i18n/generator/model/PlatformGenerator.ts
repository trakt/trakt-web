/**
 * Interface for platform-specific generators
 */

import type { GenerationResult } from './GenerationResult.ts';
import type { MetaMessages } from './MetaMessages.ts';

export interface PlatformGenerator {
  generate(
    metaMessages: MetaMessages[],
    outputDir: string,
  ): Promise<GenerationResult[]>;
}
