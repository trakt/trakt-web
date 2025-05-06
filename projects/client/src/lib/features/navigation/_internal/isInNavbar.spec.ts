import { describe, expect, it } from 'vitest';
import { DpadNavigationType } from '../models/DpadNavigationType.ts';
import { isInNavbar } from './isInNavbar.ts';
import { createList } from './test/createList.ts';

describe('isInNavbar', () => {
  it('should return true when active element is inside navbar', () => {
    const navbar = document.createElement('div');
    navbar.setAttribute('data-dpad-navigation', DpadNavigationType.Navbar);
    const item = document.createElement('div');
    item.setAttribute('data-dpad-navigation', DpadNavigationType.Item);
    item.setAttribute('tabindex', '0');

    navbar.appendChild(item);
    document.body.appendChild(navbar);
    item.focus();

    expect(isInNavbar()).toBe(true);
    navbar.remove();
  });

  it('should return false when active element is not inside navbar', () => {
    const list = createList(true);
    const item = document.createElement('div');
    item.setAttribute('data-dpad-navigation', DpadNavigationType.Item);
    item.setAttribute('tabindex', '0');

    list.appendChild(item);
    document.body.appendChild(list);
    item.focus();

    expect(isInNavbar()).toBe(false);
    list.remove();
  });
});
