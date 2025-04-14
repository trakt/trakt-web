import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DpadNavigationType } from '../models/DpadNavigationType.ts';
import { focusSomething } from './focusSomething.ts';

describe('focusSomething', () => {
  let element: HTMLButtonElement;

  beforeEach(() => {
    element = document.createElement('button');
    element.scrollIntoView = vi.fn();
    element.setAttribute('data-dpad-navigation', DpadNavigationType.Item);
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it('should focus the first navigable element when no element is focused', () => {
    document.body.focus();
    expect(document.activeElement).toBe(document.body);

    focusSomething();

    expect(document.activeElement).toBe(element);
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
    document.body.removeChild(element);
    document.body.focus();

    focusSomething();

    expect(document.activeElement).toBe(document.body);
  });
});
