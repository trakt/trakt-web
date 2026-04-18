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
      await createMetaFile('en', { hello: { default: 'Hello World' } });
      await fs.promises.writeFile(
        path.join(metaDir, 'not-json.txt'),
        'ignored',
      );

      const results = await generateFromMeta(metaDir, tempDir);
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('successful generation', () => {
    it('should generate web resource for single locale', async () => {
      await createMetaFile('en', {
        hello: { default: 'Hello World' },
        greeting: {
          default: 'Hello, {name}!',
          variables: {
            name: { type: 'string', description: 'User name' },
          },
        },
      });

      const results = await generateFromMeta(metaDir, tempDir);

      expect(results).toHaveLength(1);
      expect(firstItem(results).platform).toBe(Platform.WEB);
    });

    it('should generate web resources for multiple locales', async () => {
      await createMetaFile('en', {
        hello: { default: 'Hello World' },
        goodbye: { default: 'Goodbye' },
      });
      await createMetaFile('es', {
        hello: { default: 'Hola Mundo' },
        goodbye: { default: 'Adiós' },
      });

      const results = await generateFromMeta(metaDir, tempDir);

      expect(results).toHaveLength(2);
      expect(results.every((r) => r.platform === Platform.WEB)).toBe(true);
    });

    it('should use specified platforms when provided', async () => {
      await createMetaFile('en', { hello: { default: 'Hello World' } });

      const results = await generateFromMeta(metaDir, tempDir, [Platform.WEB]);

      expect(results).toHaveLength(1);
      expect(firstItem(results).platform).toBe(Platform.WEB);
    });

    it('should use enabled platforms from meta when no platforms specified', async () => {
      const metaMessages: MetaMessages = {
        meta: {
          locale: 'en',
          generator: {
            inlang: {
              enabled: true,
              outputPath: './messages/en.json',
            },
          },
        },
        messages: { hello: { default: 'Hello World' } },
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
      await createMetaFile('en', { hello: { default: 'Hello World' } });

      const outputDir = path.join(tempDir, 'output');
      const results = await generateFromMeta(metaDir, outputDir);

      for (const result of results) {
        expect(fs.existsSync(result.filePath)).toBe(true);
        expect(result.filePath.startsWith(outputDir)).toBe(true);
      }
    });

    it('should handle complex meta structures', async () => {
      await createMetaFile('en', {
        simple: { default: 'Simple message' },
        complex: {
          default: 'Complex {type} with {count} items',
          description: 'A complex message with variables',
          variables: {
            type: { type: 'string', description: 'Item type' },
            count: { type: 'number', description: 'Item count' },
          },
        },
        excluded: {
          default: 'Should not appear in web',
          exclude: [Platform.WEB],
        },
      });

      const results = await generateFromMeta(metaDir, tempDir);

      expect(results).toHaveLength(1);
      const webResult = results.find((r) => r.platform === Platform.WEB);
      expect(webResult).toBeDefined();
      const webContent = JSON.parse(assertDefined(webResult).content);
      expect(webContent.complex).toBe('Complex {type} with {count} items');
      expect(webContent.excluded).toBeUndefined();
    });
  });

  describe('stale key pruning', () => {
    it('should prune keys removed from en.json from locale message files', async () => {
      await createMetaFile('en', { hello: { default: 'Hello World' } });

      const messagesDir = path.join(tempDir, 'messages');
      await fs.promises.mkdir(messagesDir, { recursive: true });
      await fs.promises.writeFile(
        path.join(messagesDir, 'fr-fr.json'),
        JSON.stringify({
          '$schema': 'https://inlang.com/schema/inlang-message-format',
          'hello': 'Bonjour le monde',
          'stale_key': 'Ce texte est périmé',
        }),
      );

      await generateFromMeta(metaDir, tempDir);

      const content = JSON.parse(
        await fs.promises.readFile(
          path.join(messagesDir, 'fr-fr.json'),
          'utf-8',
        ),
      );
      expect(content.hello).toBe('Bonjour le monde');
      expect(content.stale_key).toBeUndefined();
      expect(content.$schema).toBeDefined();
    });

    it('should not modify en.json during pruning', async () => {
      await createMetaFile('en', { hello: { default: 'Hello World' } });

      await generateFromMeta(metaDir, tempDir);

      const messagesDir = path.join(tempDir, 'messages');
      const enContent = JSON.parse(
        await fs.promises.readFile(
          path.join(messagesDir, 'en.json'),
          'utf-8',
        ),
      );
      expect(enContent.hello).toBe('Hello World');
    });

    it('should be a no-op when messages directory does not exist', async () => {
      await createMetaFile('en', { hello: { default: 'Hello World' } });

      const outputDir = path.join(tempDir, 'fresh-output');
      await expect(
        generateFromMeta(metaDir, outputDir),
      ).resolves.not.toThrow();
    });

    it('should prune web-excluded keys from locale message files', async () => {
      await createMetaFile('en', {
        hello: { default: 'Hello World' },
        android_only: {
          default: 'Android only',
          exclude: [Platform.WEB],
        },
      });

      const messagesDir = path.join(tempDir, 'messages');
      await fs.promises.mkdir(messagesDir, { recursive: true });
      await fs.promises.writeFile(
        path.join(messagesDir, 'fr-fr.json'),
        JSON.stringify({
          '$schema': 'https://inlang.com/schema/inlang-message-format',
          'hello': 'Bonjour',
          'android_only': 'Android uniquement',
        }),
      );

      await generateFromMeta(metaDir, tempDir);

      const content = JSON.parse(
        await fs.promises.readFile(
          path.join(messagesDir, 'fr-fr.json'),
          'utf-8',
        ),
      );
      expect(content.hello).toBe('Bonjour');
      expect(content.android_only).toBeUndefined();
    });
  });
});
