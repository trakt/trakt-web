import type {
  ShortcutEventDetail,
  ShortcutTrigger,
} from '@svelte-put/shortcut';
import { describe, expect, it, vi } from 'vitest';
import { createArrowNavTriggers } from './createArrowNavTriggers.ts';

function triggerShortcut(
  trigger: ShortcutTrigger | undefined,
  originalEvent: KeyboardEvent,
) {
  trigger?.callback?.(
    {
      node: document.body,
      trigger,
      originalEvent,
    } satisfies ShortcutEventDetail,
  );
}

describe('util: createArrowNavTriggers', () => {
  it('should navigate backward and forward with the configured modifier', () => {
    const goto = vi.fn();
    const triggers = createArrowNavTriggers({
      prevUrl: '/previous',
      nextUrl: '/next',
      modifier: false,
      goto,
    });
    const previousEvent = new KeyboardEvent('keydown', { cancelable: true });
    const nextEvent = new KeyboardEvent('keydown', { cancelable: true });

    expect(triggers.map((trigger) => trigger.modifier)).toEqual([false, false]);

    triggerShortcut(triggers.at(0), previousEvent);
    triggerShortcut(triggers.at(1), nextEvent);

    expect(previousEvent.defaultPrevented).toBe(true);
    expect(nextEvent.defaultPrevented).toBe(true);
    expect(goto).toHaveBeenNthCalledWith(1, '/previous');
    expect(goto).toHaveBeenNthCalledWith(2, '/next');
  });

  it('should disable a direction when its destination is unavailable', () => {
    const triggers = createArrowNavTriggers({
      nextUrl: '/next',
      canGoNext: false,
      goto: vi.fn(),
    });

    expect(triggers.at(0)?.enabled).toBe(false);
    expect(triggers.at(1)?.enabled).toBe(false);
  });

  it('should leave the key untouched when navigation is blocked', () => {
    const goto = vi.fn();
    const triggers = createArrowNavTriggers({
      prevUrl: '/previous',
      nextUrl: '/next',
      modifier: false,
      canNavigate: () => false,
      goto,
    });
    const previousEvent = new KeyboardEvent('keydown', { cancelable: true });

    triggerShortcut(triggers.at(0), previousEvent);

    expect(previousEvent.defaultPrevented).toBe(false);
    expect(goto).not.toHaveBeenCalled();
  });

  it('should navigate when navigation is allowed', () => {
    const goto = vi.fn();
    const triggers = createArrowNavTriggers({
      prevUrl: '/previous',
      nextUrl: '/next',
      modifier: false,
      canNavigate: () => true,
      goto,
    });
    const previousEvent = new KeyboardEvent('keydown', { cancelable: true });

    triggerShortcut(triggers.at(0), previousEvent);

    expect(previousEvent.defaultPrevented).toBe(true);
    expect(goto).toHaveBeenCalledWith('/previous');
  });

  it('should ignore text inputs and events handled by another control', () => {
    const goto = vi.fn();
    const triggers = createArrowNavTriggers({
      prevUrl: '/previous',
      nextUrl: '/next',
      goto,
    });
    const inputEvent = new KeyboardEvent('keydown', { cancelable: true });
    Object.defineProperty(inputEvent, 'target', {
      value: document.createElement('input'),
    });
    const handledEvent = new KeyboardEvent('keydown', { cancelable: true });
    handledEvent.preventDefault();

    triggerShortcut(triggers.at(0), inputEvent);
    triggerShortcut(triggers.at(1), handledEvent);

    expect(goto).not.toHaveBeenCalled();
  });
});
