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
});
