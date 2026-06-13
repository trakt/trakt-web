import { describe, expect, it } from 'vitest';
import type { BulkIntlOverlayOptions } from '../BulkIntlOverlayOptions.ts';
import { collectIds } from './collectIds.ts';

type MediaShape = {
  id: number;
  type: 'movie' | 'show' | 'episode';
  title: string;
};

type NestedShape = {
  id: number;
  show: { id: number; title: string };
  title: string;
};

const mediaOptions: BulkIntlOverlayOptions<MediaShape> = {
  getTargets: (entry) => [{
    id: entry.id,
    type: entry.type,
    apply: (acc, title) => ({ ...acc, title }),
  }],
};

const nestedOptions: BulkIntlOverlayOptions<NestedShape> = {
  getTargets: (entry) => [
    {
      id: entry.show.id,
      type: 'show',
      apply: (acc, title) => ({ ...acc, show: { ...acc.show, title } }),
    },
    {
      id: entry.id,
      type: 'episode',
      apply: (acc, title) => ({ ...acc, title }),
    },
  ],
};

describe('util: collectIds', () => {
  it('should bucket targets by media type and sort ids', () => {
    const entries: MediaShape[] = [
      { id: 3, type: 'movie', title: 'A' },
      { id: 1, type: 'movie', title: 'B' },
      { id: 2, type: 'show', title: 'C' },
    ];

    expect(collectIds(entries, mediaOptions)).to.deep.equal({
      movieIds: [1, 3],
      showIds: [2],
      episodeIds: [],
    });
  });

  it('should dedupe repeated ids within a bucket', () => {
    const entries: MediaShape[] = [
      { id: 5, type: 'movie', title: 'A' },
      { id: 5, type: 'movie', title: 'A' },
    ];

    expect(collectIds(entries, mediaOptions).movieIds).to.deep.equal([5]);
  });

  it('should flatten nested targets across types for one entry', () => {
    const entries: NestedShape[] = [
      { id: 10, show: { id: 20, title: 'EN show' }, title: 'EN episode' },
    ];

    expect(collectIds(entries, nestedOptions)).to.deep.equal({
      movieIds: [],
      showIds: [20],
      episodeIds: [10],
    });
  });
});
