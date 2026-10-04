import type { ListItem } from '$lib/requests/models/ListItem.ts';
import { renderStore } from '$test/beds/store/renderStore.ts';
import { describe, expect, it } from 'vitest';
import { createListSelectionContext } from './createListSelectionContext.svelte.ts';

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
  const context = await renderStore(() => createListSelectionContext());

  KEYS.forEach((key) => context.register(stubItem(key)));

  return context;
}

describe('util: createListSelectionContext', () => {
  it('should start outside edit mode with nothing selected', async () => {
    const context = await renderWithItems();

    expect(context.isEditing).toBe(false);
    expect(context.selectedCount).toBe(0);
  });

  it('should enter edit mode and select the clicked item on the first click', async () => {
    const context = await renderWithItems();

    context.click('b');

    expect(context.isEditing).toBe(true);
    expect(context.isSelected('b')).toBe(true);
    expect(context.selectedCount).toBe(1);
  });

  it('should toggle an item off on a second plain click', async () => {
    const context = await renderWithItems();

    context.click('b');
    context.click('b');

    expect(context.isSelected('b')).toBe(false);
    expect(context.selectedCount).toBe(0);
  });

  it('should add a second item to the selection on a plain click without clearing the first', async () => {
    const context = await renderWithItems();

    context.click('b');
    context.click('d');

    expect(context.selectedKeys).to.deep.equal(new Set(['b', 'd']));
  });

  it('should select the whole range on a shift-click from the anchor', async () => {
    const context = await renderWithItems();

    context.click('b');
    context.click('d', { shiftKey: true, ctrlKey: false, metaKey: false });

    expect(context.selectedKeys).to.deep.equal(new Set(['b', 'c', 'd']));
  });

  it('should select every registered item on selectAll', async () => {
    const context = await renderWithItems();

    context.enterEdit();
    context.selectAll();

    expect(context.selectedKeys).to.deep.equal(new Set(KEYS));
  });

  it('should clear the selection and leave edit mode on exitEdit', async () => {
    const context = await renderWithItems();

    context.click('a');
    context.exitEdit();

    expect(context.isEditing).toBe(false);
    expect(context.selectedCount).toBe(0);
  });

  it('should drop an unregistered item from the selection', async () => {
    const context = await renderWithItems();

    context.click('a');
    context.unregister('a');

    expect(context.isSelected('a')).toBe(false);
  });

  it('should expose the registered ListItem for every selected key', async () => {
    const context = await renderWithItems();

    context.click('a');
    context.click('c');

    expect(context.selectedItems.map((item) => item.key).toSorted())
      .to.deep.equal(['a', 'c']);
  });
});
