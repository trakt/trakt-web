import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { trackElementHeight } from './trackElementHeight.ts';

const VAR_NAME = '--test-height';

function readVar() {
  return document.documentElement.style.getPropertyValue(VAR_NAME);
}

describe('action: trackElementHeight', () => {
  let node: HTMLElement;
  let height: number;
  let resize: () => void;

  beforeEach(() => {
    node = document.createElement('div');
    height = 120;
    vi.spyOn(node, 'getBoundingClientRect').mockImplementation(
      () => new DOMRect(0, 0, 100, height),
    );
    resize = () => {};
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          resize = callback;
        }
        observe() {}
        disconnect() {}
        unobserve() {}
      },
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should write the initial height immediately', () => {
    const action = trackElementHeight(node, VAR_NAME);

    expect(readVar()).toBe('120px');
    action.destroy();
  });

  it('should update the height when the element resizes', () => {
    const action = trackElementHeight(node, VAR_NAME);

    height = 233.6;
    resize();

    expect(readVar()).toBe('234px');
    action.destroy();
  });

  it('should remove the variable on destroy', () => {
    const action = trackElementHeight(node, VAR_NAME);

    action.destroy();

    expect(readVar()).toBe('');
  });
});
