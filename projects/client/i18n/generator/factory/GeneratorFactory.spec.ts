import { describe, expect, it } from 'vitest';
import type { MetaMessages } from '../model/MetaMessages.ts';
import { Platform } from '../model/Platform.ts';
import { WebGenerator } from '../platform/WebGenerator.ts';
import { GeneratorFactory } from './GeneratorFactory.ts';

describe('GeneratorFactory', () => {
  describe('create', () => {
    it('should create WebGenerator for WEB platform', () => {
      const generator = GeneratorFactory.create(Platform.WEB);
      expect(generator).toBe(WebGenerator);
    });

    it('should throw error for unsupported platform', () => {
      expect(() => {
        GeneratorFactory.create('unknown' as Platform);
      }).toThrow('Unsupported platform: unknown');
    });
  });

  describe('getEnabledPlatforms', () => {
    it('should return web when inlang is enabled', () => {
      const metaMessages: MetaMessages = {
        meta: {
          locale: 'en',
          generator: {
            inlang: {
              enabled: true,
              outputPath: './messages/{locale}.json',
            },
          },
        },
        messages: {},
      };

      const platforms = GeneratorFactory.getEnabledPlatforms(metaMessages);
      expect(platforms).toHaveLength(1);
      expect(platforms).toContain(Platform.WEB);
    });

    it('should return empty array when inlang is disabled', () => {
      const metaMessages: MetaMessages = {
        meta: {
          locale: 'en',
          generator: {
            inlang: {
              enabled: false,
              outputPath: './messages/{locale}.json',
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
  });
});
