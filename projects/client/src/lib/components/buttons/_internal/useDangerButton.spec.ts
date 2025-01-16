import { useMedia } from '$lib/stores/css/useMedia';
import { renderStore } from '$test/beds/store/renderStore';
import { get, writable } from 'svelte/store';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDangerButton } from './useDangerButton';

vi.mock('$lib/stores/css/useMedia');

describe('useDangerButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return red color when active', async () => {
    vi.mocked(useMedia).mockReturnValue(writable(false));
    const button = await renderStore(() =>
      useDangerButton({ color: 'blue', isActive: true })
    );

    button.onmouseover();
    expect(get(button.color)).toBe('red');
  });

  it('should return original color when inactive', async () => {
    vi.mocked(useMedia).mockReturnValue(writable(false));
    const button = await renderStore(() =>
      useDangerButton({ color: 'blue', isActive: false })
    );

    button.onmouseover();
    expect(get(button.color)).toBe('blue');
  });

  it('should handle touch devices', async () => {
    vi.mocked(useMedia).mockReturnValue(writable(true));
    const button = await renderStore(() =>
      useDangerButton({ color: 'blue', isActive: true })
    );

    expect(get(button.color)).toBe('red');
  });

  it('should return correct variant based on touch and active state', async () => {
    vi.mocked(useMedia).mockReturnValue(writable(false));
    const button = await renderStore(() =>
      useDangerButton({ color: 'blue', isActive: true })
    );

    expect(get(button.variant)).toBe('primary');
  });

  it('should handle focus events', async () => {
    vi.mocked(useMedia).mockReturnValue(writable(false));
    const button = await renderStore(() =>
      useDangerButton({ color: 'blue', isActive: true })
    );

    button.onfocusin();
    expect(get(button.color)).toBe('red');

    button.onfocusout();
    expect(get(button.color)).toBe('blue');
  });
});
