import { runQuery } from '$test/beds/query/runQuery.ts';
import { tap } from 'rxjs';
import { afterEach, describe, expect, it } from 'vitest';
import { useListSorting } from './useListSorting.ts';

describe('store: useListSorting', () => {
  afterEach(() => {
    history.replaceState(null, '', '/');
  });

  describe('watchlist', () => {
    const props = { type: 'watchlist', intent: 'default' } as const;

    it('should derive the sorting from the URL', async () => {
      history.replaceState(null, '', '/?sort_by=added&sort_how=asc');

      const { sorting, sortHow } = await runQuery({
        factory: () => useListSorting(props).current,
      });

      expect(sorting.value).toBe('added');
      expect(sortHow).toBe('asc');
    });

    it('should derive the defaults when the URL has no sort params', async () => {
      const { sorting, sortHow } = await runQuery({
        factory: () => useListSorting(props).current,
      });

      expect(sorting.value).toBe(undefined);
      expect(sortHow).toBe('desc');
    });

    it('should not emit a fallback sort before the URL sort', async () => {
      history.replaceState(null, '', '/?sort_by=added&sort_how=asc');

      const emissions: string[] = [];
      await runQuery({
        factory: () =>
          useListSorting(props).current.pipe(
            tap(({ sorting, sortHow }) =>
              emissions.push(`${sorting.value}-${sortHow}`)
            ),
          ),
      });
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(emissions).toEqual(['added-asc']);
    });
  });

  describe('favorites', () => {
    const props = { type: 'favorites', slug: 'sefer' } as const;

    it('should derive the defaults when the URL has no sort params', async () => {
      const { sorting, sortHow } = await runQuery({
        factory: () => useListSorting(props).current,
      });

      expect(sorting.value).toBe('added');
      expect(sortHow).toBe('desc');
    });
  });
});
