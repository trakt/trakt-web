import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { renderStore } from '$test/beds/store/renderStore.ts';
import { describe, expect, it } from 'vitest';
import type { LastWatchedItem } from './models/LastWatchedItem.ts';
import { useDismissals } from './useDismissals.ts';
import { useLastWatched } from './useLastWatched.ts';

const HERETIC: LastWatchedItem = {
  type: 'movie',
  media: MovieHereticMappedMock,
};

const isDismissed = async (item: LastWatchedItem) => {
  const items = await runQuery({
    factory: () => useDismissals().dismissals,
  });

  return items.some(
    (dismissed) =>
      dismissed.type === item.type && dismissed.id === item.media.id.toString(),
  );
};

describe('store: useLastWatched', () => {
  it('should dismiss the item the prompt shows', async () => {
    const { lastWatched, dismiss } = await renderStore(() => useLastWatched());

    lastWatched.next(HERETIC);
    dismiss(HERETIC.media.id, HERETIC.type);

    expect(await isDismissed(HERETIC)).toBe(true);
  });

  it('should leave the prompt to its source after a dismissal', async () => {
    const { lastWatched, dismiss } = await renderStore(() => useLastWatched());

    lastWatched.next(HERETIC);
    dismiss(HERETIC.media.id, HERETIC.type);

    expect(lastWatched.value).toEqual(HERETIC);
  });

  it('should ignore items the prompt does not show', async () => {
    const { lastWatched, dismiss } = await renderStore(() => useLastWatched());

    lastWatched.next(HERETIC);
    dismiss(ShowSiloMappedMock.id, 'show');

    expect(await isDismissed({ type: 'show', media: ShowSiloMappedMock })).toBe(
      false,
    );
  });
});
