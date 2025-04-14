import { createItem } from '$lib/features/navigation/_internal/test/createItem.ts';
import { DpadNavigationType } from '$lib/features/navigation/models/DpadNavigationType.ts';

function addItemsToList(list: HTMLDivElement) {
  list.appendChild(createItem());
  list.appendChild(createItem());
  list.appendChild(createItem());
}

export function createList(isEmpty = false) {
  const list = document.createElement('div');
  list.setAttribute('data-dpad-navigation', DpadNavigationType.List);

  !isEmpty && addItemsToList(list);

  return list;
}
