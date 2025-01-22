import type { MediaType } from '$lib/requests/models/MediaType';
import { resolve } from '$lib/utils/store/resolve';
import { readable } from 'svelte/store';
import { describe, expect, it } from 'vitest';
import { toInMemoryPaginatable } from './toInMemoryPaginatable';

describe('toInMemoryPaginatable', () => {
  it('should paginate list correctly', async () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const type: MediaType = 'movie';
    const total = data.length;

    const mockStore = {
      list: readable(data),
    };

    const paginatable = toInMemoryPaginatable({
      useList: () => mockStore,
      type,
      total,
    });

    // Test first page
    const page1 = paginatable({ type, page: 1, limit: 3 });
    expect(await resolve(page1.list)).toEqual([1, 2, 3]);
    expect(await resolve(page1.page)).toEqual({ page: 1, total: 4 });

    // Test middle page
    const page2 = paginatable({ type, page: 2, limit: 3 });
    expect(await resolve(page2.list)).toEqual([4, 5, 6]);

    // Test last page
    const page4 = paginatable({ type, page: 4, limit: 3 });
    expect(await resolve(page4.list)).toEqual([10]);

    // Test empty page beyond total
    const page5 = paginatable({ type, page: 5, limit: 3 });
    expect(await resolve(page5.list)).toEqual([]);
  });

  it('should paginate list correctly with custom limit', async () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const type: MediaType = 'movie';
    const total = data.length;

    const store = {
      list: readable(data),
    };

    const paginatable = toInMemoryPaginatable({
      useList: () => store,
      type,
      total,
    });

    // Test first page
    const page1 = paginatable({ type, page: 1, limit: 5 });
    expect(await resolve(page1.list)).toEqual([1, 2, 3, 4, 5]);
    expect(await resolve(page1.page)).toEqual({ page: 1, total: 2 });

    // Test last page
    const page2 = paginatable({ type, page: 2, limit: 5 });
    expect(await resolve(page2.list)).toEqual([6, 7, 8, 9, 10]);
  });

  it('should paginate list correctly with custom total', async () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const type: MediaType = 'movie';
    const total = 5;

    const store = {
      list: readable(data),
    };

    const paginatable = toInMemoryPaginatable({
      useList: () => store,
      type,
      total,
    });

    // Test first page
    const page1 = paginatable({ type, page: 1, limit: 3 });
    expect(await resolve(page1.list)).toEqual([1, 2, 3]);
    expect(await resolve(page1.page)).toEqual({ page: 1, total: 2 });

    // Test last page
    const page2 = paginatable({ type, page: 2, limit: 3 });
    expect(await resolve(page2.list)).toEqual([4, 5]);
  });
});
