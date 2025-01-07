import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { clickOutside } from './clickOutside';

describe('clickOutside', () => {
  let node: HTMLElement;

  beforeEach(() => {
    node = document.createElement('div');
    document.body.appendChild(node);
  });

  afterEach(() => {
    document.body.removeChild(node);
  });

  it('should dispatch clickoutside event when clicking outside element', () => {
    let eventFired = false;
    node.addEventListener('clickoutside', () => {
      eventFired = true;
    });

    clickOutside(node);
    document.body.click();

    expect(eventFired).toBe(true);
  });

  it('should NOT dispatch clickoutside event when clicking inside element', () => {
    let eventFired = false;
    node.addEventListener('clickoutside', () => {
      eventFired = true;
    });

    const childNode = document.createElement('div');
    node.appendChild(childNode);

    clickOutside(node);
    childNode.click();

    expect(eventFired).toBe(false);
  });

  it('should clean up event listeners when destroyed', () => {
    let eventFired = false;
    node.addEventListener('clickoutside', () => {
      eventFired = true;
    });

    const action = clickOutside(node);
    action.destroy();
    document.body.click();

    expect(eventFired).toBe(false);
  });
});
