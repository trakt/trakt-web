import { renderStore } from '$test/beds/store/renderStore.ts';
import { describe, expect, it, vi } from 'vitest';
import { hideUnfittingChildren } from './hideUnfittingChildren.ts';

function createMockElement(right: number): HTMLElement {
  const element = document.createElement('div');
  element.getBoundingClientRect = vi.fn(() => ({
    right,
    top: 0,
    bottom: 0,
    left: 0,
    height: 0,
    width: 0,
    x: 0,
    y: 0,
    toJSON: vi.fn(),
  }));
  return element;
}

describe('hideUnfittingChildren', () => {
  it('hides children that do not fit within parent bounds', async () => {
    const parent = createMockElement(500);
    const child1 = createMockElement(400);
    const child2 = createMockElement(600);

    parent.appendChild(child1);
    parent.appendChild(child2);

    await renderStore(() => hideUnfittingChildren(parent));

    expect(child1.style.opacity).toBe('1');
    expect(child2.style.opacity).toBe('0');
  });

  it('shows all children when they fit within parent bounds', async () => {
    const parent = createMockElement(500);
    const child1 = createMockElement(300);
    const child2 = createMockElement(400);

    parent.appendChild(child1);
    parent.appendChild(child2);

    await renderStore(() => hideUnfittingChildren(parent));

    expect(child1.style.opacity).toBe('1');
    expect(child2.style.opacity).toBe('1');
  });
});
