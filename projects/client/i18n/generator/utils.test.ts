/**
 * Tests for i18n utility functions
 */

import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  convertToAndroidFormat,
  convertToIOSFormat,
  escapeIOS,
  escapeXml,
  writeFile,
} from './utils.ts';

describe('convertToAndroidFormat', () => {
  it('should convert simple string variables to %s', () => {
    expect(convertToAndroidFormat('Hello {name}!')).toBe('Hello %s!');
    expect(convertToAndroidFormat('Welcome {user} to {app}')).toBe(
      'Welcome %s to %s',
    );
  });

  it('should convert number variables to %d using variables metadata', () => {
    const variables = { count: { type: 'number' } };
    expect(convertToAndroidFormat('You have {count} messages', variables)).toBe(
      'You have %d messages',
    );

    const variables2 = { total: { type: 'number' } };
    expect(convertToAndroidFormat('{total} items selected', variables2)).toBe(
      '%d items selected',
    );
  });

  it('should handle mixed variable types using variables metadata', () => {
    const variables = {
      name: { type: 'string' },
      count: { type: 'number' },
    };
    const input = 'User {name} has {count} items';
    const expected = 'User %s has %d items';
    expect(convertToAndroidFormat(input, variables)).toBe(expected);
  });

  it('should handle text without variables', () => {
    expect(convertToAndroidFormat('Simple text')).toBe('Simple text');
    expect(convertToAndroidFormat('')).toBe('');
  });

  it('should default to string format when no variables metadata is provided', () => {
    expect(convertToAndroidFormat('Hello {name}')).toBe('Hello %s');
    expect(convertToAndroidFormat('You have {count} items')).toBe(
      'You have %s items',
    );
  });
});

describe('convertToIOSFormat', () => {
  it('should convert simple string variables to %@', () => {
    expect(convertToIOSFormat('Hello {name}!')).toBe('Hello %@!');
    expect(convertToIOSFormat('Welcome {user} to {app}')).toBe(
      'Welcome %@ to %@',
    );
  });

  it('should convert number variables to %d using variables metadata', () => {
    const variables = { count: { type: 'number' } };
    expect(convertToIOSFormat('You have {count} messages', variables)).toBe(
      'You have %d messages',
    );

    const variables2 = { total: { type: 'number' } };
    expect(convertToIOSFormat('{total} items selected', variables2)).toBe(
      '%d items selected',
    );
  });

  it('should handle mixed variable types using variables metadata', () => {
    const variables = {
      name: { type: 'string' },
      count: { type: 'number' },
    };
    const input = 'User {name} has {count} items';
    const expected = 'User %@ has %d items';
    expect(convertToIOSFormat(input, variables)).toBe(expected);
  });

  it('should handle text without variables', () => {
    expect(convertToIOSFormat('Simple text')).toBe('Simple text');
    expect(convertToIOSFormat('')).toBe('');
  });

  it('should default to string format when no variables metadata is provided', () => {
    expect(convertToIOSFormat('Hello {name}')).toBe('Hello %@');
    expect(convertToIOSFormat('You have {count} items')).toBe(
      'You have %@ items',
    );
  });
});

describe('escapeXml', () => {
  it('should escape basic XML characters', () => {
    expect(escapeXml('&')).toBe('&amp;');
    expect(escapeXml('<')).toBe('&lt;');
    expect(escapeXml('>')).toBe('&gt;');
    expect(escapeXml('"')).toBe('&quot;');
    expect(escapeXml("'")).toBe('&apos;');
  });

  it('should escape multiple characters in sequence', () => {
    expect(escapeXml('&lt;tag&gt;')).toBe('&amp;lt;tag&amp;gt;');
    expect(escapeXml('<tag attr="value">')).toBe(
      '&lt;tag attr=&quot;value&quot;&gt;',
    );
  });

  it('should handle complex text with mixed special characters', () => {
    const input = `Text with "quotes" & <tags> and 'apostrophes'`;
    const expected =
      `Text with &quot;quotes&quot; &amp; &lt;tags&gt; and &apos;apostrophes&apos;`;
    expect(escapeXml(input)).toBe(expected);
  });

  it('should handle empty and simple strings', () => {
    expect(escapeXml('')).toBe('');
    expect(escapeXml('Simple text')).toBe('Simple text');
    expect(escapeXml('Text without special chars')).toBe(
      'Text without special chars',
    );
  });

  it('should maintain order of replacement for edge cases', () => {
    // Test that & is replaced first (important for proper escaping)
    expect(escapeXml('&lt;')).toBe('&amp;lt;');
    expect(escapeXml('&amp;')).toBe('&amp;amp;');
  });
});

describe('escapeIOS', () => {
  it('should escape backslashes', () => {
    expect(escapeIOS('\\')).toBe('\\\\');
    expect(escapeIOS('path\\to\\file')).toBe('path\\\\to\\\\file');
  });

  it('should escape double quotes', () => {
    expect(escapeIOS('"')).toBe('\\"');
    expect(escapeIOS('Say "hello"')).toBe('Say \\"hello\\"');
  });

  it('should escape newlines', () => {
    expect(escapeIOS('\n')).toBe('\\n');
    expect(escapeIOS('Line 1\nLine 2')).toBe('Line 1\\nLine 2');
  });

  it('should escape tabs', () => {
    expect(escapeIOS('\t')).toBe('\\t');
    expect(escapeIOS('Column 1\tColumn 2')).toBe('Column 1\\tColumn 2');
  });

  it('should handle multiple escape sequences', () => {
    const input = 'Text with "quotes" and \n newlines \t tabs \\ backslashes';
    const expected =
      'Text with \\"quotes\\" and \\n newlines \\t tabs \\\\ backslashes';
    expect(escapeIOS(input)).toBe(expected);
  });

  it('should handle empty and simple strings', () => {
    expect(escapeIOS('')).toBe('');
    expect(escapeIOS('Simple text')).toBe('Simple text');
    expect(escapeIOS('Text without special chars')).toBe(
      'Text without special chars',
    );
  });

  it('should maintain order of replacement for edge cases', () => {
    // Test that backslashes are escaped first (important for proper escaping)
    expect(escapeIOS('\\n')).toBe('\\\\n');
    expect(escapeIOS('\\\\')).toBe('\\\\\\\\');
  });
});

describe('writeFile', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'i18n-test-'));
  });

  afterEach(async () => {
    await fs.promises.rm(tempDir, { recursive: true, force: true });
  });

  it('should write file to existing directory', async () => {
    const filePath = path.join(tempDir, 'test.txt');
    const content = 'Hello, World!';

    await writeFile(filePath, content);

    const writtenContent = await fs.promises.readFile(filePath, 'utf-8');
    expect(writtenContent).toBe(content);
  });

  it('should create directories recursively', async () => {
    const filePath = path.join(
      tempDir,
      'nested',
      'deep',
      'directory',
      'test.txt',
    );
    const content = 'Test content';

    await writeFile(filePath, content);

    const writtenContent = await fs.promises.readFile(filePath, 'utf-8');
    expect(writtenContent).toBe(content);

    // Verify directories were created
    const stats = await fs.promises.stat(path.dirname(filePath));
    expect(stats.isDirectory()).toBe(true);
  });

  it('should handle empty content', async () => {
    const filePath = path.join(tempDir, 'empty.txt');
    const content = '';

    await writeFile(filePath, content);

    const writtenContent = await fs.promises.readFile(filePath, 'utf-8');
    expect(writtenContent).toBe('');
  });

  it('should overwrite existing files', async () => {
    const filePath = path.join(tempDir, 'overwrite.txt');

    await writeFile(filePath, 'Original content');
    await writeFile(filePath, 'New content');

    const writtenContent = await fs.promises.readFile(filePath, 'utf-8');
    expect(writtenContent).toBe('New content');
  });

  it('should handle UTF-8 content correctly', async () => {
    const filePath = path.join(tempDir, 'utf8.txt');
    const content = 'Unicode: 🎉 中文 العربية';

    await writeFile(filePath, content);

    const writtenContent = await fs.promises.readFile(filePath, 'utf-8');
    expect(writtenContent).toBe(content);
  });
});
