/**
 * Tests for generateFromMeta high-level API
 */

import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { firstItem } from '../../../src/lib/utils/assert/firstItem.ts';
import type { MetaMessages } from '../model/MetaMessages.ts';
import { Platform } from '../model/Platform.ts';
import { generateFromMeta } from './generateFromMeta.ts';

describe('generateFromMeta', () => {
  let tempDir: string;
  let metaDir: string;

  beforeEach(async () => {
    tempDir = await fs.promises.mkdtemp(
      path.join(os.tmpdir(), 'generate-meta-test-'),
    );
    metaDir = path.join(tempDir, 'meta');
    await fs.promises.mkdir(metaDir, { recursive: true });
  });

  afterEach(async () => {
    if (tempDir) {
      await fs.promises.rm(tempDir, { recursive: true, force: true });
    }
  });

  const createMetaFile = async (
    locale: string,
    messages: MetaMessages['messages'],
  ) => {
    const metaMessages: MetaMessages = {
      meta: {
        locale,
        generator: {
          inlang: {
            enabled: true,
            outputPath: `./messages/${locale}.json`,
          },
          android: {
            enabled: true,
            outputPath: `./android/values-${locale}/strings.xml`,
            resourceName: 'strings',
          },
          ios: {
            enabled: true,
            outputPath: './ios/Localizable.xcstrings',
          },
        },
      },
      messages,
    };

    const filePath = path.join(metaDir, `${locale}.json`);
    await fs.promises.writeFile(
      filePath,
      JSON.stringify(metaMessages, null, 2),
    );
    return filePath;
  };

  describe('input validation', () => {
    it('should throw error for non-existent directory', async () => {
      const nonExistentDir = path.join(tempDir, 'does-not-exist');

      await expect(
        generateFromMeta(nonExistentDir, tempDir),
      ).rejects.toThrow();
    });

    it('should throw error for file input instead of directory', async () => {
      const filePath = path.join(tempDir, 'not-a-directory.txt');
      await fs.promises.writeFile(filePath, 'content');

      await expect(
        generateFromMeta(filePath, tempDir),
      ).rejects.toThrow('Input must be a directory containing meta files');
    });

    it('should throw error for directory with no JSON files', async () => {
      const emptyDir = path.join(tempDir, 'empty');
      await fs.promises.mkdir(emptyDir);

      await expect(
        generateFromMeta(emptyDir, tempDir),
      ).rejects.toThrow('No JSON files found in directory');
    });

    it('should ignore non-JSON files in directory', async () => {
      await createMetaFile('en', { hello: 'Hello World' });
      await fs.promises.writeFile(
        path.join(metaDir, 'not-json.txt'),
        'ignored',
      );

      const results = await generateFromMeta(metaDir, tempDir);
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('successful generation', () => {
    it('should generate resources for single locale', async () => {
      await createMetaFile('en', {
        hello: 'Hello World',
        greeting: {
          default: 'Hello, {name}!',
          variables: {
            name: { type: 'string', description: 'User name' },
          },
        },
      });

      const results = await generateFromMeta(metaDir, tempDir);

      // Should generate for all enabled platforms (web, android, ios)
      expect(results).toHaveLength(3);
      expect(results.map((r) => r.platform)).toContain(Platform.WEB);
      expect(results.map((r) => r.platform)).toContain(Platform.ANDROID);
      expect(results.map((r) => r.platform)).toContain(Platform.IOS);
    });

    it('should generate resources for multiple locales', async () => {
      await createMetaFile('en', {
        hello: 'Hello World',
        goodbye: 'Goodbye',
      });
      await createMetaFile('es', {
        hello: 'Hola Mundo',
        goodbye: 'Adiós',
      });

      const results = await generateFromMeta(metaDir, tempDir);

      // Web: 2 files (en, es), Android: 2 files (en, es), iOS: 1 file (unified)
      expect(results).toHaveLength(5);

      const webResults = results.filter((r) => r.platform === Platform.WEB);
      const androidResults = results.filter((r) =>
        r.platform === Platform.ANDROID
      );
      const iosResults = results.filter((r) => r.platform === Platform.IOS);

      expect(webResults).toHaveLength(2);
      expect(androidResults).toHaveLength(2);
      expect(iosResults).toHaveLength(1);
    });

    it('should use specified platforms when provided', async () => {
      await createMetaFile('en', { hello: 'Hello World' });

      const results = await generateFromMeta(metaDir, tempDir, [Platform.WEB]);

      expect(results).toHaveLength(1);
      expect(firstItem(results).platform).toBe(Platform.WEB);
    });

    it('should use enabled platforms from meta when no platforms specified', async () => {
      // Create meta file with only web enabled
      const metaMessages: MetaMessages = {
        meta: {
          locale: 'en',
          generator: {
            inlang: {
              enabled: true,
              outputPath: './messages/en.json',
            },
            android: {
              enabled: false,
              outputPath: './android/values-en/strings.xml',
              resourceName: 'strings',
            },
            ios: {
              enabled: false,
              outputPath: './ios/Localizable.xcstrings',
            },
          },
        },
        messages: { hello: 'Hello World' },
      };

      await fs.promises.writeFile(
        path.join(metaDir, 'en.json'),
        JSON.stringify(metaMessages, null, 2),
      );

      const results = await generateFromMeta(metaDir, tempDir);

      expect(results).toHaveLength(1);
      expect(firstItem(results).platform).toBe(Platform.WEB);
    });

    it('should create output files in correct locations', async () => {
      await createMetaFile('en', { hello: 'Hello World' });

      const outputDir = path.join(tempDir, 'output');
      const results = await generateFromMeta(metaDir, outputDir);

      // Check that files were actually created
      for (const result of results) {
        expect(fs.existsSync(result.filePath)).toBe(true);
        expect(result.filePath.startsWith(outputDir)).toBe(true);
      }
    });

    it('should handle complex meta structures', async () => {
      await createMetaFile('en', {
        simple: 'Simple message',
        complex: {
          default: 'Complex {type} with {count} items',
          description: 'A complex message with variables',
          platforms: {
            android: { key: 'complex_android' },
            ios: { key: 'complexIOS' },
          },
          variables: {
            type: { type: 'string', description: 'Item type' },
            count: { type: 'number', description: 'Item count' },
          },
        },
        excluded: {
          default: 'Should not appear in Android',
          exclude: [Platform.ANDROID],
        },
      });

      const results = await generateFromMeta(metaDir, tempDir);

      expect(results).toHaveLength(3);

      // Check web content
      const webResult = results.find((r) => r.platform === Platform.WEB);
      expect(webResult).toBeDefined();
      const webContent = JSON.parse(assertDefined(webResult).content);
      expect(webContent.complex).toBe('Complex {type} with {count} items');
      expect(webContent.excluded).toBe('Should not appear in Android');

      // Check android content (should not contain excluded message)
      const androidResult = results.find((r) =>
        r.platform === Platform.ANDROID
      );
      expect(androidResult).toBeDefined();
      expect(assertDefined(androidResult).content).toContain('complex_android');
      expect(assertDefined(androidResult).content).not.toContain('excluded');

      // Check iOS content
      const iosResult = results.find((r) => r.platform === Platform.IOS);
      expect(iosResult).toBeDefined();
      const iosContent = JSON.parse(assertDefined(iosResult).content);
      expect(iosContent.strings.complexIOS).toBeDefined();
      expect(iosContent.strings.excluded).toBeDefined(); // iOS should have it
    });
  });
});
