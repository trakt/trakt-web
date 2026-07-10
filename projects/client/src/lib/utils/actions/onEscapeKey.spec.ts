import { describe, expect, it } from 'vitest';
import { onEscapeKey } from './onEscapeKey.ts';

function pressKey(key: string) {
  globalThis.window.dispatchEvent(new KeyboardEvent('keydown', { key }));
}

describe('onEscapeKey', () => {
  const node = document.createElement('div');

  it('should invoke the callback when Escape is pressed', () => {
    let callCount = 0;
    const action = onEscapeKey(node, () => {
      callCount += 1;
    });

    pressKey('Escape');

    expect(callCount).toBe(1);
    action.destroy();
  });

  it('should NOT invoke the callback for other keys', () => {
    let callCount = 0;
    const action = onEscapeKey(node, () => {
      callCount += 1;
    });

    pressKey('Enter');
    pressKey('a');

    expect(callCount).toBe(0);
    action.destroy();
  });

  it('should invoke the latest callback after an update', () => {
    let firstCallCount = 0;
    let secondCallCount = 0;
    const action = onEscapeKey(node, () => {
      firstCallCount += 1;
    });

    action.update(() => {
      secondCallCount += 1;
    });
    pressKey('Escape');

    expect(firstCallCount).toBe(0);
    expect(secondCallCount).toBe(1);
    action.destroy();
  });

  it('should clean up the listener when destroyed', () => {
    let callCount = 0;
    const action = onEscapeKey(node, () => {
      callCount += 1;
    });

    action.destroy();
    pressKey('Escape');

    expect(callCount).toBe(0);
  });
});
