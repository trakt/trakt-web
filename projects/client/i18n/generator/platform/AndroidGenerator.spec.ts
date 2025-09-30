/**
 * Tests for AndroidGenerator
 */

import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { firstItem } from '../../../src/lib/utils/assert/firstItem.ts';
import type { MetaMessages } from '../model/MetaMessages.ts';
import { Platform } from '../model/Platform.ts';
import type { PlatformGenerator } from '../model/PlatformGenerator.ts';
import { AndroidGenerator } from './AndroidGenerator.ts';

describe('AndroidGenerator', () => {
  let tempDir: string;
  let testMetaMessages: MetaMessages;
  let generator: PlatformGenerator;

  beforeEach(async () => {
    tempDir = await fs.promises.mkdtemp(
      path.join(os.tmpdir(), 'android-test-'),
    );

    testMetaMessages = {
      meta: {
        locale: 'en',
        direction: 'ltr',
        generator: {
          android: {
            enabled: true,
            outputPath: './android/values-{locale}/strings.xml',
            resourceName: 'strings',
          },
        },
      },
      messages: {
        simple_message: {
          default: 'Hello World',
        },
        greeting: {
          default: 'Hello, {name}!',
          description: 'Greeting message with user name',
          platforms: {
            android: { key: 'greeting_message' },
          },
          variables: {
            name: {
              type: 'string',
            },
          },
        },
        count_message: {
          default: '{count} items remaining',
          description: 'Shows remaining item count',
          variables: {
            count: {
              type: 'number',
            },
          },
        },
        platform_key_test: {
          default: 'Platform specific key test',
          description: 'Test message with different keys per platform',
          platforms: {
            android: { key: 'android_specific_key' },
          },
        },
        mixed_variables: {
          default: 'User {userName} has {count} messages',
          description: 'Complex message with multiple variable types',
          platforms: {
            android: { key: 'user_message_count' },
          },
          variables: {
            userName: {
              type: 'string',
            },
            count: {
              type: 'number',
            },
          },
        },
      },
    };

    generator = AndroidGenerator;
  });

  afterEach(async () => {
    if (tempDir) {
      await fs.promises.rm(tempDir, { recursive: true, force: true });
    }
  });

  describe('Android platform', () => {
    it('should generate correct Android XML format', async () => {
      const results = await generator.generate([testMetaMessages], tempDir);
      expect(results).toHaveLength(1);
      expect(firstItem(results).platform).toBe('android');

      const content = firstItem(results).content;
      expect(content).toContain('<?xml version="1.0" encoding="utf-8"?>');
      expect(content).toContain('<resources>');
      expect(content).toContain('</resources>');
      expect(content).toContain(
        '<string name="simple_message">Hello World</string>',
      );
      expect(content).toContain(
        '<string name="greeting_message">Hello, %s!</string>',
      );
      expect(content).toContain(
        '<string name="count_message">%d items remaining</string>',
      );
      expect(content).toContain(
        '<string name="android_specific_key">Platform specific key test</string>',
      );
      expect(content).toContain(
        '<string name="user_message_count">User %1$s has %2$d messages</string>',
      );
    });

    it('should escape XML special characters', async () => {
      const metaWithSpecialChars: MetaMessages = {
        meta: {
          locale: 'en',
          generator: {
            android: {
              enabled: true,
              outputPath: './android/values-{locale}/strings.xml',
              resourceName: 'strings',
            },
          },
        },
        messages: {
          special_chars: {
            default: 'This & that < > "quotes" \'apostrophe\'',
            description: 'Message with special XML characters',
          },
        },
      };

      const results = await generator.generate([metaWithSpecialChars], tempDir);
      const content = firstItem(results).content;
      expect(content).toContain(
        "<string name=\"special_chars\">This &amp; that &lt; &gt; \\\"quotes\\\" \\'apostrophe\\'</string>",
      );
    });

    it('should use platform-specific keys when provided', async () => {
      const results = await generator.generate([testMetaMessages], tempDir);
      const content = firstItem(results).content;

      expect(content).toContain('name="greeting_message"');
      expect(content).toContain('name="android_specific_key"');
      expect(content).toContain('name="user_message_count"');
    });

    it('should handle disabled Android generation', async () => {
      const disabledMeta: MetaMessages = {
        ...testMetaMessages,
        meta: {
          ...testMetaMessages.meta,
          generator: {
            android: {
              enabled: false,
              outputPath: './android/values-{locale}/strings.xml',
              resourceName: 'strings',
            },
          },
        },
      };

      const results = await generator.generate([disabledMeta], tempDir);
      expect(results).toHaveLength(0);
    });

    it('should convert placeholders to Android format', async () => {
      const results = await generator.generate([testMetaMessages], tempDir);
      const content = firstItem(results).content;

      // Check that string variables are converted to %s
      expect(content).toContain('Hello, %s!');
      expect(content).toContain('User %1$s has %2$d messages');

      // Check that number variables are converted to %d
      expect(content).toContain('%d items remaining');
    });
  });

  describe('exclude functionality', () => {
    it('should exclude messages marked for Android exclusion', async () => {
      const metaWithExclusions: MetaMessages = {
        meta: {
          locale: 'en',
          generator: {
            android: {
              enabled: true,
              outputPath: './android/values-{locale}/strings.xml',
              resourceName: 'strings',
            },
          },
        },
        messages: {
          included_message: {
            default: 'This should be included',
          },
          excluded_message: {
            default: 'This should be excluded from Android',
            exclude: [Platform.ANDROID],
          },
          web_only: {
            default: 'Web only message',
            exclude: [Platform.ANDROID],
          },
        },
      };

      const results = await generator.generate([metaWithExclusions], tempDir);
      const content = firstItem(results).content;

      expect(content).toContain('included_message');
      expect(content).not.toContain('excluded_message');
      expect(content).not.toContain('web_only');
      expect(content).toContain('This should be included');
      expect(content).not.toContain('This should be excluded from Android');
      expect(content).not.toContain('Web only message');
    });
  });

  describe('Android resource folder naming', () => {
    it('should use language-only folder when only one locale exists for a language', async () => {
      const italianMeta: MetaMessages = {
        meta: {
          locale: 'it',
          generator: {
            android: {
              enabled: true,
              outputPath: './android/values-{locale}/strings.xml',
              resourceName: 'strings',
            },
          },
        },
        messages: {
          test: {
            default: 'Test message',
          },
        },
      };

      const results = await generator.generate([italianMeta], tempDir);

      // Should use 'values-it' since it's the only Italian locale
      expect(firstItem(results).filePath).toContain('values-it');
      expect(firstItem(results).filePath).not.toContain('values-it-IT');
    });

    it('should use full locale folder when multiple locales exist for a language', async () => {
      const frenchCAMeta: MetaMessages = {
        meta: {
          locale: 'fr-CA',
          generator: {
            android: {
              enabled: true,
              outputPath: './android/values-{locale}/strings.xml',
              resourceName: 'strings',
            },
          },
        },
        messages: {
          test: {
            default: 'Message de test',
            description: 'French Canadian test message',
          },
        },
      };

      const frenchFRMeta: MetaMessages = {
        meta: {
          locale: 'fr-FR',
          generator: {
            android: {
              enabled: true,
              outputPath: './android/values-{locale}/strings.xml',
              resourceName: 'strings',
            },
          },
        },
        messages: {
          test: {
            default: 'Message de test',
            description: 'French test message',
          },
        },
      };

      // Generate with both French locales
      const results = await generator.generate(
        [frenchCAMeta, frenchFRMeta],
        tempDir,
      );

      // Should use full locales since multiple French variants exist
      const paths = results.map((r) => r.filePath);
      expect(paths.some((p) => p.includes('values-fr-CA'))).toBe(true);
      expect(paths.some((p) => p.includes('values-fr-FR'))).toBe(true);
    });

    it('should handle complex locales correctly', async () => {
      const complexMeta: MetaMessages = {
        meta: {
          locale: 'zh-Hans-CN',
          generator: {
            android: {
              enabled: true,
              outputPath: './android/values-{locale}/strings.xml',
              resourceName: 'strings',
            },
          },
        },
        messages: {
          test: {
            default: '测试消息',
            description: 'Test message in simplified Chinese',
          },
        },
      };

      const results = await generator.generate([complexMeta], tempDir);

      // Should handle complex locales properly
      expect(firstItem(results).filePath).toContain('values-zh');
    });
  });
});
