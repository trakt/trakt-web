import { mobileAppleVisualViewportHack } from '$lib/components/dialogs/_internal/mobileAppleVisualViewportHack.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { waitFor } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('mobileAppleVisualViewportHack', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should set up viewport hack for mobile apple devices', () => {
    const platformSpy = vi.spyOn(globalThis.navigator, 'platform', 'get');
    platformSpy.mockReturnValue('iPhone');

    const dialog = document.createElement('dialog');
    const visualViewport = {
      height: 800,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    vi.stubGlobal('visualViewport', visualViewport);

    const action = mobileAppleVisualViewportHack(dialog);

    expect(visualViewport.addEventListener).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
    );

    action.destroy();

    expect(visualViewport.removeEventListener).toHaveBeenCalled();
    expect(document.documentElement.style.getPropertyValue('--dialog-height'))
      .toBe('100dvh');
  });

  it('should not set up viewport hack for non-apple devices', () => {
    const platformSpy = vi.spyOn(globalThis.navigator, 'platform', 'get');
    platformSpy.mockReturnValue('Android');

    const dialog = document.createElement('dialog');
    const visualViewport = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    vi.stubGlobal('visualViewport', visualViewport);

    mobileAppleVisualViewportHack(dialog);

    expect(visualViewport.addEventListener).not.toHaveBeenCalled();
  });

  it('should update dialog height and scroll on viewport resize', async () => {
    const platformSpy = vi.spyOn(globalThis.navigator, 'platform', 'get');
    platformSpy.mockReturnValue('iPhone');

    const dialog = document.createElement('dialog');
    dialog.open = true;
    const scrollToSpy = vi.fn();

    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();

    const visualViewport = {
      height: 800,
      addEventListener,
      removeEventListener,
    };

    vi.stubGlobal('visualViewport', visualViewport);
    vi.spyOn(window, 'scrollTo').mockImplementation(scrollToSpy);

    const action = mobileAppleVisualViewportHack(dialog);

    const calls = addEventListener.mock.calls;
    const resizeHandler = assertDefined(calls[0])[1];
    resizeHandler();

    await waitFor(() => {
      expect(document.documentElement.style.getPropertyValue('--dialog-height'))
        .toBe('800px');
      expect(scrollToSpy).toHaveBeenCalledWith({
        left: 0,
        top: 0,
        behavior: 'instant',
      });
    });

    action.destroy();
  });
});
