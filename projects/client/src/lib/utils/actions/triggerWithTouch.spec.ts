import { describe, expect, it } from 'vitest';
import { triggerWithTouch } from './triggerWithTouch';

describe('triggerWithTouch', () => {
  it('should trigger click for touch events without movement', () => {
    const node = document.createElement('button');
    let clickCount = 0;
    node.addEventListener('click', () => clickCount++);

    const action = triggerWithTouch(node);

    const touchStartEvent = new TouchEvent('touchstart', {
      bubbles: true,
      touches: [
        { clientX: 0, clientY: 0 } as unknown as Touch,
      ],
    });

    const touchEndEvent = new TouchEvent('touchend', {
      bubbles: true,
      changedTouches: [
        { clientX: 0, clientY: 0 } as unknown as Touch,
      ],
    });

    node.dispatchEvent(touchStartEvent);
    node.dispatchEvent(touchEndEvent);

    expect(clickCount).toBe(1);

    action.destroy();
  });

  it('should NOT trigger click when movement exceeds threshold', () => {
    const node = document.createElement('button');
    let clickCount = 0;
    node.addEventListener('click', () => clickCount++);

    const action = triggerWithTouch(node);

    const touchStartEvent = new TouchEvent('touchstart', {
      bubbles: true,
      touches: [
        { clientX: 0, clientY: 0 } as unknown as Touch,
      ],
    });

    const touchEndEvent = new TouchEvent('touchend', {
      bubbles: true,
      changedTouches: [
        { clientX: 20, clientY: 20 } as unknown as Touch,
      ],
    });

    node.dispatchEvent(touchStartEvent);
    node.dispatchEvent(touchEndEvent);

    expect(clickCount).toBe(0);

    action.destroy();
  });

  it('should cleanup listeners on destroy', () => {
    const node = document.createElement('button');
    let clickCount = 0;
    node.addEventListener('click', () => clickCount++);

    const action = triggerWithTouch(node);
    action.destroy();

    const touchStartEvent = new TouchEvent('touchstart', {
      bubbles: true,
      touches: [
        { clientX: 0, clientY: 0 } as unknown as Touch,
      ],
    });

    const touchEndEvent = new TouchEvent('touchend', {
      bubbles: true,
      changedTouches: [
        { clientX: 0, clientY: 0 } as unknown as Touch,
      ],
    });

    node.dispatchEvent(touchStartEvent);
    node.dispatchEvent(touchEndEvent);

    expect(clickCount).toBe(0);
  });

  it('should NOT trigger click for non-HTMLElement targets', () => {
    const node = document.createElement('button');
    let clickCount = 0;
    node.addEventListener('click', () => clickCount++);

    const action = triggerWithTouch(node);

    const touchStartEvent = new TouchEvent('touchstart', {
      bubbles: true,
      touches: [
        { clientX: 0, clientY: 0 } as unknown as Touch,
      ],
    });
    Object.defineProperty(touchStartEvent, 'target', { value: {} });

    const touchEndEvent = new TouchEvent('touchend', {
      bubbles: true,
      changedTouches: [
        { clientX: 0, clientY: 0 } as unknown as Touch,
      ],
    });
    Object.defineProperty(touchEndEvent, 'target', { value: {} });

    node.dispatchEvent(touchStartEvent);
    node.dispatchEvent(touchEndEvent);

    expect(clickCount).toBe(0);

    action.destroy();
  });
});
