import { delay } from '$lib/utils/timing/delay.ts';
import { time } from '$lib/utils/timing/time.ts';
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import BaseSplashscreen from './BaseSplashscreen.svelte';

const children = createRawSnippet(() => ({ render: () => '<span></span>' }));

describe('BaseSplashscreen', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-seasonal-cover');
  });

  it('should hide the seasonal cover after the fade when the browser has no animations api', async () => {
    document.documentElement.setAttribute('data-seasonal-cover', '');
    expect(HTMLElement.prototype.getAnimations).toBeUndefined();

    render(BaseSplashscreen, {
      props: { children, hasSplashScreen: true, onDismiss: vi.fn() },
    });
    await delay(time.seconds(0.1));
    expect(document.documentElement.hasAttribute('data-seasonal-cover')).toBe(
      true,
    );

    await vi.waitFor(() =>
      expect(document.documentElement.hasAttribute('data-seasonal-cover')).toBe(
        false,
      ),
    );
  });
});
