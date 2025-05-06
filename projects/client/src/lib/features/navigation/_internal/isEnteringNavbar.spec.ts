import { describe, expect, it } from 'vitest';
import { DpadNavigationType } from '../models/DpadNavigationType.ts';
import { isEnteringNavbar } from './isEnteringNavbar.ts';
import { createList } from './test/createList.ts';

describe('isEnteringNavbar', () => {
  it('should return true when leaving lists', () => {
    const list = createList(true);
    const item = document.createElement('div');
    item.setAttribute('data-dpad-navigation', DpadNavigationType.Item);
    item.setAttribute('tabindex', '0');

    list.appendChild(item);
    document.body.appendChild(list);
    item.focus();

    expect(isEnteringNavbar('ArrowLeft')).toBe(true);
    list.remove();
  });

  it('should return false when staying in the lists', () => {
    const list = createList(true);
    const item = document.createElement('div');
    item.setAttribute('data-dpad-navigation', DpadNavigationType.Item);
    item.setAttribute('tabindex', '0');

    list.appendChild(item);
    document.body.appendChild(list);
    item.focus();

    expect(isEnteringNavbar('ArrowRight')).toBe(false);
    list.remove();
  });
});
