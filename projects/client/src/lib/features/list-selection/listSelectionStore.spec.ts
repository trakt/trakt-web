import type { ListItem } from '$lib/requests/models/ListItem.ts';
import { renderStore } from '$test/beds/store/renderStore.ts';
import { describe, expect, it } from 'vitest';
import { createListSelectionStore } from './listSelectionStore.svelte.ts';

function stubItem(key: string): ListItem {
  return {
    type: 'movie',
    id: 1,
    key,
    rank: 1,
    notes: undefined,
    listedAt: new Date('2024-01-01'),
    entry: { id: 1 } as ListItem['entry'],
  } as ListItem;
}

const KEYS = ['a', 'b', 'c', 'd', 'e'];

async function renderWithItems() {
  const store = await renderStore(() => createListSelectionStore());

  KEYS.forEach((key) => store.register(stubItem(key)));

  return store;
}

describe('util: listSelectionStore', () => {
  it('should start outside edit mode with nothing selected', async () => {
    const store = await renderWithItems();

    expect(store.isEditing).toBe(false);
    expect(store.selectedCount).toBe(0);
  });

  it('should enter edit mode and select the clicked item on the first click', async () => {
    const store = await renderWithItems();

    store.click('b');

    expect(store.isEditing).toBe(true);
    expect(store.isSelected('b')).toBe(true);
    expect(store.selectedCount).toBe(1);
  });

  it('should toggle an item off on a second plain click', async () => {
    const store = await renderWithItems();

    store.click('b');
    store.click('b');

    expect(store.isSelected('b')).toBe(false);
    expect(store.selectedCount).toBe(0);
  });

  it('should add a second item to the selection on a plain click without clearing the first', async () => {
    const store = await renderWithItems();

    store.click('b');
    store.click('d');

    expect(store.selectedKeys).to.deep.equal(new Set(['b', 'd']));
  });

  it('should select the whole range on a shift-click from the anchor', async () => {
    const store = await renderWithItems();

    store.click('b');
    store.click('d', { shiftKey: true, ctrlKey: false, metaKey: false });

    expect(store.selectedKeys).to.deep.equal(new Set(['b', 'c', 'd']));
  });

  it('should select every registered item on selectAll', async () => {
    const store = await renderWithItems();

    store.enterEdit();
    store.selectAll();

    expect(store.selectedKeys).to.deep.equal(new Set(KEYS));
  });

  it('should clear the selection and leave edit mode on exitEdit', async () => {
    const store = await renderWithItems();

    store.click('a');
    store.exitEdit();

    expect(store.isEditing).toBe(false);
    expect(store.selectedCount).toBe(0);
  });

  it('should drop an unregistered item from the selection', async () => {
    const store = await renderWithItems();

    store.click('a');
    store.unregister('a');

    expect(store.isSelected('a')).toBe(false);
  });

  it('should expose the registered ListItem for every selected key', async () => {
    const store = await renderWithItems();

    store.click('a');
    store.click('c');

    expect(store.selectedItems.map((item) => item.key).toSorted())
      .to.deep.equal(['a', 'c']);
  });

  it('should clear everything, including registered items, on reset', async () => {
    const store = await renderWithItems();

    store.click('a');
    store.reset();

    expect(store.isEditing).toBe(false);
    expect(store.totalCount).toBe(0);
    expect(store.selectedCount).toBe(0);
  });
});
