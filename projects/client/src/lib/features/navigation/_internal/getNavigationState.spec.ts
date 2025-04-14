import { createList } from '$lib/features/navigation/_internal/test/createList.ts';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getNavigationState } from './getNavigationState.ts';

describe('getNavigationState', () => {
  let lists: HTMLElement[];

  beforeEach(() => {
    lists = [createList(), createList()];
    lists.forEach((list) => {
      document.body.appendChild(list);
    });
  });

  afterEach(() => {
    lists.forEach((list) => {
      list.remove();
    });
  });

  it('should focus something if no active element exists', () => {
    getNavigationState();

    expect(document.activeElement).not.toBe(document.body);
  });

  it('should return the correct navigation state', () => {
    const item = lists[0]?.childNodes[1] as HTMLElement;
    item.focus();

    const result = getNavigationState();

    expect(result.focusedIndex).toBe(1);
    expect(result.currentListIndex).toBe(0);
    expect(result.items.length).toBe(3);
    expect(result.lists.length).toBe(2);
  });

  it('should return the correct navigation state within another list', () => {
    const item = lists[1]?.childNodes[0] as HTMLElement;
    item.focus();

    const result = getNavigationState();

    expect(result.focusedIndex).toBe(0);
    expect(result.currentListIndex).toBe(1);
    expect(result.items.length).toBe(3);
    expect(result.lists.length).toBe(2);
  });
});
