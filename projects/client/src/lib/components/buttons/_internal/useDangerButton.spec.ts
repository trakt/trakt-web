import { useMedia } from '$lib/stores/css/useMedia.ts';
import { firstValueFrom, of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { useDangerButton } from './useDangerButton.ts';

vi.mock('$lib/stores/css/useMedia');

describe('useDangerButton', () => {
  it('should return red color when active', async () => {
    vi.mocked(useMedia).mockReturnValue(of(false));
    const button = useDangerButton({ color: 'blue', isActive: true });

    button.onmouseover();
    const color = await firstValueFrom(button.color);
    expect(color).toBe('red');
  });

  it('should return original color when inactive', async () => {
    vi.mocked(useMedia).mockReturnValue(of(false));
    const button = useDangerButton({ color: 'blue', isActive: false });

    button.onmouseover();
    const color = await firstValueFrom(button.color);
    expect(color).toBe('blue');
  });

  it('should handle touch devices', async () => {
    vi.mocked(useMedia).mockReturnValue(of(true));
    const button = useDangerButton({ color: 'blue', isActive: true });

    const color = await firstValueFrom(button.color);
    expect(color).toBe('blue');
  });

  it('should return correct variant based active state', () => {
    vi.mocked(useMedia).mockReturnValue(of(false));
    const button = useDangerButton({ color: 'blue', isActive: true });

    expect(button.variant).toBe('primary');
  });

  it('should handle focus events', async () => {
    vi.mocked(useMedia).mockReturnValue(of(false));
    const button = useDangerButton({ color: 'blue', isActive: true });

    button.onfocusin();
    let color = await firstValueFrom(button.color);
    expect(color).toBe('red');

    await button.onfocusout();
    color = await firstValueFrom(button.color);
    expect(color).toBe('blue');
  });
});
