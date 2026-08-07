import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { mapToSummaryHeaderFacts } from './mapToSummaryHeaderFacts.ts';

describe('util: mapToSummaryHeaderFacts', () => {
  describe('movie: Heretic (2024)', () => {
    const facts = mapToSummaryHeaderFacts({
      type: 'movie',
      media: MovieHereticMappedMock,
    });

    it('should order facts year, runtime, certification, genre, status', () => {
      expect(facts.map((fact) => fact.key)).toEqual([
        'year',
        'length',
        'certification',
        'genre',
        'status',
      ]);
    });

    it('should carry the year as its value', () => {
      expect(facts.at(0)?.value).toBe('2024');
    });

    it('should render runtime as a human duration for films', () => {
      expect(facts.at(1)?.value).toBe('1h 51m');
    });

    it('should carry the certification verbatim', () => {
      expect(facts.at(2)?.value).toBe('R');
    });

    it('should use the primary genre only', () => {
      expect(facts.at(3)?.value).toBe('Horror');
    });
  });

  describe('show: Silo (2023)', () => {
    const facts = mapToSummaryHeaderFacts({
      type: 'show',
      media: ShowSiloMappedMock,
    });

    it('should replace runtime with an episode count for shows', () => {
      const length = facts.find((fact) => fact.key === 'length');

      expect(length?.value).toBe('15');
    });

    it('should carry a self-describing inline value for the count', () => {
      const length = facts.find((fact) => fact.key === 'length');

      expect(length?.inlineValue).toBe('15 episodes');
    });
  });

  describe('absent data', () => {
    it('should omit a fact the API does not carry, never render a dash', () => {
      const facts = mapToSummaryHeaderFacts({
        type: 'movie',
        media: {
          ...MovieHereticMappedMock,
          certification: null,
          genres: [],
        },
      });

      const keys = facts.map((fact) => fact.key);

      expect(keys).not.toContain('certification');
      expect(keys).not.toContain('genre');
      expect(keys).toEqual(['year', 'length', 'status']);
    });

    it('should omit runtime when it is zero', () => {
      const facts = mapToSummaryHeaderFacts({
        type: 'movie',
        media: { ...MovieHereticMappedMock, runtime: 0 },
      });

      expect(facts.map((fact) => fact.key)).not.toContain('length');
    });

    it('should mirror value into inlineValue when they do not differ', () => {
      const facts = mapToSummaryHeaderFacts({
        type: 'movie',
        media: MovieHereticMappedMock,
      });

      facts
        .filter((fact) => fact.key !== 'length')
        .forEach((fact) => expect(fact.inlineValue).toBe(fact.value));
    });
  });
});
