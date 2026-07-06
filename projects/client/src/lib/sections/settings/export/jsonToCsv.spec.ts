import { describe, expect, it } from 'vitest';
import { jsonToCsv } from './jsonToCsv.ts';

describe('jsonToCsv', () => {
  it('flattens nested objects into dotted columns', async () => {
    const result = await jsonToCsv([
      {
        type: 'movie',
        watched_at: '2024-01-15T12:00:00.000Z',
        movie: {
          title: 'Inception',
          year: 2010,
          ids: { trakt: 16662, imdb: 'tt1375666' },
        },
      },
    ]);

    expect(result).toBe(
      [
        'type,watched_at,movie.title,movie.year,movie.ids.trakt,movie.ids.imdb',
        'movie,2024-01-15T12:00:00.000Z,Inception,2010,16662,tt1375666',
      ].join('\r\n'),
    );
  });

  it('uses a union of columns across rows', async () => {
    const result = await jsonToCsv([
      { title: 'Inception', watched_at: '2024-01-15T12:00:00.000Z' },
      { title: 'Dune', rating: 9 },
    ]);

    expect(result).toBe(
      [
        'title,watched_at,rating',
        'Inception,2024-01-15T12:00:00.000Z,',
        'Dune,,9',
      ].join('\r\n'),
    );
  });

  it('keeps arrays as JSON cells', async () => {
    const result = await jsonToCsv({
      slug: 'me',
      genres: ['action', 'sci-fi'],
      stats: { plays: [1, 2] },
    });

    expect(result).toBe(
      [
        'slug,genres,stats.plays',
        'me,"[""action"",""sci-fi""]","[1,2]"',
      ].join('\r\n'),
    );
  });

  it('returns an empty CSV for empty arrays and objects', async () => {
    await expect(jsonToCsv([])).resolves.toBe('');
    await expect(jsonToCsv({})).resolves.toBe('');
  });

  it('escapes formula-like values for Excel', async () => {
    const result = await jsonToCsv([{
      title: '=IMPORTXML("https://example.com")',
    }]);

    expect(result).toBe('title\r\n"\'=IMPORTXML(""https://example.com"")"');
  });
});
