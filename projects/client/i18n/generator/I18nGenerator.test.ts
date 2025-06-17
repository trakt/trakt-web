/**
 * Integration tests for I18nGenerator
 */

import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { I18nGenerator, type MetaMessages } from './I18nGenerator.ts';

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
      messages: {
        simple_message: 'Hello World',
        greeting: {
          default: 'Hello, {name}!',
          description: 'Greeting message with user name',
          platforms: {
            android: { key: 'greeting_message' },
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
        mobile_only: {
          default: 'Mobile only feature',
          description: 'Feature only available on mobile platforms',
          platforms: {
            android: { key: 'mobile_feature' },
            ios: { key: 'mobileFeature' },
          },
        },
        platform_key_test: {
          default: 'Platform specific key test',
          description: 'Test message with different keys per platform',
          platforms: {
            android: { key: 'android_specific_key' },
            ios: { key: 'iOSSpecificKey' },
          },
        },
        mixed_variables: {
          default: 'User {userName} has {count} messages',
          description: 'Complex message with multiple variable types',
          platforms: {
            android: { key: 'user_message_count' },
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

    generator = new I18nGenerator(testMetaMessages);
  });

  afterEach(async () => {
    if (tempDir) {
      await fs.promises.rm(tempDir, { recursive: true, force: true });
    }
  });

  describe('generateInlang', () => {
    it('should generate correct Inlang JSON format', () => {
      const result = generator.generateInlang();

      expect(result).toEqual({
        '$schema': 'https://inlang.com/schema/inlang-message-format',
        'simple_message': 'Hello World',
        'greeting': 'Hello, {name}!',
        'count_message': '{count} items remaining',
        'mobile_only': 'Mobile only feature',
        'platform_key_test': 'Platform specific key test',
        'mixed_variables': 'User {userName} has {count} messages',
      });
    });

    it('should use clean placeholders without type annotations', () => {
      const result = generator.generateInlang();

      // Ensure no ICU type annotations remain
      expect(result.count_message).toBe('{count} items remaining');
      expect(result.mixed_variables).toBe(
        'User {userName} has {count} messages',
      );

      // Ensure no {variable, type} format
      expect(JSON.stringify(result)).not.toContain('{count, number}');
      expect(JSON.stringify(result)).not.toContain('{userName, string}');
    });
  });

  describe('generateAndroid', () => {
    it('should generate correct Android XML format', () => {
      const result = generator.generateAndroid();

      expect(result).toContain('<?xml version="1.0" encoding="utf-8"?>');
      expect(result).toContain('<resources>');
      expect(result).toContain('</resources>');
      expect(result).toContain('Generated from meta messages for locale: en');
    });

    it('should handle simple string messages', () => {
      const result = generator.generateAndroid();

      expect(result).toContain(
        '<string name="simple_message">Hello World</string>',
      );
    });

    it('should convert string variables to %s', () => {
      const result = generator.generateAndroid();

      expect(result).toContain(
        '<string name="greeting_message">Hello, %s!</string>',
      );
    });

    it('should convert number variables to %d', () => {
      const result = generator.generateAndroid();

      expect(result).toContain(
        '<string name="count_message">%d items remaining</string>',
      );
    });

    it('should handle mixed variable types correctly', () => {
      const result = generator.generateAndroid();

      expect(result).toContain(
        '<string name="user_message_count">User %s has %d messages</string>',
      );
    });

    it('should use platform-specific keys when defined', () => {
      const result = generator.generateAndroid();

      expect(result).toContain('name="greeting_message"'); // android key
      expect(result).toContain('name="mobile_feature"'); // android key
      expect(result).toContain('name="android_specific_key"'); // android key
      expect(result).not.toContain('name="greeting"'); // original key
    });

    it('should include comments for descriptions', () => {
      const result = generator.generateAndroid();

      expect(result).toContain('<!-- Greeting message with user name -->');
      expect(result).toContain('<!-- Shows remaining item count -->');
      expect(result).toContain(
        '<!-- Feature only available on mobile platforms -->',
      );
    });
  });

  describe('generateIOS', () => {
    it('should generate correct String Catalog format', () => {
      const result = generator.generateIOS();
      const xcstrings = JSON.parse(result);

      expect(xcstrings.sourceLanguage).toBe('en');
      expect(xcstrings.version).toBe('1.0');
      expect(xcstrings.strings).toBeDefined();
    });

    it('should handle simple string messages', () => {
      const result = generator.generateIOS();
      const xcstrings = JSON.parse(result);

      expect(xcstrings.strings.simple_message).toEqual({
        localizations: {
          en: {
            stringUnit: {
              state: 'translated',
              value: 'Hello World',
            },
          },
        },
      });
    });

    it('should convert string variables to %@', () => {
      const result = generator.generateIOS();
      const xcstrings = JSON.parse(result);

      expect(
        xcstrings.strings.greetingMessage.localizations.en.stringUnit.value,
      ).toBe('Hello, %@!');
    });

    it('should convert number variables to %d', () => {
      const result = generator.generateIOS();
      const xcstrings = JSON.parse(result);

      expect(xcstrings.strings.count_message.localizations.en.stringUnit.value)
        .toBe('%d items remaining');
    });

    it('should handle mixed variable types correctly', () => {
      const result = generator.generateIOS();
      const xcstrings = JSON.parse(result);

      expect(
        xcstrings.strings.userMessageCount.localizations.en.stringUnit.value,
      ).toBe('User %@ has %d messages');
    });

    it('should use platform-specific keys when defined', () => {
      const result = generator.generateIOS();
      const xcstrings = JSON.parse(result);

      expect(xcstrings.strings.greetingMessage).toBeDefined(); // ios key
      expect(xcstrings.strings.mobileFeature).toBeDefined(); // ios key
      expect(xcstrings.strings.iOSSpecificKey).toBeDefined(); // ios key
      expect(xcstrings.strings.greeting).toBeUndefined(); // original key should not exist
    });

    it('should include comments for descriptions', () => {
      const result = generator.generateIOS();
      const xcstrings = JSON.parse(result);

      expect(xcstrings.strings.greetingMessage.comment).toBe(
        'Greeting message with user name',
      );
      expect(xcstrings.strings.count_message.comment).toBe(
        'Shows remaining item count',
      );
      expect(xcstrings.strings.mobileFeature.comment).toBe(
        'Feature only available on mobile platforms',
      );
    });
  });

  describe('generateAll', () => {
    it('should write all enabled platform files', async () => {
      await generator.generateAll(tempDir);

      // Check Inlang file
      const inlangPath = path.join(tempDir, 'messages', 'en.json');
      expect(await fs.promises.access(inlangPath)).toBeUndefined();
      const inlangContent = await fs.promises.readFile(inlangPath, 'utf-8');
      const inlangData = JSON.parse(inlangContent);
      expect(inlangData.simple_message).toBe('Hello World');

      // Check Android file
      const androidPath = path.join(
        tempDir,
        'android',
        'values-en',
        'strings.xml',
      );
      expect(await fs.promises.access(androidPath)).toBeUndefined();
      const androidContent = await fs.promises.readFile(androidPath, 'utf-8');
      expect(androidContent).toContain(
        '<string name="simple_message">Hello World</string>',
      );

      // Check iOS String Catalog file
      const iosPath = path.join(tempDir, 'ios', 'Localizable.xcstrings');
      expect(await fs.promises.access(iosPath)).toBeUndefined();
      const iosContent = await fs.promises.readFile(iosPath, 'utf-8');
      const iosData = JSON.parse(iosContent);
      expect(iosData.strings.simple_message.localizations.en.stringUnit.value)
        .toBe('Hello World');
    });

    it('should handle output path templates correctly', async () => {
      await generator.generateAll(tempDir);

      // Verify that {locale} was replaced with 'en'
      const inlangExists = await fs.promises.access(
        path.join(tempDir, 'messages', 'en.json'),
      )
        .then(() => true)
        .catch(() => false);
      expect(inlangExists).toBe(true);

      const androidExists = await fs.promises.access(
        path.join(tempDir, 'android', 'values-en', 'strings.xml'),
      )
        .then(() => true)
        .catch(() => false);
      expect(androidExists).toBe(true);

      const iosExists = await fs.promises.access(
        path.join(tempDir, 'ios', 'Localizable.xcstrings'),
      )
        .then(() => true)
        .catch(() => false);
      expect(iosExists).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle messages without variables', () => {
      const simpleGenerator = new I18nGenerator({
        meta: { locale: 'en', direction: 'ltr' },
        messages: { simple: 'Hello' },
      });

      expect(simpleGenerator.generateInlang().simple).toBe('Hello');
      expect(simpleGenerator.generateAndroid()).toContain(
        '<string name="simple">Hello</string>',
      );
      const iosResult = simpleGenerator.generateIOS();
      const iosData = JSON.parse(iosResult);
      expect(iosData.strings.simple.localizations.en.stringUnit.value).toBe(
        'Hello',
      );
    });

    it('should handle messages without platform-specific keys', () => {
      const simpleGenerator = new I18nGenerator({
        meta: { locale: 'en', direction: 'ltr' },
        messages: {
          test: {
            default: 'Test {value}',
            variables: {
              value: {
                type: 'string',
                description: 'Test value',
              },
            },
          },
        },
      });

      // Should use original key when no platform-specific key is defined
      expect(simpleGenerator.generateAndroid()).toContain('name="test"');
      const iosResult = simpleGenerator.generateIOS();
      const iosData = JSON.parse(iosResult);
      expect(iosData.strings.test).toBeDefined();
    });
  });
});
