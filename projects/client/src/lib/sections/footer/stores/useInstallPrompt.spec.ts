import { renderStore } from '$test/beds/store/renderStore.ts';
import { afterEach, describe, expect, it } from 'vitest';
import { useInstallPrompt } from './useInstallPrompt.ts';

function buildPromptEvent() {
  const event = new Event('beforeinstallprompt') as BeforeInstallPromptEvent;
  event.prompt = () => Promise.resolve({ outcome: 'accepted' as const });
  return event;
}

async function renderInstallPrompt() {
  const store = await renderStore(() => useInstallPrompt());

  let current: BeforeInstallPromptEvent | null = null;
  store.subscribe((value) => current = value);

  return () => current;
}

describe('store: useInstallPrompt', () => {
  afterEach(() => {
    globalThis.install = null;
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
});
