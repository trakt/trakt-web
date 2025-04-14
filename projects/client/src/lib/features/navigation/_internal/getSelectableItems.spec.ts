import { createList } from '$lib/features/navigation/_internal/test/createList.ts';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DpadNavigationType } from '../models/DpadNavigationType.ts';
import { getSelectableItems } from './getSelectableItems.ts';

describe('getSelectableItems', () => {
  let list: HTMLElement;

  beforeEach(() => {
    list = createList(true);
  });

  afterEach(() => {
    list.remove();
  });

  it('should not return elements that are not navigate-able', () => {
    const notAnItem = document.createElement('div');
    list.appendChild(notAnItem);

    const items = getSelectableItems(list);

    expect(items).toHaveLength(0);
  });

  it('should get the items in a list', () => {
    const item = document.createElement('button');
    item.setAttribute('data-dpad-navigation', DpadNavigationType.Item);
    list.appendChild(item);

    const items = getSelectableItems(list);
    expect(items).toEqual([item]);
  });
});
