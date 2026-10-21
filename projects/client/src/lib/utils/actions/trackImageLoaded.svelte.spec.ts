import { describe, expect, it } from 'vitest';
import { trackImageLoaded } from './trackImageLoaded.ts';

describe('action: trackImageLoaded', () => {
  it('should not throw when the image loads while Svelte derives a value', () => {
    const node = document.createElement('img');
    let isLoaded = $state<boolean | null>(null);

    const cleanup = $effect.root(() => {
      trackImageLoaded(node, {
        src: 'poster.webp',
        onLoaded: (loaded) => (isLoaded = loaded),
      });
    });

    const derived = $derived.by(() => {
      node.dispatchEvent(new Event('load'));
      return true;
    });

    expect(() => derived).not.toThrow();
    expect(isLoaded).toBe(false);
    cleanup();
  });
});
