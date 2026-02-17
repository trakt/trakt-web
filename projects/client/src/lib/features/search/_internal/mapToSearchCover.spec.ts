import { describe, expect, it } from 'vitest';
import type { SearchResponse } from '../models/SearchResponse.ts';
import { mapToSearchCover } from './mapToSearchCover.ts';

describe('mapToSearchCover', () => {
  const coverUrl = (type: string) => `https://example.com/${type}-cover.jpg`;

  it('returns undefined if there is no response', () => {
    const result = mapToSearchCover(null);
    expect(result).toBeUndefined();
  });

  it('maps media response cover correctly', () => {
    const mockResponse = {
      type: 'media',
      items: [
        { cover: { url: { medium: coverUrl('media') } } },
      ],
    } as unknown as SearchResponse;

    const result = mapToSearchCover(mockResponse);
    expect(result).toBe(coverUrl('media'));
  });

  it('maps people response headshot correctly', () => {
    const mockResponse = {
      type: 'people',
      items: [
        { headshot: { url: { medium: coverUrl('people') } } },
      ],
    } as unknown as SearchResponse;

    const result = mapToSearchCover(mockResponse);
    expect(result).toBe(coverUrl('people'));
  });

  it('maps lists response poster correctly', () => {
    const mockResponse = {
      type: 'lists',
      items: [
        { posters: [{ url: { medium: coverUrl('lists') } }] },
      ],
    } as unknown as SearchResponse;

    const result = mapToSearchCover(mockResponse);
    expect(result).toBe(coverUrl('lists'));
  });
});
