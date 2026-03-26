import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TvTimeNativeParser } from './TvTimeNativeParser.ts';
import { parseCsvFile } from './utils/parseCsvFile.ts';

vi.mock('./utils/parseCsvFile.ts', () => ({ parseCsvFile: vi.fn() }));

const mockParseCsvFile = vi.mocked(parseCsvFile);

const dummyFile = new File([''], 'tvtime.csv', { type: 'text/csv' });

beforeEach(() => {
  mockParseCsvFile.mockResolvedValue([]);
});

describe('TvTimeNativeParser', () => {
  describe('canParse', () => {
    it('accepts a single csv file', () => {
      expect(TvTimeNativeParser.canParse([dummyFile])).toBe(true);
    });

    it('rejects multiple files', () => {
      expect(TvTimeNativeParser.canParse([dummyFile, dummyFile])).toBe(false);
    });

    it('rejects non-csv files', () => {
      expect(
        TvTimeNativeParser.canParse([new File([''], 'data.json')]),
      ).toBe(false);
    });
  });

  describe('parse', () => {
    it('adds an episode to history', async () => {
      const ts = String(
        Math.floor(new Date('2023-06-01T12:00:00Z').getTime() / 1000),
      );
      mockParseCsvFile.mockResolvedValue([{
        ts,
        show_name: 'Breaking Bad',
        episode_id: '81189',
        episode_season_number: '3',
        episode_number: '7',
        episode_name: 'One Minute',
      }]);

      const result = await TvTimeNativeParser.parse([dummyFile]);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        action: 'history',
        type: 'episode',
        ids: { tvdb: 81189 },
        title: 'Breaking Bad',
        season: 3,
        episode: 7,
      });
    });

    it('skips rows without episode_id', async () => {
      mockParseCsvFile.mockResolvedValue([{
        ts: '1000000',
        show_name: 'Breaking Bad',
        episode_id: '',
      }]);

      const result = await TvTimeNativeParser.parse([dummyFile]);

      expect(result).toHaveLength(0);
    });

    it('skips rows with non-numeric episode_id', async () => {
      mockParseCsvFile.mockResolvedValue([{
        episode_id: 'abc',
        show_name: 'Breaking Bad',
      }]);

      const result = await TvTimeNativeParser.parse([dummyFile]);

      expect(result).toHaveLength(0);
    });

    it('returns empty array for empty file', async () => {
      mockParseCsvFile.mockResolvedValue([]);
      const result = await TvTimeNativeParser.parse([dummyFile]);
      expect(result).toHaveLength(0);
    });

    it('returns empty array when no files provided', async () => {
      const result = await TvTimeNativeParser.parse([]);
      expect(result).toHaveLength(0);
    });
  });
});
