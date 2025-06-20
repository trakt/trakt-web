/**
 * Tests for GeneratorFactory
 */

import { describe, expect, it } from 'vitest';
import type { MetaMessages } from '../model/MetaMessages.ts';
import { Platform } from '../model/Platform.ts';
import { AndroidGenerator } from '../platform/AndroidGenerator.ts';
import { IOSGenerator } from '../platform/IOSGenerator.ts';
import { WebGenerator } from '../platform/WebGenerator.ts';
import { GeneratorFactory } from './GeneratorFactory.ts';

describe('GeneratorFactory', () => {
  describe('create', () => {
    it('should create WebGenerator for WEB platform', () => {
      const generator = GeneratorFactory.create(Platform.WEB);
      expect(generator).toBe(WebGenerator);
    });

    it('should create AndroidGenerator for ANDROID platform', () => {
      const generator = GeneratorFactory.create(Platform.ANDROID);
      expect(generator).toBe(AndroidGenerator);
    });

    it('should create IOSGenerator for IOS platform', () => {
      const generator = GeneratorFactory.create(Platform.IOS);
      expect(generator).toBe(IOSGenerator);
    });

    it('should throw error for unsupported platform', () => {
      expect(() => {
        GeneratorFactory.create('unknown' as Platform);
      }).toThrow('Unsupported platform: unknown');
    });
  });

  describe('getEnabledPlatforms', () => {
    it('should return all enabled platforms', () => {
      const metaMessages: MetaMessages = {
        meta: {
          locale: 'en',
          generator: {
            inlang: {
              enabled: true,
              outputPath: './messages/{locale}.json',
            },
            android: {
              enabled: true,
              outputPath: './android/values-{locale}/strings.xml',
              resourceName: 'strings',
            },
            ios: {
              enabled: true,
              outputPath: './ios/Localizable.xcstrings',
            },
          },
        },
        messages: {},
      };

      const platforms = GeneratorFactory.getEnabledPlatforms(metaMessages);
      expect(platforms).toHaveLength(3);
      expect(platforms).toContain(Platform.WEB);
      expect(platforms).toContain(Platform.ANDROID);
      expect(platforms).toContain(Platform.IOS);
    });

    it('should return only enabled platforms', () => {
      const metaMessages: MetaMessages = {
        meta: {
          locale: 'en',
          generator: {
            inlang: {
              enabled: true,
              outputPath: './messages/{locale}.json',
            },
            android: {
              enabled: false,
              outputPath: './android/values-{locale}/strings.xml',
              resourceName: 'strings',
            },
            ios: {
              enabled: true,
              outputPath: './ios/Localizable.xcstrings',
            },
          },
        },
        messages: {},
      };

      const platforms = GeneratorFactory.getEnabledPlatforms(metaMessages);
      expect(platforms).toHaveLength(2);
      expect(platforms).toContain(Platform.WEB);
      expect(platforms).toContain(Platform.IOS);
      expect(platforms).not.toContain(Platform.ANDROID);
    });

    it('should return empty array when no platforms are enabled', () => {
      const metaMessages: MetaMessages = {
        meta: {
          locale: 'en',
          generator: {
            inlang: {
              enabled: false,
              outputPath: './messages/{locale}.json',
            },
            android: {
              enabled: false,
              outputPath: './android/values-{locale}/strings.xml',
              resourceName: 'strings',
            },
            ios: {
              enabled: false,
              outputPath: './ios/Localizable.xcstrings',
            },
          },
        },
        messages: {},
      };

      const platforms = GeneratorFactory.getEnabledPlatforms(metaMessages);
      expect(platforms).toHaveLength(0);
    });

    it('should return empty array when no generator config exists', () => {
      const metaMessages: MetaMessages = {
        meta: {
          locale: 'en',
        },
        messages: {},
      };

      const platforms = GeneratorFactory.getEnabledPlatforms(metaMessages);
      expect(platforms).toHaveLength(0);
    });

    it('should handle partial generator configuration', () => {
      const metaMessages: MetaMessages = {
        meta: {
          locale: 'en',
          generator: {
            inlang: {
              enabled: true,
              outputPath: './messages/{locale}.json',
            },
            // Missing android and ios configs
          },
        },
        messages: {},
      };

      const platforms = GeneratorFactory.getEnabledPlatforms(metaMessages);
      expect(platforms).toHaveLength(1);
      expect(platforms).toContain(Platform.WEB);
    });
  });
});
