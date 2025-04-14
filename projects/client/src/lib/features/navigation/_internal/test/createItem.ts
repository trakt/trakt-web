import { DpadNavigationType } from '$lib/features/navigation/models/DpadNavigationType.ts';
import { vi } from 'vitest';

export function createItem() {
  const item = document.createElement('button');
  item.setAttribute('data-dpad-navigation', DpadNavigationType.Item);
  item.scrollIntoView = vi.fn();
  return item;
}
