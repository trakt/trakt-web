/**
 * Tests for IOSGenerator
 */

import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { firstItem } from '../../../src/lib/utils/assert/firstItem.ts';
import type { MetaMessages } from '../model/MetaMessages.ts';
import { Platform } from '../model/Platform.ts';
import type { PlatformGenerator } from '../model/PlatformGenerator.ts';
import { IOSGenerator } from './IOSGenerator.ts';

describe('IOSGenerator', () => {
  let tempDir: string;
  let testMetaMessages: MetaMessages;
  let generator: PlatformGenerator;

  beforeEach(async () => {
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'ios-test-'));

    testMetaMessages = {
      meta: {
        locale: 'en',
        direction: 'ltr',
        generator: {
          ios: {
            enabled: true,
            outputPath: './ios/Localizable.xcstrings',
          },
        },
      },
      messages: {
        simple_message: 'Hello World',
        greeting: {
          default: 'Hello, {name}!',
          description: 'Greeting message with user name',
          platforms: {
            ios: { key: 'greetingMessage' },
          },
          variables: {
            name: {
              type: 'string',
              description: 'User display name',
            },
          },
        },
        count_message: {
          default: '{count} items remaining',
          description: 'Shows remaining item count',
          variables: {
            count: {
              type: 'number',
              description: 'Number of items',
            },
          },
        },
        platform_key_test: {
          default: 'Platform specific key test',
          description: 'Test message with different keys per platform',
          platforms: {
            ios: { key: 'iOSSpecificKey' },
          },
        },
        mixed_variables: {
          default: 'User {userName} has {count} messages',
          description: 'Complex message with multiple variable types',
          platforms: {
            ios: { key: 'userMessageCount' },
          },
          variables: {
            userName: {
              type: 'string',
              description: 'The user name',
            },
            count: {
              type: 'number',
              description: 'Message count',
            },
          },
        },
      },
    };

    generator = IOSGenerator;
  });

  afterEach(async () => {
    if (tempDir) {
      await fs.promises.rm(tempDir, { recursive: true, force: true });
    }
  });

  describe('iOS platform', () => {
    it('should generate correct iOS String Catalog format', async () => {
      const results = await generator.generate([testMetaMessages], tempDir);
      expect(results).toHaveLength(1);
      expect(firstItem(results).platform).toBe(Platform.IOS);

      const content = JSON.parse(firstItem(results).content);
      expect(content.sourceLanguage).toBe('en');
      expect(content.version).toBe('1.0');
      expect(content.strings).toBeDefined();

      // Check specific entries
      expect(content.strings.simple_message).toBeDefined();
      expect(content.strings.simple_message.localizations.en.stringUnit.value)
        .toBe(
          'Hello World',
        );

      expect(content.strings.greetingMessage).toBeDefined();
      expect(content.strings.greetingMessage.localizations.en.stringUnit.value)
        .toBe(
          'Hello, %@!',
        );

      expect(content.strings.count_message).toBeDefined();
      expect(content.strings.count_message.localizations.en.stringUnit.value)
        .toBe(
          '%d items remaining',
        );

      expect(content.strings.iOSSpecificKey).toBeDefined();
      expect(content.strings.iOSSpecificKey.localizations.en.stringUnit.value)
        .toBe(
          'Platform specific key test',
        );

      expect(content.strings.userMessageCount).toBeDefined();
      expect(content.strings.userMessageCount.localizations.en.stringUnit.value)
        .toBe(
          'User %@ has %d messages',
        );
    });

    it('should handle multiple locales in unified catalog', async () => {
      const spanishMeta: MetaMessages = {
        meta: {
          locale: 'es',
          generator: {
            ios: {
              enabled: true,
              outputPath: './ios/Localizable.xcstrings',
            },
          },
        },
        messages: {
          simple_message: 'Hola Mundo',
          greeting: {
            default: 'Hola, {name}!',
            platforms: {
              ios: { key: 'greetingMessage' },
            },
            variables: {
              name: {
                type: 'string',
                description: 'User display name',
              },
            },
          },
        },
      };

      const results = await generator.generate(
        [testMetaMessages, spanishMeta],
        tempDir,
      );
      expect(results).toHaveLength(1);

      const content = JSON.parse(firstItem(results).content);

      // Check English localization
      expect(content.strings.simple_message.localizations.en.stringUnit.value)
        .toBe(
          'Hello World',
        );
      expect(content.strings.greetingMessage.localizations.en.stringUnit.value)
        .toBe(
          'Hello, %@!',
        );

      // Check Spanish localization
      expect(content.strings.simple_message.localizations.es.stringUnit.value)
        .toBe(
          'Hola Mundo',
        );
      expect(content.strings.greetingMessage.localizations.es.stringUnit.value)
        .toBe(
          'Hola, %@!',
        );
    });

    it('should use platform-specific keys when provided', async () => {
      const results = await generator.generate([testMetaMessages], tempDir);
      const content = JSON.parse(firstItem(results).content);

      // Should use iOS-specific keys
      expect(content.strings.greetingMessage).toBeDefined();
      expect(content.strings.iOSSpecificKey).toBeDefined();
      expect(content.strings.userMessageCount).toBeDefined();

      // Should not use original keys when platform-specific ones exist
      expect(content.strings.greeting).toBeUndefined();
      expect(content.strings.platform_key_test).toBeUndefined();
      expect(content.strings.mixed_variables).toBeUndefined();
    });

    it('should handle disabled iOS generation', async () => {
      const disabledMeta: MetaMessages = {
        ...testMetaMessages,
        meta: {
          ...testMetaMessages.meta,
          generator: {
            ios: {
              enabled: false,
              outputPath: './ios/Localizable.xcstrings',
            },
          },
        },
      };

      const results = await generator.generate([disabledMeta], tempDir);
      expect(results).toHaveLength(0);
    });

    it('should convert placeholders to iOS format', async () => {
      const results = await generator.generate([testMetaMessages], tempDir);
      const content = JSON.parse(firstItem(results).content);

      // Check that string variables are converted to %@
      expect(content.strings.greetingMessage.localizations.en.stringUnit.value)
        .toBe(
          'Hello, %@!',
        );
      expect(content.strings.userMessageCount.localizations.en.stringUnit.value)
        .toBe(
          'User %@ has %d messages',
        );

      // Check that number variables are converted to %d
      expect(content.strings.count_message.localizations.en.stringUnit.value)
        .toBe(
          '%d items remaining',
        );
    });

    it('should handle empty meta messages array', async () => {
      const results = await generator.generate([], tempDir);
      expect(results).toHaveLength(0);
    });
  });

  describe('exclude functionality', () => {
    it('should exclude messages marked for iOS exclusion', async () => {
      const metaWithExclusions: MetaMessages = {
        meta: {
          locale: 'en',
          generator: {
            ios: {
              enabled: true,
              outputPath: './ios/Localizable.xcstrings',
            },
          },
        },
        messages: {
          included_message: 'This should be included',
          excluded_message: {
            default: 'This should be excluded from iOS',
            exclude: [Platform.IOS],
          },
          android_only: {
            default: 'Android only message',
            exclude: [Platform.IOS],
          },
        },
      };

      const results = await generator.generate([metaWithExclusions], tempDir);
      const content = JSON.parse(firstItem(results).content);

      expect(content.strings.included_message).toBeDefined();
      expect(content.strings.excluded_message).toBeUndefined();
      expect(content.strings.android_only).toBeUndefined();

      expect(content.strings.included_message.localizations.en.stringUnit.value)
        .toBe(
          'This should be included',
        );
    });

    it('should exclude messages from multiple locales when marked for exclusion', async () => {
      const englishMeta: MetaMessages = {
        meta: {
          locale: 'en',
          generator: {
            ios: {
              enabled: true,
              outputPath: './ios/Localizable.xcstrings',
            },
          },
        },
        messages: {
          included_message: 'Included in English',
          excluded_message: {
            default: 'Excluded from iOS',
            exclude: [Platform.IOS],
          },
        },
      };

      const spanishMeta: MetaMessages = {
        meta: {
          locale: 'es',
          generator: {
            ios: {
              enabled: true,
              outputPath: './ios/Localizable.xcstrings',
            },
          },
        },
        messages: {
          included_message: 'Incluido en Español',
          excluded_message: {
            default: 'Excluido de iOS',
            exclude: [Platform.IOS],
          },
        },
      };

      const results = await generator.generate(
        [englishMeta, spanishMeta],
        tempDir,
      );
      const content = JSON.parse(firstItem(results).content);

      // Included message should have both localizations
      expect(content.strings.included_message.localizations.en.stringUnit.value)
        .toBe(
          'Included in English',
        );
      expect(content.strings.included_message.localizations.es.stringUnit.value)
        .toBe(
          'Incluido en Español',
        );

      // Excluded message should not exist at all
      expect(content.strings.excluded_message).toBeUndefined();
    });
  });
});
