import { createList } from '$lib/features/navigation/_internal/test/createList.ts';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { handleItemNavigation } from './handleItemNavigation.ts';

describe('handleItemNavigation', () => {
  let list: HTMLElement;

  beforeEach(() => {
    list = createList();

    document.body.appendChild(list);
  });

  afterEach(() => {
    list.remove();
  });

  it('should navigate to next item with ArrowRight', () => {
    (list.childNodes[1] as HTMLElement).focus();

    handleItemNavigation('ArrowRight');

    expect(document.activeElement).toBe(list.childNodes[2]);
  });

  it('should navigate to previous item with ArrowLeft', () => {
    (list.childNodes[1] as HTMLElement).focus();

    handleItemNavigation('ArrowLeft');

    expect(document.activeElement).toBe(list.childNodes[0]);
  });

  it('should keep focus at the end', () => {
    (list.childNodes[2] as HTMLElement).focus();

    handleItemNavigation('ArrowRight');

    expect(document.activeElement).toBe(list.childNodes[2]);
  });

  it('should keep focus at the start', () => {
    (list.childNodes[0] as HTMLElement).focus();

    handleItemNavigation('ArrowLeft');

    expect(document.activeElement).toBe(list.childNodes[0]);
  });
});
