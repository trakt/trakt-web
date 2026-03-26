import { describe, expect, it, vi } from 'vitest';
import { LetterboxdParser } from './LetterboxdParser.ts';

vi.mock('fflate', () => ({
  unzipSync: vi.fn(),
}));

vi.mock('./utils/parseCsvText.ts', () => ({
  parseCsvText: vi.fn(),
}));

const { unzipSync } = await import('fflate');
const { parseCsvText } = await import('./utils/parseCsvText.ts');
const mockUnzip = vi.mocked(unzipSync);
const mockParseCsvText = vi.mocked(parseCsvText);

function makeZipFile(name = 'export.zip'): File {
  return new File([''], name, { type: 'application/zip' });
}

function setupZip(files: Record<string, unknown[]>) {
  const encoder = new TextEncoder();
  const zipEntries: Record<string, Uint8Array> = {};

  for (const filename of Object.keys(files)) {
    zipEntries[filename] = encoder.encode('placeholder');
  }

  mockUnzip.mockReturnValue(
    zipEntries as unknown as ReturnType<typeof unzipSync>,
  );

  mockParseCsvText.mockImplementation((_text: string) => {
    const callCount = mockParseCsvText.mock.calls.length;
    const keys = Object.keys(files);
    const idx = callCount - 1;
    return Promise.resolve(files[keys[idx] ?? ''] ?? []);
  });
}

describe('LetterboxdParser', () => {
  describe('canParse', () => {
    it('accepts a single zip file', () => {
      expect(LetterboxdParser.canParse([makeZipFile()])).toBe(true);
    });

    it('rejects non-zip files', () => {
      expect(
        LetterboxdParser.canParse([new File([''], 'data.csv')]),
      ).toBe(false);
    });

    it('rejects multiple files', () => {
      expect(
        LetterboxdParser.canParse([makeZipFile(), makeZipFile()]),
      ).toBe(false);
    });
  });

  describe('parse', () => {
    it('returns empty for no files', async () => {
      const result = await LetterboxdParser.parse([]);
      expect(result).toHaveLength(0);
    });

    it('parses diary.csv as history items', async () => {
      setupZip({
        'diary.csv': [
          {
            Name: 'Inception',
            Year: '2010',
            'Watched Date': '2024-01-15',
            Rating: '4.5',
          },
        ],
      });

      const result = await LetterboxdParser.parse([makeZipFile()]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'movie',
        title: 'Inception',
        year: 2010,
        rating: 9,
      });
    });

    it('parses watched.csv for films not in diary', async () => {
      setupZip({
        'diary.csv': [],
        'watched.csv': [
          { Name: 'The Matrix', Year: '1999' },
        ],
      });

      const result = await LetterboxdParser.parse([makeZipFile()]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'movie',
        title: 'The Matrix',
        year: 1999,
      });
    });

    it('excludes watched.csv entries already in diary.csv', async () => {
      setupZip({
        'diary.csv': [
          {
            Name: 'Inception',
            Year: '2010',
            'Watched Date': '2024-01-15',
          },
        ],
        'watched.csv': [
          { Name: 'Inception', Year: '2010' },
          { Name: 'The Matrix', Year: '1999' },
        ],
      });

      const result = await LetterboxdParser.parse([makeZipFile()]);

      const historyItems = result.filter((i) => i.action === 'history');
      const titles = historyItems.map((i) => i.title);

      expect(titles).toContain('Inception');
      expect(titles).toContain('The Matrix');
      expect(historyItems.filter((i) => i.title === 'Inception')).toHaveLength(
        1,
      );
    });

    it('parses ratings.csv as rating items', async () => {
      setupZip({
        'diary.csv': [],
        'watched.csv': [],
        'ratings.csv': [
          {
            Name: 'Inception',
            Year: '2010',
            Rating: '4',
            Date: '2024-01-15',
          },
        ],
      });

      const result = await LetterboxdParser.parse([makeZipFile()]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'ratings',
        type: 'movie',
        title: 'Inception',
        year: 2010,
        rating: 8,
      });
    });

    it('parses watchlist.csv as watchlist items', async () => {
      setupZip({
        'diary.csv': [],
        'watched.csv': [],
        'ratings.csv': [],
        'watchlist.csv': [
          { Name: 'Dune', Year: '2021' },
        ],
      });

      const result = await LetterboxdParser.parse([makeZipFile()]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'watchlist',
        type: 'movie',
        title: 'Dune',
        year: 2021,
      });
    });
  });
});
