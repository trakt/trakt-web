import { BehaviorSubject } from 'rxjs';
import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';
import { useInMemoryPagination } from './useInMemoryPagination.ts';

describe('useInMemoryPagination', () => {
  it('should return first page of items', () => {
    const items$ = new BehaviorSubject([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const { list, hasNextPage, fetchNextPage } = useInMemoryPagination(items$, {
      page: 1,
      limit: 3,
    });

    let currentList: number[] = [];
    let currentHasNextPage = false;

    list.subscribe((value) => {
      currentList = value;
    });
    hasNextPage.subscribe((value) => {
      currentHasNextPage = value;
    });

    expect(currentList).toEqual([1, 2, 3]);
    expect(currentHasNextPage).toBe(true);
    expect(get(fetchNextPage)).toBeTypeOf('function');
  });

  it('should load next page when fetchNextPage is called', () => {
    const items$ = new BehaviorSubject([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const { list, hasNextPage, fetchNextPage } = useInMemoryPagination(items$, {
      page: 1,
      limit: 3,
    });

    let currentList: number[] = [];
    let currentHasNextPage = false;

    list.subscribe((value) => {
      currentList = value;
    });
    hasNextPage.subscribe((value) => {
      currentHasNextPage = value;
    });

    expect(currentList).toEqual([1, 2, 3]);
    expect(currentHasNextPage).toBe(true);

    get(fetchNextPage)();

    expect(currentList).toEqual([1, 2, 3, 4, 5, 6]);
    expect(currentHasNextPage).toBe(true);
  });

  it('should load multiple pages cumulatively', () => {
    const items$ = new BehaviorSubject([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const { list, fetchNextPage } = useInMemoryPagination(items$, {
      page: 1,
      limit: 3,
    });

    let currentList: number[] = [];
    list.subscribe((value) => {
      currentList = value;
    });

    expect(currentList).toEqual([1, 2, 3]);

    get(fetchNextPage)();
    expect(currentList).toEqual([1, 2, 3, 4, 5, 6]);

    get(fetchNextPage)();
    expect(currentList).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    get(fetchNextPage)();
    expect(currentList).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('should set hasNextPage to false when all items are loaded', () => {
    const items$ = new BehaviorSubject([1, 2, 3, 4, 5]);
    const { hasNextPage, fetchNextPage } = useInMemoryPagination(items$, {
      page: 1,
      limit: 3,
    });

    let currentHasNextPage = false;
    hasNextPage.subscribe((value) => {
      currentHasNextPage = value;
    });

    expect(currentHasNextPage).toBe(true);

    get(fetchNextPage)();

    expect(currentHasNextPage).toBe(false);
  });

  it('should handle exact page boundaries', () => {
    const items$ = new BehaviorSubject([1, 2, 3, 4, 5, 6]);
    const { list, hasNextPage, fetchNextPage } = useInMemoryPagination(items$, {
      page: 1,
      limit: 3,
    });

    let currentList: number[] = [];
    let currentHasNextPage = false;

    list.subscribe((value) => {
      currentList = value;
    });
    hasNextPage.subscribe((value) => {
      currentHasNextPage = value;
    });

    expect(currentList).toEqual([1, 2, 3]);
    expect(currentHasNextPage).toBe(true);

    get(fetchNextPage)();

    expect(currentList).toEqual([1, 2, 3, 4, 5, 6]);
    expect(currentHasNextPage).toBe(false);
  });

  it('should start at specified page', () => {
    const items$ = new BehaviorSubject([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const { list, hasNextPage } = useInMemoryPagination(items$, {
      page: 2,
      limit: 3,
    });

    let currentList: number[] = [];
    let currentHasNextPage = false;

    list.subscribe((value) => {
      currentList = value;
    });
    hasNextPage.subscribe((value) => {
      currentHasNextPage = value;
    });

    expect(currentList).toEqual([1, 2, 3, 4, 5, 6]);
    expect(currentHasNextPage).toBe(true);
  });

  it('should handle empty arrays', () => {
    const items$ = new BehaviorSubject<number[]>([]);
    const { list, hasNextPage } = useInMemoryPagination(items$, {
      page: 1,
      limit: 3,
    });

    let currentList: number[] = [];
    let currentHasNextPage = false;

    list.subscribe((value) => {
      currentList = value;
    });
    hasNextPage.subscribe((value) => {
      currentHasNextPage = value;
    });

    expect(currentList).toEqual([]);
    expect(currentHasNextPage).toBe(false);
  });

  it('should react to source changes', () => {
    const items$ = new BehaviorSubject([1, 2, 3]);
    const { list, hasNextPage } = useInMemoryPagination(items$, {
      page: 1,
      limit: 3,
    });

    let currentList: number[] = [];
    let currentHasNextPage = false;

    list.subscribe((value) => {
      currentList = value;
    });
    hasNextPage.subscribe((value) => {
      currentHasNextPage = value;
    });

    expect(currentList).toEqual([1, 2, 3]);
    expect(currentHasNextPage).toBe(false);

    items$.next([1, 2, 3, 4, 5, 6]);

    expect(currentList).toEqual([1, 2, 3]);
    expect(currentHasNextPage).toBe(true);
  });

  it('should handle single item', () => {
    const items$ = new BehaviorSubject([1]);
    const { list, hasNextPage } = useInMemoryPagination(items$, {
      page: 1,
      limit: 3,
    });

    let currentList: number[] = [];
    let currentHasNextPage = false;

    list.subscribe((value) => {
      currentList = value;
    });
    hasNextPage.subscribe((value) => {
      currentHasNextPage = value;
    });

    expect(currentList).toEqual([1]);
    expect(currentHasNextPage).toBe(false);
  });

  it('should work with complex objects', () => {
    const items$ = new BehaviorSubject([
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
      { id: 4, name: 'Item 4' },
      { id: 5, name: 'Item 5' },
    ]);

    const { list, hasNextPage, fetchNextPage } = useInMemoryPagination(items$, {
      page: 1,
      limit: 2,
    });

    let currentList: Array<{ id: number; name: string }> = [];
    let currentHasNextPage = false;

    list.subscribe((value) => {
      currentList = value;
    });
    hasNextPage.subscribe((value) => {
      currentHasNextPage = value;
    });

    expect(currentList).toEqual([
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ]);
    expect(currentHasNextPage).toBe(true);

    get(fetchNextPage)();

    expect(currentList).toEqual([
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
      { id: 4, name: 'Item 4' },
    ]);
    expect(currentHasNextPage).toBe(true);

    get(fetchNextPage)();

    expect(currentList).toEqual([
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
      { id: 4, name: 'Item 4' },
      { id: 5, name: 'Item 5' },
    ]);
    expect(currentHasNextPage).toBe(false);
  });
});
