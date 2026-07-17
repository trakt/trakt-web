import type { PersonResponse } from '@trakt/api';
import { describe, expect, it } from 'vitest';
import { mapToYirPeople } from './mapToYirPerson.ts';

type RawYirPersonTitle = {
  title: string;
  type: 'show' | 'movie';
  trakt_id: number;
  episode_count?: number;
  year?: number | null;
};

function rawPerson(
  titles: RawYirPersonTitle[],
): Parameters<typeof mapToYirPeople>[0][number] {
  return {
    person: {
      name: 'Cillian Murphy',
      ids: { trakt: 1, slug: 'cillian-murphy' },
      images: {},
    } as unknown as PersonResponse,
    count: { movies: 1, shows: 1 },
    titles,
  };
}

describe('mapToYirPeople', () => {
  describe('title keys', () => {
    it('should keep a movie and a show that share the same trakt id', () => {
      const [person] = mapToYirPeople([
        rawPerson([
          { title: 'Oppenheimer', type: 'movie', trakt_id: 42 },
          { title: 'Peaky Blinders', type: 'show', trakt_id: 42 },
        ]),
      ]);

      const keys = person?.titles.map((t) => t.key);
      expect(keys).toEqual(['movie-42', 'show-42']);
    });

    it('should drop a duplicate title with the same type and trakt id', () => {
      const [person] = mapToYirPeople([
        rawPerson([
          { title: 'Oppenheimer', type: 'movie', trakt_id: 42 },
          { title: 'Oppenheimer', type: 'movie', trakt_id: 42 },
        ]),
      ]);

      expect(person?.titles).toHaveLength(1);
      expect(person?.titles.at(0)?.title).toBe('Oppenheimer');
    });
  });
});
