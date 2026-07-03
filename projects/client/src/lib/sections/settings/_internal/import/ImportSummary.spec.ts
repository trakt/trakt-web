import { fireEvent, render, screen } from '@testing-library/svelte';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import ImportSummary from './ImportSummary.svelte';

vi.mock('$lib/features/auth/stores/useUser.ts', () => ({
  useUser: () => ({
    user: of({ isVip: true }),
    limits: of(null),
  }),
}));

describe('ImportSummary', () => {
  const counts = {
    history: 2,
    watchlist: 3,
    ratings: 1,
  };

  it('should show an enabled switch for every import action with items', () => {
    render(ImportSummary, {
      counts,
      selectedActions: {
        history: true,
        watchlist: true,
        ratings: true,
      },
      source: 'tvtime',
      onactionchange: vi.fn(),
      onstart: vi.fn(),
      onreset: vi.fn(),
    });

    expect(screen.getByRole('switch', { name: '2 items for History' }))
      .toBeChecked();
    expect(screen.getByRole('switch', { name: '3 items for Watchlist' }))
      .toBeChecked();
    expect(screen.getByRole('switch', { name: '1 ratings' })).toBeChecked();
  });

  it('should request skipping an import action when its switch is clicked', async () => {
    const onactionchange = vi.fn();

    render(ImportSummary, {
      counts,
      selectedActions: {
        history: true,
        watchlist: true,
        ratings: true,
      },
      source: 'tvtime',
      onactionchange,
      onstart: vi.fn(),
      onreset: vi.fn(),
    });

    await fireEvent.click(
      screen.getByRole('switch', { name: '3 items for Watchlist' }),
    );

    expect(onactionchange).toHaveBeenCalledWith('watchlist', false);
  });

  it('should disable start import when all import actions are skipped', () => {
    render(ImportSummary, {
      counts,
      selectedActions: {
        history: false,
        watchlist: false,
        ratings: false,
      },
      source: 'tvtime',
      onactionchange: vi.fn(),
      onstart: vi.fn(),
      onreset: vi.fn(),
    });

    expect(
      screen.getByRole('button', {
        name: 'Start importing your data into Trakt.',
      }),
    ).toBeDisabled();
  });
});
