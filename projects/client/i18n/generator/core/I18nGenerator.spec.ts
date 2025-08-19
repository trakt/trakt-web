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
        simple_message: { default: 'Hello World' },
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
            },
            count: {
              type: 'number',
            },
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
          'mobile_only': 'Mobile only feature',
          'platform_key_test': 'Platform specific key test',
          'mixed_variables': 'User {userName} has {count} messages',
        });
      });

      it('should use clean placeholders without type annotations', async () => {
        const results = await generator.generatePlatforms(
          [Platform.WEB],
          tempDir,
        );
        const content = JSON.parse(firstItem(results).content);

        // Ensure no ICU type annotations remain
        expect(content.count_message).toBe('{count} items remaining');
        expect(content.mixed_variables).toBe(
          'User {userName} has {count} messages',
        );

        // Ensure no {variable, type} format
        expect(JSON.stringify(content)).not.toContain('{count, number}');
        expect(JSON.stringify(content)).not.toContain('{userName, string}');
      });
    });

    describe('Android platform', () => {
      it('should generate correct Android XML format', async () => {
        const results = await generator.generatePlatforms(
          [Platform.ANDROID],
          tempDir,
        );
        expect(results).toHaveLength(1);
        expect(firstItem(results).platform).toBe(Platform.ANDROID);

        const content = firstItem(results).content;
        expect(content).toContain('<?xml version="1.0" encoding="utf-8"?>');
        expect(content).toContain('<resources>');
        expect(content).toContain('</resources>');
      });

      it('should handle simple string messages', async () => {
        const results = await generator.generatePlatforms(
          [Platform.ANDROID],
          tempDir,
        );
        const content = firstItem(results).content;

        expect(content).toContain(
          '<string name="simple_message">Hello World</string>',
        );
      });

      it('should convert string variables to %s', async () => {
        const results = await generator.generatePlatforms(
          [Platform.ANDROID],
          tempDir,
        );
        const content = firstItem(results).content;

        expect(content).toContain(
          '<string name="greeting_message">Hello, %s!</string>',
        );
      });

      it('should convert number variables to %d', async () => {
        const results = await generator.generatePlatforms(
          [Platform.ANDROID],
          tempDir,
        );
        const content = firstItem(results).content;

        expect(content).toContain(
          '<string name="count_message">%d items remaining</string>',
        );
      });

      it('should handle mixed variable types correctly', async () => {
        const results = await generator.generatePlatforms(
          [Platform.ANDROID],
          tempDir,
        );
        const content = firstItem(results).content;

        expect(content).toContain(
          '<string name="user_message_count">User %1$s has %2$d messages</string>',
        );
      });

      it('should use platform-specific keys when defined', async () => {
        const results = await generator.generatePlatforms(
          [Platform.ANDROID],
          tempDir,
        );
        const content = firstItem(results).content;

        expect(content).toContain('name="greeting_message"'); // android key
        expect(content).toContain('name="mobile_feature"'); // android key
        expect(content).toContain('name="android_specific_key"'); // android key
        expect(content).not.toContain('name="greeting"'); // original key
      });
    });

    describe('iOS platform', () => {
      it('should generate correct String Catalog format', async () => {
        const results = await generator.generatePlatforms(
          [Platform.IOS],
          tempDir,
        );
        expect(results).toHaveLength(1);
        expect(firstItem(results).platform).toBe(Platform.IOS);

        const xcstrings = JSON.parse(firstItem(results).content);
        expect(xcstrings.sourceLanguage).toBe('en');
        expect(xcstrings.version).toBe('1.0');
        expect(xcstrings.strings).toBeDefined();
      });

      it('should handle simple string messages', async () => {
        const results = await generator.generatePlatforms(
          [Platform.IOS],
          tempDir,
        );
        const xcstrings = JSON.parse(firstItem(results).content);

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

      it('should convert string variables to %@', async () => {
        const results = await generator.generatePlatforms(
          [Platform.IOS],
          tempDir,
        );
        const xcstrings = JSON.parse(firstItem(results).content);

        expect(
          xcstrings.strings.greetingMessage.localizations.en.stringUnit.value,
        ).toBe('Hello, %@!');
      });

      it('should convert number variables to %d', async () => {
        const results = await generator.generatePlatforms(
          [Platform.IOS],
          tempDir,
        );
        const xcstrings = JSON.parse(firstItem(results).content);

        expect(
          xcstrings.strings.count_message.localizations.en.stringUnit.value,
        )
          .toBe('%d items remaining');
      });

      it('should handle mixed variable types correctly', async () => {
        const results = await generator.generatePlatforms(
          [Platform.IOS],
          tempDir,
        );
        const xcstrings = JSON.parse(firstItem(results).content);

        expect(
          xcstrings.strings.userMessageCount.localizations.en.stringUnit.value,
        ).toBe('User %@ has %d messages');
      });

      it('should use platform-specific keys when defined', async () => {
        const results = await generator.generatePlatforms(
          [Platform.IOS],
          tempDir,
        );
        const xcstrings = JSON.parse(firstItem(results).content);

        expect(xcstrings.strings.greetingMessage).toBeDefined(); // ios key
        expect(xcstrings.strings.mobileFeature).toBeDefined(); // ios key
        expect(xcstrings.strings.iOSSpecificKey).toBeDefined(); // ios key
        expect(xcstrings.strings.greeting).toBeUndefined(); // original key should not exist
      });
    });

    it('should generate multiple platforms when requested', async () => {
      const results = await generator.generatePlatforms([
        Platform.WEB,
        Platform.ANDROID,
      ], tempDir);
      expect(results).toHaveLength(2);

      const platforms = results.map((r) => r.platform);
      expect(platforms).toContain(Platform.WEB);
      expect(platforms).toContain(Platform.ANDROID);
    });
  });

  describe('generateAll', () => {
    it('should write all enabled platform files', async () => {
      const results = await generator.generateAll(tempDir);
      expect(results).toHaveLength(3); // web, android, ios

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
        'values',
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
        path.join(tempDir, 'android', 'values', 'strings.xml'),
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
    it('should handle messages without variables', async () => {
      const simpleGenerator = new I18nGenerator([{
        meta: {
          locale: 'en',
          direction: 'ltr',
          generator: {
            inlang: { enabled: true, outputPath: './messages/{locale}.json' },
            android: {
              enabled: true,
              outputPath: './android/values-{locale}/strings.xml',
              resourceName: 'strings',
            },
            ios: { enabled: true, outputPath: './ios/Localizable.xcstrings' },
          },
        },
        messages: { simple: { default: 'Hello' } },
      }]);

      const webResults = await simpleGenerator.generatePlatforms(
        [Platform.WEB],
        tempDir,
      );
      const webContent = JSON.parse(firstItem(webResults).content);
      expect(webContent.simple).toBe('Hello');

      const androidResults = await simpleGenerator.generatePlatforms([
        Platform.ANDROID,
      ], tempDir);
      expect(firstItem(androidResults).content).toContain(
        '<string name="simple">Hello</string>',
      );

      const iosResults = await simpleGenerator.generatePlatforms(
        [Platform.IOS],
        tempDir,
      );
      const iosData = JSON.parse(firstItem(iosResults).content);
      expect(iosData.strings.simple.localizations.en.stringUnit.value).toBe(
        'Hello',
      );
    });

    it('should handle messages without platform-specific keys', async () => {
      const simpleGenerator = new I18nGenerator([{
        meta: {
          locale: 'en',
          direction: 'ltr',
          generator: {
            inlang: { enabled: true, outputPath: './messages/{locale}.json' },
            android: {
              enabled: true,
              outputPath: './android/values-{locale}/strings.xml',
              resourceName: 'strings',
            },
            ios: { enabled: true, outputPath: './ios/Localizable.xcstrings' },
          },
        },
        messages: {
          test: {
            default: 'Test {value}',
            variables: {
              value: {
                type: 'string',
              },
            },
          },
        },
      }]);

      // Should use original key when no platform-specific key is defined
      const androidResults = await simpleGenerator.generatePlatforms([
        Platform.ANDROID,
      ], tempDir);
      expect(firstItem(androidResults).content).toContain('name="test"');

      const iosResults = await simpleGenerator.generatePlatforms(
        [Platform.IOS],
        tempDir,
      );
      const iosData = JSON.parse(firstItem(iosResults).content);
      expect(iosData.strings.test).toBeDefined();
    });
  });

  describe('exclude functionality', () => {
    let excludeTestMetaMessages: MetaMessages;

    beforeEach(() => {
      excludeTestMetaMessages = {
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
          common_message: { default: 'Available everywhere' },
          web_only: {
            default: 'Web only message',
            exclude: [Platform.ANDROID, Platform.IOS],
          },
          android_excluded: {
            default: 'Not for Android',
            exclude: [Platform.ANDROID],
          },
          ios_excluded: {
            default: 'Not for iOS',
            exclude: [Platform.IOS],
          },
          web_excluded: {
            default: 'Not for Web',
            exclude: [Platform.WEB],
          },
        },
      };
    });

    it('should exclude messages from Android when exclude contains android', async () => {
      const generator = new I18nGenerator([excludeTestMetaMessages]);
      const results = await generator.generatePlatforms(
        [Platform.ANDROID],
        tempDir,
      );

      expect(results).toHaveLength(1);
      const content = firstItem(results).content;

      // Should include common_message and ios_excluded
      expect(content).toContain(
        '<string name="common_message">Available everywhere</string>',
      );
      expect(content).toContain(
        '<string name="ios_excluded">Not for iOS</string>',
      );

      // Should exclude web_only, android_excluded, and web_excluded
      expect(content).not.toContain('Web only message');
      expect(content).not.toContain('Not for Android');
      expect(content).toContain(
        '<string name="web_excluded">Not for Web</string>',
      );
    });

    it('should exclude messages from iOS when exclude contains ios', async () => {
      const generator = new I18nGenerator([excludeTestMetaMessages]);
      const results = await generator.generatePlatforms(
        [Platform.IOS],
        tempDir,
      );

      expect(results).toHaveLength(1);
      const iosData = JSON.parse(firstItem(results).content);

      // Should include common_message and android_excluded
      expect(iosData.strings.common_message).toBeDefined();
      expect(iosData.strings.android_excluded).toBeDefined();
      expect(iosData.strings.web_excluded).toBeDefined();

      // Should exclude web_only and ios_excluded
      expect(iosData.strings.web_only).toBeUndefined();
      expect(iosData.strings.ios_excluded).toBeUndefined();
    });

    it('should exclude messages from Web when exclude contains web', async () => {
      const generator = new I18nGenerator([excludeTestMetaMessages]);
      const results = await generator.generatePlatforms(
        [Platform.WEB],
        tempDir,
      );

      expect(results).toHaveLength(1);
      const webData = JSON.parse(firstItem(results).content);

      // Should include common_message, android_excluded, ios_excluded, and web_only
      expect(webData.common_message).toBe('Available everywhere');
      expect(webData.android_excluded).toBe('Not for Android');
      expect(webData.ios_excluded).toBe('Not for iOS');
      expect(webData.web_only).toBe('Web only message');

      // Should exclude web_excluded
      expect(webData.web_excluded).toBeUndefined();
    });

    it('should handle simple string messages (no exclude possible)', async () => {
      const simpleGenerator = new I18nGenerator([{
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
          simple_string: { default: 'Simple message' },
        },
      }]);

      const results = await simpleGenerator.generatePlatforms([
        Platform.ANDROID,
      ], tempDir);
      expect(firstItem(results).content).toContain(
        '<string name="simple_string">Simple message</string>',
      );
    });
  });

  describe('Android resource folder naming', () => {
    it('should use language-only folder for single locale per language', async () => {
      const singleLocaleGenerator = new I18nGenerator([{
        meta: {
          locale: 'es-es',
          direction: 'ltr',
          generator: {
            android: {
              enabled: true,
              outputPath: './android/values-{locale}/strings.xml',
              resourceName: 'strings',
            },
          },
        },
        messages: { test: { default: 'Prueba' } },
      }]);

      const results = await singleLocaleGenerator.generatePlatforms([
        Platform.ANDROID,
      ], tempDir);
      expect(firstItem(results).filePath).toContain('values-es');
      expect(firstItem(results).filePath).not.toContain('values-es-ES');
    });

    it('should use region-specific folders when multiple locales exist for same language', async () => {
      const multiLanguageGenerator = new I18nGenerator([
        {
          meta: {
            locale: 'es-es',
            direction: 'ltr',
            generator: {
              android: {
                enabled: true,
                outputPath: './android/values-{locale}/strings.xml',
                resourceName: 'strings',
              },
            },
          },
          messages: { test: { default: 'Prueba España' } },
        },
        {
          meta: {
            locale: 'es-mx',
            direction: 'ltr',
            generator: {
              android: {
                enabled: true,
                outputPath: './android/values-{locale}/strings.xml',
                resourceName: 'strings',
              },
            },
          },
          messages: { test: { default: 'Prueba México' } },
        },
      ]);

      const results = await multiLanguageGenerator.generatePlatforms([
        Platform.ANDROID,
      ], tempDir);
      expect(results).toHaveLength(2);

      const esEsResult = results.find((r) =>
        r.filePath.includes('values-es-ES')
      );
      const esMxResult = results.find((r) =>
        r.filePath.includes('values-es-MX')
      );

      expect(esEsResult).toBeDefined();
      expect(esMxResult).toBeDefined();
    });

    it('should handle mixed single and multiple language scenarios', async () => {
      const mixedGenerator = new I18nGenerator([
        {
          meta: {
            locale: 'en-us',
            direction: 'ltr',
            generator: {
              android: {
                enabled: true,
                outputPath: './android/values-{locale}/strings.xml',
                resourceName: 'strings',
              },
            },
          },
          messages: { test: { default: 'Test US' } },
        },
        {
          meta: {
            locale: 'en-gb',
            direction: 'ltr',
            generator: {
              android: {
                enabled: true,
                outputPath: './android/values-{locale}/strings.xml',
                resourceName: 'strings',
              },
            },
          },
          messages: { test: { default: 'Test GB' } },
        },
        {
          meta: {
            locale: 'it-it',
            direction: 'ltr',
            generator: {
              android: {
                enabled: true,
                outputPath: './android/values-{locale}/strings.xml',
                resourceName: 'strings',
              },
            },
          },
          messages: { test: { default: 'Test IT' } },
        },
      ]);

      const results = await mixedGenerator.generatePlatforms([
        Platform.ANDROID,
      ], tempDir);
      expect(results).toHaveLength(3);

      // English has multiple locales, should use region-specific
      const enUsResult = results.find((r) =>
        r.filePath.includes('values-en-US')
      );
      const enGbResult = results.find((r) =>
        r.filePath.includes('values-en-GB')
      );
      expect(enUsResult).toBeDefined();
      expect(enGbResult).toBeDefined();

      // Italian has single locale, should use language-only
      const itResult = results.find((r) => r.filePath.includes('values-it'));
      expect(itResult).toBeDefined();
      expect(results.find((r) => r.filePath.includes('values-it-IT')))
        .toBeUndefined();
    });
  });
});
