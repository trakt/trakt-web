import type { MediaTrivia } from '$lib/requests/models/MediaTrivia.ts';
import { describe, expect, it } from 'vitest';
import { toTriviaGroups } from './toTriviaGroups.ts';

const fact = (key: string, category: MediaTrivia['category']): MediaTrivia => ({
  key,
  text: `Fact ${key}`,
  category,
});

describe('util: toTriviaGroups', () => {
  it('should name each category once, in the order its first fact appears', () => {
    const groups = toTriviaGroups([
      fact('a', 'cast_n_crew'),
      fact('b', 'bts'),
      fact('c', 'cast_n_crew'),
      fact('d', 'story_n_themes'),
      fact('e', 'bts'),
    ]);

    expect(groups.map(({ category }) => category)).toEqual([
      'cast_n_crew',
      'bts',
      'story_n_themes',
    ]);
  });

  it('should keep the facts in list order inside their group', () => {
    const [castAndCrew] = toTriviaGroups([
      fact('a', 'cast_n_crew'),
      fact('b', 'bts'),
      fact('c', 'cast_n_crew'),
    ]);

    expect(castAndCrew?.facts.map(({ key }) => key)).toEqual(['a', 'c']);
  });

  it('should return no groups for no facts', () => {
    expect(toTriviaGroups([])).toEqual([]);
  });
});
