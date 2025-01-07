import { beforeEach, describe, expect, it } from 'vitest';
import { disableTransitionOn } from './disableTransitionOn.ts';

describe('disableTransitionOn', () => {
  let element: HTMLElement;
  let action: ReturnType<typeof disableTransitionOn>;

  beforeEach(() => {
    element = document.createElement('div');
    action = disableTransitionOn(element, 'touch');
  });

  it('should remove transition on matching pointer type', () => {
    const event = new Event('pointerdown', {
      bubbles: true,
    });
    Object.defineProperty(event, 'pointerType', { value: 'touch' });

    element.dispatchEvent(event);
    expect(element.style.getPropertyValue('transition')).toBe('none');
  });

  it('should not remove transition on non-matching pointer type', () => {
    const event = new Event('pointerdown', {
      bubbles: true,
    });
    Object.defineProperty(event, 'pointerType', { value: 'mouse' });

    element.dispatchEvent(event);
    expect(element.style.getPropertyValue('transition')).toBe('');
  });

  it('should clean up event listeners on destroy', () => {
    action.destroy!();

    const event = new Event('pointerdown', {
      bubbles: true,
    });
    Object.defineProperty(event, 'pointerType', { value: 'touch' });

    element.dispatchEvent(event);
    expect(element.style.getPropertyValue('transition')).toBe('');
  });
});
