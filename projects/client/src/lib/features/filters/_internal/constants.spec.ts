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
});
