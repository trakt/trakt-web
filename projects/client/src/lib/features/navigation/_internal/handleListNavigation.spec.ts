import { createList } from '$lib/features/navigation/_internal/test/createList.ts';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { handleListNavigation } from './handleListNavigation.ts';

describe('handleListNavigation', () => {
  let lists: HTMLElement[];

  beforeEach(() => {
    lists = [createList(), createList(), createList()];
    lists.forEach((list) => {
      document.body.appendChild(list);
    });
  });

  afterEach(() => {
    lists.forEach((list) => {
      list.remove();
    });
  });

  it('should navigate to next list item with ArrowDown', () => {
    (lists[1]?.childNodes[0] as HTMLElement).focus();

    handleListNavigation('ArrowDown');

    expect(document.activeElement).toBe(lists[2]?.childNodes[0]);
  });

  it('should navigate to previous list item with ArrowUp', () => {
    (lists[1]?.childNodes[0] as HTMLElement).focus();

    handleListNavigation('ArrowUp');

    expect(document.activeElement).toBe(lists[0]?.childNodes[0]);
  });

  it('should keep focus at the end', () => {
    (lists[2]?.childNodes[0] as HTMLElement).focus();

    handleListNavigation('ArrowDown');

    expect(document.activeElement).toBe(lists[2]?.childNodes[0]);
  });

  it('should keep focus at the start', () => {
    (lists[0]?.childNodes[0] as HTMLElement).focus();

    handleListNavigation('ArrowUp');

    expect(document.activeElement).toBe(lists[0]?.childNodes[0]);
  });
});
