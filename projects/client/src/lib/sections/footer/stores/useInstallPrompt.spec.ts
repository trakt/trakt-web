import { renderStore } from '$test/beds/store/renderStore.ts';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useInstallPrompt } from './useInstallPrompt.ts';

const { track } = vi.hoisted(() => ({ track: vi.fn() }));

vi.mock('$lib/features/analytics/useTrack.ts', () => ({
  useTrack: () => ({ track }),
}));

function buildPromptEvent(outcome: 'accepted' | 'dismissed' = 'accepted') {
  const event = new Event('beforeinstallprompt') as BeforeInstallPromptEvent;
  event.prompt = () => Promise.resolve({ outcome });
  return event;
}

async function renderInstallPrompt() {
  const store = await renderStore(() => useInstallPrompt());

  let current: BeforeInstallPromptEvent | null = null;
  store.subscribe((value) => (current = value));

  return () => current;
}

describe('store: useInstallPrompt', () => {
  afterEach(() => {
    globalThis.install = null;
    track.mockClear();
  });

  it('should seed from an event stashed before mount', async () => {
    const event = buildPromptEvent();
    globalThis.install = event;

    const read = await renderInstallPrompt();

    expect(read()).toBe(event);
  });

  it('should pick up an event dispatched after mount', async () => {
    const read = await renderInstallPrompt();
    expect(read()).toBe(null);

    const event = buildPromptEvent();
    globalThis.dispatchEvent(event);

    expect(read()).toBe(event);
  });

  it('should track an accepted install', async () => {
    globalThis.install = buildPromptEvent('accepted');
    const store = await renderStore(() => useInstallPrompt());

    await store.prompt();

    expect(track).toHaveBeenCalledExactlyOnceWith({ outcome: 'accepted' });
  });

  it('should track a dismissed install', async () => {
    globalThis.install = buildPromptEvent('dismissed');
    const store = await renderStore(() => useInstallPrompt());

    await store.prompt();

    expect(track).toHaveBeenCalledExactlyOnceWith({ outcome: 'dismissed' });
  });
});
