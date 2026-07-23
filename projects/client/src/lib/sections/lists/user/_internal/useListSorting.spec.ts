import { firstValueFrom } from 'rxjs';
import { afterEach, describe, expect, it } from 'vitest';
import { useListSorting } from './useListSorting.ts';

describe('useListSorting', () => {
  afterEach(() => {
    history.replaceState(null, '', '/');
  });

  it('should seed the sorting from the URL', async () => {
    history.replaceState(null, '', '/?sort_by=added&sort_how=asc');

    const { current } = useListSorting({
      type: 'watchlist',
      intent: 'default',
    });

    const { sorting, sortHow } = await firstValueFrom(current);

    expect(sorting.value).toBe('added');
    expect(sortHow).toBe('asc');
  });
});
