/**
 * Generator for creating platform-specific internationalization resources
 * from meta message definitions using a factory pattern.
 */

import { firstItem } from '$lib/utils/assert/firstItem.ts';
import { GeneratorFactory } from '../factory/GeneratorFactory.ts';
import type { GenerationResult } from '../model/GenerationResult.ts';
import type { MetaMessages } from '../model/MetaMessages.ts';
import { Platform } from '../model/Platform.ts';

export { type GenerationResult } from '../model/GenerationResult.ts';
export { type MetaMessageDefinition } from '../model/MetaMessageDefinition.ts';
export { type MetaMessages } from '../model/MetaMessages.ts';
export { type MetaMessageVariable } from '../model/MetaMessageVariable.ts';
export { Platform } from '../model/Platform.ts';
export { type PlatformGenerator } from '../model/PlatformGenerator.ts';

export { GeneratorFactory } from '../factory/GeneratorFactory.ts';
export { generateFromMeta } from './generateFromMeta.ts';

/**
 * Main generator class that orchestrates platform-specific generation
 */
export class I18nGenerator {
  constructor(private _metaMessages: MetaMessages[]) {}

  /**
   * Generate resources for specified platforms
   */
  async generatePlatforms(
    platforms: Platform[],
    outputDir: string,
  ): Promise<GenerationResult[]> {
    const results: GenerationResult[] = [];

    for (const platform of platforms) {
      const generator = GeneratorFactory.create(platform);
      const platformResults = await generator.generate(
        this._metaMessages,
        outputDir,
      );
      results.push(...platformResults);
    }

    return results;
  }

  /**
   * Generate resources for all enabled platforms
   */
  generateAll(outputDir: string): Promise<GenerationResult[]> {
    const enabledPlatforms = GeneratorFactory.getEnabledPlatforms(
      firstItem(this._metaMessages),
    );
    return this.generatePlatforms(enabledPlatforms, outputDir);
  }
}
