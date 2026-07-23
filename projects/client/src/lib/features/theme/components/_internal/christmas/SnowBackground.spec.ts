import SnowBackground from './SnowBackground.svelte';

import { useAppearance } from '$lib/features/appearance/useAppearance.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { flushSync, tick } from 'svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const snowRendererMock = vi.hoisted(() => {
  const destroy = vi.fn();
  const snowRenderer = vi.fn(() => ({ destroy }));

  return { destroy, snowRenderer };
});

vi.mock('./snowRenderer', () => ({
  snowRenderer: snowRendererMock.snowRenderer,
}));

describe('SnowBackground', () => {
  beforeEach(() => {
    snowRendererMock.destroy.mockClear();
    snowRendererMock.snowRenderer.mockClear();
    useAppearance().setReduceVisualNoise(false);
  });

  it('should stop and restart snow live when reduced effects changes', async () => {
    const rendered = renderComponent(SnowBackground, { props: {} });
    await tick();

    expect(rendered.container.querySelector('.trakt-snow-canvas'))
      .toBeInstanceOf(HTMLCanvasElement);
    expect(snowRendererMock.snowRenderer).toHaveBeenCalledOnce();

    flushSync(() => {
      useAppearance().setReduceVisualNoise(true);
    });

    expect(rendered.container.querySelector('.trakt-snow-canvas')).toBeNull();
    expect(snowRendererMock.destroy).toHaveBeenCalledOnce();

    flushSync(() => {
      useAppearance().setReduceVisualNoise(false);
    });

    expect(rendered.container.querySelector('.trakt-snow-canvas'))
      .toBeInstanceOf(HTMLCanvasElement);
    expect(snowRendererMock.snowRenderer).toHaveBeenCalledTimes(2);
  });
});
