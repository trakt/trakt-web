import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DpadNavigationType } from '../models/DpadNavigationType.ts';
import { focusSomething } from './focusSomething.ts';
import { createList } from './test/createList.ts';

describe('focusSomething', () => {
  let list: HTMLDivElement;

  beforeEach(() => {
    list = createList();
    document.body.appendChild(list);
  });

  afterEach(() => {
    list.remove();
  });

  it('should focus the first navigable element when no element is focused', () => {
    document.body.focus();
    expect(document.activeElement).toBe(document.body);

    focusSomething();

    expect(document.activeElement).toBe(list.querySelector(
      `[data-dpad-navigation="${DpadNavigationType.Item}"]`,
    ));
  });

  it('should not focus anything if an element is already focused', () => {
    const otherElement = document.createElement('button');
    document.body.appendChild(otherElement);
    otherElement.focus();

    focusSomething();

    expect(document.activeElement).toBe(otherElement);

    document.body.removeChild(otherElement);
  });

  it('should do nothing when no navigable element is found', () => {
    document.body.removeChild(list);
    document.body.focus();

    focusSomething();

    expect(document.activeElement).toBe(document.body);
  });
});
