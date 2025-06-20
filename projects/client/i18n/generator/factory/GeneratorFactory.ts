/**
 * Factory for creating platform-specific generators
 */

import type { MetaMessages } from '../model/MetaMessages.ts';
import { Platform } from '../model/Platform.ts';
import type { PlatformGenerator } from '../model/PlatformGenerator.ts';
import { AndroidGenerator } from '../platform/AndroidGenerator.ts';
import { IOSGenerator } from '../platform/IOSGenerator.ts';
import { WebGenerator } from '../platform/WebGenerator.ts';

export const GeneratorFactory = {
  create(platform: Platform): PlatformGenerator {
    switch (platform) {
      case 'web':
        return WebGenerator;
      case 'android':
        return AndroidGenerator;
      case 'ios':
        return IOSGenerator;
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
    if (generator?.android?.enabled) {
      platforms.push(Platform.ANDROID);
    }
    if (generator?.ios?.enabled) {
      platforms.push(Platform.IOS);
    }

    return platforms;
  },
};
