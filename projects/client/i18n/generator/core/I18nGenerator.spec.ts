/**
 * Integration tests for I18nGenerator
 */

import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { firstItem } from '../../../src/lib/utils/assert/firstItem.ts';
import type { MetaMessages } from '../model/MetaMessages.ts';
import { Platform } from '../model/Platform.ts';
import { I18nGenerator } from './I18nGenerator.ts';

describe('I18nGenerator', () => {
  let tempDir: string;
  let testMetaMessages: MetaMessages;
  let generator: I18nGenerator;

  beforeEach(async () => {
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'i18n-test-'));

    testMetaMessages = {
      meta: {
        locale: 'en',
        direction: 'ltr',
        generator: {
          inlang: {
            enabled: true,
            outputPath: './messages/{locale}.json',
          },
        },
      },
      messages: {
        simple_message: { default: 'Hello World' },
        greeting: {
          default: 'Hello, {name}!',
          description: 'Greeting message with user name',
          variables: {
            name: { type: 'string' },
          },
        },
        count_message: {
          default: '{count} items remaining',
          description: 'Shows remaining item count',
          variables: {
            count: { type: 'number' },
          },
        },
        mixed_variables: {
          default: 'User {userName} has {count} messages',
          description: 'Complex message with multiple variable types',
          variables: {
            userName: { type: 'string' },
            count: { type: 'number' },
          },
        },
      },
    };

    generator = new I18nGenerator([testMetaMessages]);
  });

  afterEach(async () => {
    if (tempDir) {
      await fs.promises.rm(tempDir, { recursive: true, force: true });
    }
  });

  describe('generatePlatforms', () => {
    describe('Web platform', () => {
      it('should generate correct Inlang JSON format', async () => {
        const results = await generator.generatePlatforms(
          [Platform.WEB],
          tempDir,
        );
        expect(results).toHaveLength(1);
        expect(firstItem(results).platform).toBe(Platform.WEB);

        const content = JSON.parse(firstItem(results).content);
        expect(content).toEqual({
          '$schema': 'https://inlang.com/schema/inlang-message-format',
          'simple_message': 'Hello World',
          'greeting': 'Hello, {name}!',
          'count_message': '{count} items remaining',
          'mixed_variables': 'User {userName} has {count} messages',
        });
      });

      it('should use clean placeholders without type annotations', async () => {
        const results = await generator.generatePlatforms(
          [Platform.WEB],
          tempDir,
        );
        const content = JSON.parse(firstItem(results).content);

        expect(content.count_message).toBe('{count} items remaining');
        expect(content.mixed_variables).toBe(
          'User {userName} has {count} messages',
        );
        expect(JSON.stringify(content)).not.toContain('{count, number}');
        expect(JSON.stringify(content)).not.toContain('{userName, string}');
      });
    });
  });

  describe('generateAll', () => {
    it('should write the web platform file', async () => {
      const results = await generator.generateAll(tempDir);
      expect(results).toHaveLength(1);
      expect(firstItem(results).platform).toBe(Platform.WEB);

      const inlangPath = path.join(tempDir, 'messages', 'en.json');
      expect(await fs.promises.access(inlangPath)).toBeUndefined();
      const inlangContent = await fs.promises.readFile(inlangPath, 'utf-8');
      const inlangData = JSON.parse(inlangContent);
      expect(inlangData.simple_message).toBe('Hello World');
    });

    it('should replace {locale} in output path', async () => {
      await generator.generateAll(tempDir);

      const inlangExists = await fs.promises
        .access(path.join(tempDir, 'messages', 'en.json'))
        .then(() => true)
        .catch(() => false);
      expect(inlangExists).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle messages without variables', async () => {
      const simpleGenerator = new I18nGenerator([{
        meta: {
          locale: 'en',
          direction: 'ltr',
          generator: {
            inlang: { enabled: true, outputPath: './messages/{locale}.json' },
          },
        },
        messages: { simple: { default: 'Hello' } },
      }]);

      const results = await simpleGenerator.generatePlatforms(
        [Platform.WEB],
        tempDir,
      );
      const content = JSON.parse(firstItem(results).content);
      expect(content.simple).toBe('Hello');
    });
  });

  describe('exclude functionality', () => {
    it('should exclude messages from Web when exclude contains web', async () => {
      const excludeGenerator = new I18nGenerator([{
        meta: {
          locale: 'en',
          direction: 'ltr',
          generator: {
            inlang: {
              enabled: true,
              outputPath: './messages/{locale}.json',
            },
          },
        },
        messages: {
          common_message: { default: 'Available everywhere' },
          web_excluded: {
            default: 'Not for Web',
            exclude: [Platform.WEB],
          },
        },
      }]);

      const results = await excludeGenerator.generatePlatforms(
        [Platform.WEB],
        tempDir,
      );

      expect(results).toHaveLength(1);
      const webData = JSON.parse(firstItem(results).content);

      expect(webData.common_message).toBe('Available everywhere');
      expect(webData.web_excluded).toBeUndefined();
    });
  });
});
