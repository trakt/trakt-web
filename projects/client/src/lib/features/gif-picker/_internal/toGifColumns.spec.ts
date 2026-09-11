import type { GifEntry } from '$lib/requests/models/GifEntry.ts';
import { describe, expect, it } from 'vitest';
import { toGifColumns } from './toGifColumns.ts';

function gif(id: string, width: number, height: number): GifEntry {
  return {
    id,
    slug: id,
    title: id,
    preview: { url: `https://static.klipy.com/${id}.webp`, width, height },
    url: `https://static.klipy.com/${id}.gif`,
  };
}

const ids = (columns: GifEntry[][]) =>
  columns.map((column) => column.map((entry) => entry.id));

describe('util: toGifColumns', () => {
  it('should spread square gifs round robin', () => {
    const columns = toGifColumns(
      ['a', 'b', 'c', 'd', 'e'].map((id) => gif(id, 100, 100)),
      2,
    );

    expect(ids(columns)).to.deep.equal([['a', 'c', 'e'], ['b', 'd']]);
  });

  it('should always append to the shortest column', () => {
    const columns = toGifColumns([
      gif('tall', 100, 300),
      gif('short', 100, 50),
      gif('next', 100, 50),
    ], 2);

    // `tall` is three times the height of `short`, so the second column keeps
    // taking gifs until it catches up.
    expect(ids(columns)).to.deep.equal([['tall'], ['short', 'next']]);
  });

  it('should return no columns when asked for none', () => {
    expect(toGifColumns([gif('a', 100, 100)], 0)).to.deep.equal([]);
  });

  it('should return empty columns for no gifs', () => {
    expect(toGifColumns([], 3)).to.deep.equal([[], [], []]);
  });
});
