/**
 * Tests for writeFile utility function
 */

import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { writeFile } from './writeFile.ts';

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
