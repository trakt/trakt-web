import { renderStore } from '$test/beds/store/renderStore.ts';
import { describe, expect, it, vi } from 'vitest';
import { setScrollInfo } from './setScrollInfo.ts';

describe('action: setScrollInfo', () => {
  const nextFrame = () =>
    new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

  async function scrollTo(
    node: HTMLDivElement,
    location: 'top' | 'middle' | 'bottom',
  ) {
    vi.spyOn(node, 'scrollHeight', 'get')
      .mockReturnValueOnce(100);

    vi.spyOn(node, 'clientHeight', 'get')
      .mockReturnValueOnce(50);

    switch (location) {
      case 'top':
        node.scrollTop = 0;
        break;
      case 'middle':
        node.scrollTop = 25;
        break;
      case 'bottom':
        node.scrollTop = 50;
        break;
    }

    node.dispatchEvent(new Event('scroll'));
    await nextFrame();
  }

  it('should not add scroll info if the node has no overflow', async () => {
    const node = document.createElement('div');
    const component = await renderStore(() => setScrollInfo(node));

    expect(node.classList).not.toContain('scrolled-down');
    expect(node.classList).not.toContain('scrolled-up');

    component.destroy();
  });

  it('should indicate it scrolled down to the bottom', async () => {
    const node = document.createElement('div');
    const component = await renderStore(() => setScrollInfo(node));

    await scrollTo(node, 'bottom');

    expect(node.classList).toContain('scrolled-down');
    expect(node.classList).not.toContain('scrolled-up');

    component.destroy();
  });

  it('should indicate it scrolled up to the top', async () => {
    const node = document.createElement('div');
    const component = await renderStore(() => setScrollInfo(node));

    await scrollTo(node, 'top');

    expect(node.classList).not.toContain('scrolled-down');
    expect(node.classList).toContain('scrolled-up');

    component.destroy();
  });

  it('should indicate it scrolled a little', async () => {
    const node = document.createElement('div');
    const component = await renderStore(() => setScrollInfo(node));

    await scrollTo(node, 'middle');

    expect(node.classList).toContain('scrolled-down');
    expect(node.classList).toContain('scrolled-up');

    component.destroy();
  });
});
