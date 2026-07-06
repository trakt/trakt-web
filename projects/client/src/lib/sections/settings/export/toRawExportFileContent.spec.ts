import { describe, expect, it } from 'vitest';
import { toRawExportFileContent } from './toRawExportFileContent.ts';

describe('toRawExportFileContent', () => {
  it('returns an empty CSV file for empty arrays and objects', async () => {
    await expect(toRawExportFileContent([], 'csv')).resolves.toBe('');
    await expect(toRawExportFileContent({}, 'csv')).resolves.toBe('');
  });

  it('adds a byte order mark to non-empty CSV files', async () => {
    const result = await toRawExportFileContent(
      [{ title: 'Inception' }],
      'csv',
    );

    expect(result).toBe('\uFEFFtitle\r\nInception');
  });

  it('keeps JSON exports unchanged', async () => {
    const result = await toRawExportFileContent([], 'json');

    expect(result).toBe('[]');
  });
});
