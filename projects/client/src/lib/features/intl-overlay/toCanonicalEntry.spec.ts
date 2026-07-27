import { describe, expect, it } from 'vitest';
import type { BulkIntlOverlayOptions } from './BulkIntlOverlayOptions.ts';
import { mergeOverlay } from './_internal/mergeOverlay.ts';
import { toCanonicalEntry } from './toCanonicalEntry.ts';

type MediaShape = {
  id: number;
  type: 'movie';
  title: string;
};

const options: BulkIntlOverlayOptions<MediaShape> = {
  getTargets: (entry) => [{
    id: entry.id,
    type: entry.type,
    apply: (acc, title) => ({ ...acc, title }),
  }],
};

function overlay(entries: MediaShape[], translations: Array<[number, string]>) {
  return mergeOverlay(entries, {
    movie: new Map(translations),
    show: new Map(),
    episode: new Map(),
  }, options);
}

describe('util: toCanonicalEntry', () => {
  it('should return the untranslated entry for an overlaid one', () => {
    const entry: MediaShape = { id: 1, type: 'movie', title: 'The Matrix' };
    const overlaid = overlay([entry], [[1, 'Matrix']]).at(0);

    expect(toCanonicalEntry(overlaid)?.title).to.equal('The Matrix');
  });

  it('should return the entry itself when no overlay was applied', () => {
    const entry: MediaShape = { id: 1, type: 'movie', title: 'The Matrix' };
    const untouched = overlay([entry], []).at(0);

    expect(toCanonicalEntry(untouched)).to.equal(entry);
  });

  it('should return the entry itself when it never went through an overlay', () => {
    const entry: MediaShape = { id: 1, type: 'movie', title: 'The Matrix' };

    expect(toCanonicalEntry(entry)).to.equal(entry);
  });

  it('should handle nullish input', () => {
    expect(toCanonicalEntry(undefined)).to.equal(undefined);
    expect(toCanonicalEntry(null)).to.equal(null);
  });
});
