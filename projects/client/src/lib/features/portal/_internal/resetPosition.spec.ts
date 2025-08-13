import { beforeEach, describe, expect, it } from 'vitest';
import { resetPosition } from './resetPosition.ts';

describe('resetPosition', () => {
  let node: HTMLElement;

  beforeEach(() => {
    node = document.createElement('div');
  });

  it('should reset the position styles', () => {
    node.style.left = '100px';
    node.style.top = '200px';
    node.style.right = '50px';
    node.style.bottom = '75px';

    resetPosition(node);

    expect(node.style.left).toBe('initial');
    expect(node.style.top).toBe('initial');
    expect(node.style.right).toBe('initial');
    expect(node.style.bottom).toBe('initial');
  });
});
