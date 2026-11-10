import type { CrewMember, MediaCrew } from '$lib/requests/models/MediaCrew.ts';
import { describe, expect, it } from 'vitest';
import { mapToMainCredit } from './mapToMainCredit.ts';

const person = (name: string, jobs: string[] = []): CrewMember => ({
  name,
  key: `person-${name.toLowerCase()}`,
  jobs,
});

const crew = (overrides: Partial<MediaCrew>): MediaCrew => ({
  directors: [],
  writers: [],
  creators: [],
  cast: [],
  guestStars: [],
  ...overrides,
});

describe('util: mapToMainCredit', () => {
  describe('for shows', () => {
    it('should credit the first creator and keep one other', () => {
      const result = mapToMainCredit(
        'show',
        crew({
          creators: [person('Ann'), person('Bob'), person('Cid')],
        }),
      );

      expect(result?.text).toContain('Ann');
      expect(result?.key).toBe('person-ann');
      expect(result?.positions).toEqual({ shows: 'created by' });
      expect(result?.others).toEqual([{ name: 'Bob', key: 'person-bob' }]);
    });

    it('should leave out others for a sole creator', () => {
      const result = mapToMainCredit(
        'show',
        crew({ creators: [person('Ann')] }),
      );

      expect(result?.others).toBeUndefined();
    });

    it('should be empty without creators', () => {
      expect(mapToMainCredit('show', crew({}))).toBeNull();
    });

    it('should ignore directors', () => {
      const result = mapToMainCredit(
        'show',
        crew({ directors: [person('Dan', ['Director'])] }),
      );

      expect(result).toBeNull();
    });
  });

  describe('for movies and episodes', () => {
    it('should credit the first person whose job is director', () => {
      const result = mapToMainCredit(
        'movie',
        crew({
          directors: [
            person('Producer', ['Producer']),
            person('Dan', ['Director']),
            person('Eve', ['director']),
          ],
        }),
      );

      expect(result?.text).toContain('Dan');
      expect(result?.positions).toEqual({ movies: 'directing' });
      expect(result?.others).toEqual([{ name: 'Eve', key: 'person-eve' }]);
    });

    it('should use the show position for episodes', () => {
      const result = mapToMainCredit(
        'episode',
        crew({ directors: [person('Dan', ['Director'])] }),
      );

      expect(result?.positions).toEqual({ shows: 'directing' });
      expect(result?.others).toBeUndefined();
    });

    it('should be empty when nobody has the director job', () => {
      const result = mapToMainCredit(
        'movie',
        crew({ directors: [person('Pat', ['Producer'])] }),
      );

      expect(result).toBeNull();
    });
  });
});
