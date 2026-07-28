import { FilterKey } from '$lib/features/filters/models/Filter.ts';
import { describe, expect, it } from 'vitest';
import { FILTERS } from './constants.ts';

describe('FILTERS', () => {
  it('should include the streaming free availability option', () => {
    const streamingFilter = FILTERS.find((filter) =>
      filter.key === FilterKey.Streaming && filter.type === 'list'
    );

    if (streamingFilter?.type !== 'list') {
      throw new Error('Expected streaming filter to be a list filter');
    }

    expect(streamingFilter?.options.map((option) => option.value)).toContain(
      'free',
    );
  });

  it('should not allow exclusions on the streaming filter', () => {
    const streamingFilter = FILTERS.find((filter) =>
      filter.key === FilterKey.Streaming && filter.type === 'list'
    );

    if (streamingFilter?.type !== 'list') {
      throw new Error('Expected streaming filter to be a list filter');
    }

    if (streamingFilter.advanced.type !== 'multi-select') {
      throw new Error('Expected streaming filter to be a multi-select');
    }

    expect(streamingFilter.advanced.hasExclusion).toBe(false);
  });

  it('should allow exclusions on other multi-select filters', () => {
    const genreFilter = FILTERS.find((filter) =>
      filter.key === FilterKey.Genres
    );

    if (genreFilter?.type !== 'list') {
      throw new Error('Expected genre filter to be a list filter');
    }

    expect(genreFilter.advanced).not.toHaveProperty('hasExclusion', false);
  });

  it('should restrict the episode type filter to the calendar', () => {
    const episodeTypeFilter = FILTERS.find((filter) =>
      filter.key === FilterKey.EpisodeTypes
    );

    expect(episodeTypeFilter?.surfaces).toEqual(['calendar']);
  });

  it('should allow exclusions on the episode type filter', () => {
    const episodeTypeFilter = FILTERS.find((filter) =>
      filter.key === FilterKey.EpisodeTypes
    );

    if (episodeTypeFilter?.type !== 'list') {
      throw new Error('Expected episode type filter to be a list filter');
    }

    expect(episodeTypeFilter.advanced).not.toHaveProperty(
      'hasExclusion',
      false,
    );
  });

  it('should apply the episode type filter client side', () => {
    const episodeTypeFilter = FILTERS.find((filter) =>
      filter.key === FilterKey.EpisodeTypes
    );

    expect(episodeTypeFilter?.isClientSide).toBe(true);
  });

  it('should send every other filter upstream', () => {
    const upstream = FILTERS.filter((filter) => !filter.isClientSide);

    expect(upstream.map((filter) => filter.key)).not.toContain(
      FilterKey.EpisodeTypes,
    );
    expect(upstream.length).toBe(FILTERS.length - 1);
  });

  it('should keep the episode type filter out of the movies mode', () => {
    const episodeTypeFilter = FILTERS.find((filter) =>
      filter.key === FilterKey.EpisodeTypes
    );

    expect(episodeTypeFilter?.modes).not.toContain('movie');
    expect(episodeTypeFilter?.modes).toEqual(['show', 'media']);
  });

  it('should only offer episode types the calendar can filter on', () => {
    const episodeTypeFilter = FILTERS.find((filter) =>
      filter.key === FilterKey.EpisodeTypes
    );

    if (episodeTypeFilter?.type !== 'list') {
      throw new Error('Expected episode type filter to be a list filter');
    }

    if (episodeTypeFilter.advanced.type !== 'multi-select') {
      throw new Error('Expected episode type filter to be a multi-select');
    }

    const advancedValues = episodeTypeFilter.advanced.options?.map((option) =>
      option.value
    );
    const simpleValues = episodeTypeFilter.options.flatMap((option) =>
      option.value.split(',')
    );

    expect(advancedValues).toEqual([
      'series_premiere',
      'season_premiere',
      'mid_season_premiere',
      'mid_season_finale',
      'season_finale',
      'series_finale',
    ]);
    expect(simpleValues.every((value) => advancedValues?.includes(value)))
      .toBe(true);
  });
});
