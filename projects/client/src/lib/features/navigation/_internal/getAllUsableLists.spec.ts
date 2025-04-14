import { createList } from '$lib/features/navigation/_internal/test/createList.ts';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DpadNavigationType } from '../models/DpadNavigationType.ts';
import { getAllUsableLists } from './getAllUsableLists.ts';

describe('getAllUsableLists', () => {
  let list: HTMLElement;

  beforeEach(() => {
    list = createList(true);
    document.body.appendChild(list);
  });

  afterEach(() => {
    list.remove();
  });

  it('should not get lists without any items in them', () => {
    const lists = getAllUsableLists();

    expect(lists).toHaveLength(0);
  });

  it('should get lists with items in them', () => {
    const item = document.createElement('button');
    item.setAttribute('data-dpad-navigation', DpadNavigationType.Item);
    list.appendChild(item);

    const lists = getAllUsableLists();
    expect(lists).toEqual([list]);
  });
});
