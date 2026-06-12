import { describe, expect, it } from 'vitest';
import type { BulkIntlOverlayOptions } from '../BulkIntlOverlayOptions.ts';
import { mergeOverlay } from './mergeOverlay.ts';

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

describe('util: mergeOverlay', () => {
  it('should return entries unchanged when intl is undefined', () => {
    const entries: MediaShape[] = [{ id: 1, type: 'movie', title: 'EN' }];
    expect(mergeOverlay(entries, undefined, mediaOptions)).to.deep.equal(
      entries,
    );
  });

  it('should overwrite titles only for entries that have a translation', () => {
    const entries: MediaShape[] = [
      { id: 1, type: 'movie', title: 'EN A' },
      { id: 2, type: 'movie', title: 'EN B' },
    ];

    const result = mergeOverlay(
      entries,
      {
        movie: new Map([[1, 'ES A']]),
        show: new Map(),
        episode: new Map(),
      },
      mediaOptions,
    );

    expect(result.map((r) => r.title)).to.deep.equal(['ES A', 'EN B']);
  });

  it('should apply every nested target on a single entry', () => {
    const entries: NestedShape[] = [
      { id: 10, show: { id: 20, title: 'EN show' }, title: 'EN episode' },
    ];

    const result = mergeOverlay(
      entries,
      {
        movie: new Map(),
        show: new Map([[20, 'ES show']]),
        episode: new Map([[10, 'ES episode']]),
      },
      nestedOptions,
    );

    expect(result.at(0)?.show.title).to.equal('ES show');
    expect(result.at(0)?.title).to.equal('ES episode');
  });
});
