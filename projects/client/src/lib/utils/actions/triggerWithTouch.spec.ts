import { describe, expect, it } from 'vitest';
import { triggerWithTouch } from './triggerWithTouch';

describe('triggerWithTouch', () => {
  it('should trigger click for touch events', () => {
    const node = document.createElement('button');
    let clickCount = 0;
    node.addEventListener('click', () => clickCount++);

    const action = triggerWithTouch(node);

    const touchEvent = new Event('pointerup', {
      bubbles: true,
    });
    Object.defineProperty(touchEvent, 'pointerType', { value: 'touch' });

    node.dispatchEvent(touchEvent);

    expect(clickCount).toBe(1);

    action.destroy();
  });

  it('should NOT trigger click for mouse events', () => {
    const node = document.createElement('button');
    let clickCount = 0;
    node.addEventListener('click', () => clickCount++);

    const action = triggerWithTouch(node);

    const mouseEvent = new Event('pointerup', {
      bubbles: true,
    });
    Object.defineProperty(mouseEvent, 'pointerType', { value: 'mouse' });

    node.dispatchEvent(mouseEvent);

    expect(clickCount).toBe(0);

    action.destroy();
  });

  it('should cleanup listeners on destroy', () => {
    const node = document.createElement('button');
    let clickCount = 0;

    const action = triggerWithTouch(node);
    node.addEventListener('click', () => clickCount++);

    action.destroy();

    const touchEvent = new Event('pointerup', {
      bubbles: true,
    });
    Object.defineProperty(touchEvent, 'pointerType', { value: 'touch' });

    node.dispatchEvent(touchEvent);

    expect(clickCount).toBe(0);
  });

  it('should NOT trigger click for non-HTMLElement targets', () => {
    const node = document.createElement('button');
    let clickCount = 0;
    node.addEventListener('click', () => clickCount++);

    const action = triggerWithTouch(node);

    const touchEvent = new Event('pointerup', {
      bubbles: true,
    });
    Object.defineProperty(touchEvent, 'pointerType', { value: 'touch' });
    Object.defineProperty(touchEvent, 'target', { value: {} });

    node.dispatchEvent(touchEvent);

    expect(clickCount).toBe(0);

    action.destroy();
  });
});
