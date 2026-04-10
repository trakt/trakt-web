import type { MetaMessages } from '../model/MetaMessages.ts';
import { Platform } from '../model/Platform.ts';
import type { PlatformGenerator } from '../model/PlatformGenerator.ts';
import { WebGenerator } from '../platform/WebGenerator.ts';

export const GeneratorFactory = {
  create(platform: Platform): PlatformGenerator {
    switch (platform) {
      case 'web':
        return WebGenerator;
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  },

  getEnabledPlatforms(metaMessages: MetaMessages): Platform[] {
    const platforms: Platform[] = [];
    const { generator } = metaMessages.meta;

    if (generator?.inlang?.enabled) {
      platforms.push(Platform.WEB);
    }

    return platforms;
  },
};
