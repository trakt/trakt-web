import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { multiEpisodeLabel } from './multiEpisodeLabel.ts';

const episodes = (...numbers: number[]) =>
  numbers.map((number) => ({ ...EpisodeSiloMappedMock, number }));

describe('util: multiEpisodeLabel', () => {
  it('should describe a sequential run as a range', () => {
    const label = multiEpisodeLabel(episodes(2, 3, 4), 1);

    expect(label).toBe('S1 • E2-4');
  });

  it('should append the show title to a sequential range', () => {
    const label = multiEpisodeLabel(episodes(1, 2), 1, 'Silo');

    expect(label).toBe('S1 • E1-2 of Silo');
  });

  it('should count episodes when they are not sequential', () => {
    const label = multiEpisodeLabel(episodes(1, 3, 7), 2);

    expect(label).toContain('3');
    expect(label).toContain('Season 2');
  });

  it('should prefer the show title over the season for gapped episodes', () => {
    const label = multiEpisodeLabel(episodes(1, 3), 2, 'Silo');

    expect(label).toBe('2 eps. of Silo');
  });
});
