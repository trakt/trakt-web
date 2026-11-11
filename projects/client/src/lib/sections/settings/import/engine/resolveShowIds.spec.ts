import { describe, expect, it, vi } from 'vitest';
import type { UniversalImportItem } from '../ImportTypes.ts';
import type {
  ShowMatchCandidate,
  ShowMatchQuery,
  ShowMatchResult,
} from './matchShows.ts';
import { resolveShowIds } from './resolveShowIds.ts';

function episode(
  overrides: Partial<UniversalImportItem> = {},
): UniversalImportItem {
  return {
    action: 'history',
    type: 'episode',
    ids: {},
    title: 'Made Up Show',
    season: 1,
    episode: 1,
    watched_at: '2020-02-08T17:21:29.000Z',
    ...overrides,
  };
}

function candidate(
  overrides: Partial<ShowMatchCandidate> = {},
): ShowMatchCandidate {
  return { title: 'Made Up Show', year: 2010, tvdb: 111, ...overrides };
}

function matcher(byTitle: Record<string, ShowMatchCandidate[]>) {
  return vi.fn(
    (queries: ReadonlyArray<ShowMatchQuery>): Promise<ShowMatchResult[]> =>
      Promise.resolve(
        queries.map(({ index, title }) => ({
          index,
          candidates: byTitle[title] ?? [],
        })),
      ),
  );
}

describe('engine: resolveShowIds', () => {
  it('should set the show id on episodes of a matched show', async () => {
    const match = matcher({
      'Made Up Show': [candidate({ imdb: 'tt0000001' })],
    });

    const { items, unresolved } = await resolveShowIds({
      items: [episode(), episode({ season: 2, episode: 3 })],
      match,
    });

    expect(items[0]).toMatchObject({ showTvdb: 111, showImdb: 'tt0000001' });
    expect(items[1]).toMatchObject({
      showTvdb: 111,
      season: 2,
      episode: 3,
    });
    expect(unresolved).toHaveLength(0);
  });

  it('should look up each distinct show title once', async () => {
    const match = matcher({
      'Made Up Show': [candidate()],
      'Another Show': [candidate({ title: 'Another Show', tvdb: 222 })],
    });

    const { items } = await resolveShowIds({
      items: [
        episode(),
        episode({ episode: 2 }),
        episode({ title: 'Another Show' }),
        episode({ title: 'made up show', episode: 3 }),
      ],
      match,
    });

    expect(match).toHaveBeenCalledTimes(1);
    expect(match).toHaveBeenCalledWith([
      { index: 0, title: 'Made Up Show', year: undefined },
      { index: 1, title: 'Another Show', year: undefined },
    ]);
    expect(items.map((item) => item.showTvdb)).toEqual([111, 111, 222, 111]);
  });

  it('should match titles regardless of case, accents and punctuation', async () => {
    const match = matcher({
      'Made Up Show': [candidate({ title: 'Máde up: Show!' })],
    });

    const { items } = await resolveShowIds({ items: [episode()], match });

    expect(items[0]?.showTvdb).toBe(111);
  });

  it('should leave episodes unresolved when several shows share the title', async () => {
    const match = matcher({
      'Made Up Show': [candidate({ year: 1990 }), candidate({ tvdb: 222 })],
    });

    const { items, unresolved } = await resolveShowIds({
      items: [episode()],
      match,
    });

    expect(items[0]?.showTvdb).toBeUndefined();
    expect(unresolved).toHaveLength(1);
  });

  it('should use the year to pick between shows sharing the title', async () => {
    const match = matcher({
      'Made Up Show': [candidate({ year: 1990 }), candidate({ tvdb: 222 })],
    });

    const { items } = await resolveShowIds({
      items: [episode({ year: 2010 })],
      match,
    });

    expect(items[0]?.showTvdb).toBe(222);
  });

  it('should leave episodes unresolved when the year does not match', async () => {
    const match = matcher({ 'Made Up Show': [candidate({ year: 1990 })] });

    const { unresolved } = await resolveShowIds({
      items: [episode({ year: 2010 })],
      match,
    });

    expect(unresolved).toHaveLength(1);
  });

  it('should leave episodes unresolved when the title is not exact', async () => {
    const match = matcher({
      'Made Up Show': [candidate({ title: 'Made Up Show Reloaded' })],
    });

    const { unresolved } = await resolveShowIds({
      items: [episode()],
      match,
    });

    expect(unresolved).toHaveLength(1);
  });

  it('should leave episodes unresolved when nothing is found', async () => {
    const { unresolved } = await resolveShowIds({
      items: [episode()],
      match: matcher({}),
    });

    expect(unresolved).toHaveLength(1);
  });

  it('should leave episodes unresolved when the match call fails', async () => {
    const match = vi.fn().mockRejectedValue(new Error('rate limited'));

    const { unresolved } = await resolveShowIds({
      items: [episode()],
      match,
    });

    expect(unresolved).toHaveLength(1);
  });

  it('should leave episodes unresolved when the show has no usable id', async () => {
    const match = matcher({
      'Made Up Show': [candidate({ tvdb: undefined })],
    });

    const { unresolved } = await resolveShowIds({
      items: [episode()],
      match,
    });

    expect(unresolved).toHaveLength(1);
  });

  it('should not look up episodes that already carry a show or episode id', async () => {
    const match = matcher({});

    await resolveShowIds({
      items: [
        episode({ showTvdb: 5 }),
        episode({ showImdb: 'tt0000002' }),
        episode({ ids: { tvdb: 9 } }),
      ],
      match,
    });

    expect(match).not.toHaveBeenCalled();
  });

  it('should not look up movies or shows', async () => {
    const match = matcher({});

    await resolveShowIds({
      items: [episode({ type: 'movie' }), episode({ type: 'show' })],
      match,
    });

    expect(match).not.toHaveBeenCalled();
  });

  it('should look up at most five shows at a time', async () => {
    const titles = Array.from({ length: 12 }, (_, i) => `Show ${i}`);
    const match = matcher({});

    await resolveShowIds({
      items: titles.map((title) => episode({ title })),
      match,
    });

    expect(match.mock.calls.map(([batch]) => batch.length)).toEqual([5, 5, 2]);
  });

  it('should report progress per batch resolved', async () => {
    const onProgress = vi.fn();

    await resolveShowIds({
      items: [episode()],
      match: matcher({}),
      onProgress,
    });

    expect(onProgress).toHaveBeenNthCalledWith(1, 0, 1);
    expect(onProgress).toHaveBeenNthCalledWith(2, 1, 1);
  });

  it('should stop looking up shows once aborted', async () => {
    const controller = new AbortController();
    controller.abort();
    const match = matcher({});

    await resolveShowIds({
      items: [episode()],
      match,
      signal: controller.signal,
    });

    expect(match).not.toHaveBeenCalled();
  });
});
