import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { triggerWithKeyboard } from './triggerWithKeyboard';

describe('triggerWithKeyboard', () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should trigger click on Enter key', () => {
    let clicked = false;
    element.addEventListener('click', () => clicked = true);

    triggerWithKeyboard(element);

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(clicked).toBe(true);
  });

  it('should trigger click on Space key', () => {
    let clicked = false;
    element.addEventListener('click', () => clicked = true);

    triggerWithKeyboard(element);

    element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

    expect(clicked).toBe(true);
  });

  it('should not trigger click on other keys', () => {
    let clicked = false;
    element.addEventListener('click', () => clicked = true);

    triggerWithKeyboard(element);

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));

    expect(clicked).toBe(false);
  });

  it('should cleanup event listeners on destroy', () => {
    let clicked = false;
    element.addEventListener('click', () => clicked = true);

    const action = triggerWithKeyboard(element);
    action.destroy();

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(clicked).toBe(false);
  });
});
