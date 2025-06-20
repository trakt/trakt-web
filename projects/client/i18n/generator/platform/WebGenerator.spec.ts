/**
 * Tests for WebGenerator
 */

import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { firstItem } from '../../../src/lib/utils/assert/firstItem.ts';
import type { PlatformGenerator } from '../core/I18nGenerator.ts';
import type { MetaMessages } from '../model/MetaMessages.ts';
import { Platform } from '../model/Platform.ts';
import { WebGenerator } from './WebGenerator.ts';

describe('WebGenerator', () => {
  let tempDir: string;
  let generator: PlatformGenerator;

  beforeEach(async () => {
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'i18n-test-'));
    generator = WebGenerator;
  });

  afterEach(async () => {
    if (tempDir) {
      await fs.promises.rm(tempDir, { recursive: true, force: true });
    }
  });

  it('should generate correct Inlang JSON format', async () => {
    const testMetaMessages: MetaMessages = {
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
        simple_message: 'Hello World',
        greeting: {
          default: 'Hello, {name}!',
          description: 'Greeting message with user name',
          variables: {
            name: {
              type: 'string',
              description: 'User display name',
            },
          },
        },
      },
    };

    const results = await generator.generate([testMetaMessages], tempDir);
    expect(results).toHaveLength(1);
    expect(firstItem(results).platform).toBe('web');

    const content = JSON.parse(firstItem(results).content);
    expect(content.$schema).toBe(
      'https://inlang.com/schema/inlang-message-format',
    );
    expect(content.simple_message).toBe('Hello World');
    expect(content.greeting).toBe('Hello, {name}!');
  });

  it('should exclude messages marked for web exclusion', async () => {
    const testMetaMessages: MetaMessages = {
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
        included_message: 'This should be included',
        excluded_message: {
          default: 'This should be excluded',
          exclude: ['web' as Platform],
        },
      },
    };

    const results = await generator.generate([testMetaMessages], tempDir);
    const content = JSON.parse(firstItem(results).content);

    expect(content.included_message).toBe('This should be included');
    expect(content.excluded_message).toBeUndefined();
  });

  it('should skip generation when inlang is not enabled', async () => {
    const testMetaMessages: MetaMessages = {
      meta: {
        locale: 'en',
        direction: 'ltr',
        generator: {
          inlang: {
            enabled: false,
            outputPath: './messages/{locale}.json',
          },
        },
      },
      messages: {
        test: 'Test message',
      },
    };

    const results = await generator.generate([testMetaMessages], tempDir);
    expect(results).toHaveLength(0);
  });

  it('should handle simple string messages', async () => {
    const testMetaMessages: MetaMessages = {
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
        simple: 'Simple message',
      },
    };

    const results = await generator.generate([testMetaMessages], tempDir);
    const content = JSON.parse(firstItem(results).content);
    expect(content.simple).toBe('Simple message');
  });
});
