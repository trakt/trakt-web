import { render, waitFor } from '@testing-library/svelte';
import { BehaviorSubject } from 'rxjs';
import { createRawSnippet } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPlyr } from './_internal/createPlyr.ts';
import {
  PLAYER_CONTEXT_KEY,
  type PlayerContextType,
} from './_internal/createYoutubePlayerContext.ts';
import YoutubePlayerProvider from './YoutubePlayerProvider.svelte';

vi.mock('./_internal/createPlyr.ts', () => ({ createPlyr: vi.fn() }));

const children = createRawSnippet(() => ({ render: () => '<span></span>' }));

function buildContext(): PlayerContextType {
  return {
    embedId: new BehaviorSubject<string | Nil>('trailer'),
    isLoading: new BehaviorSubject(false),
    isPreloaded: new BehaviorSubject(false),
    shouldAutoplay: new BehaviorSubject(false),
  };
}

describe('component: YoutubePlayerProvider', () => {
  const unhandled = vi.fn();

  beforeEach(() => {
    process.on('unhandledRejection', unhandled);
  });

  afterEach(() => {
    process.off('unhandledRejection', unhandled);
    unhandled.mockReset();
  });

  it('should stop autoplay instead of throwing when a preloaded play fails', async () => {
    const play = vi.fn(() => Promise.reject(new Error('play blocked')));
    const handlers = new Map<string, () => void>();
    vi.mocked(createPlyr).mockResolvedValue({
      on: vi.fn((event: string, handler: () => void) =>
        handlers.set(event, handler),
      ),
      off: vi.fn(),
      play,
      stop: vi.fn(),
      destroy: vi.fn(),
      fullscreen: { enter: vi.fn() },
    } as unknown as Plyr);
    const context = buildContext();

    render(YoutubePlayerProvider, {
      props: { children },
      context: new Map([[PLAYER_CONTEXT_KEY, context]]),
    });

    await waitFor(() => expect(handlers.has('ready')).toBe(true));
    handlers.get('ready')?.();
    context.shouldAutoplay.next(true);

    await waitFor(() => expect(play).toHaveBeenCalled());
    await waitFor(() => expect(context.shouldAutoplay.value).toBe(false));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(unhandled).not.toHaveBeenCalled();
  });
});
