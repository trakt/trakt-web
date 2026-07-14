import { fireEvent, render, screen } from '@testing-library/svelte';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import type { EpisodeMatchMode } from '../../import/ImportTypes.ts';
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
    list: 1,
  };

  const allSelected = {
    history: true,
    watchlist: true,
    ratings: true,
    list: true,
  };

  function baseProps(overrides: Record<string, unknown> = {}) {
    return {
      counts,
      selectedActions: allSelected,
      source: 'tvtime' as const,
      episodeMatch: 'id' as EpisodeMatchMode,
      showMatchToggle: false,
      onactionchange: vi.fn(),
      onmatchchange: vi.fn(),
      onstart: vi.fn(),
      onreset: vi.fn(),
      ...overrides,
    };
  }

  it('should show an enabled switch for every import action with items', () => {
    render(ImportSummary, baseProps());

    expect(screen.getByRole('switch', { name: '2 items for History' }))
      .toBeChecked();
    expect(screen.getByRole('switch', { name: '3 items for Watchlist' }))
      .toBeChecked();
    expect(screen.getByRole('switch', { name: '1 ratings' })).toBeChecked();
    expect(screen.getByRole('switch', { name: '1 list items' }))
      .toBeChecked();
  });

  it('should request skipping an import action when its switch is clicked', async () => {
    const onactionchange = vi.fn();

    render(ImportSummary, baseProps({ onactionchange }));

    await fireEvent.click(
      screen.getByRole('switch', { name: '3 items for Watchlist' }),
    );

    expect(onactionchange).toHaveBeenCalledWith('watchlist', false);
  });

  it('should disable start import when all import actions are skipped', () => {
    render(
      ImportSummary,
      baseProps({
        selectedActions: {
          history: false,
          watchlist: false,
          ratings: false,
          list: false,
        },
      }),
    );

    expect(
      screen.getByRole('button', {
        name: 'Start importing your data into Trakt.',
      }),
    ).toBeDisabled();
  });

  it('should not render the match toggle when there are no episodes', () => {
    render(ImportSummary, baseProps({ showMatchToggle: false }));

    expect(
      screen.queryByRole('switch', {
        name: 'Match episodes by season and episode number',
      }),
    ).toBeNull();
  });

  it('should request positional matching when the match toggle is turned on', async () => {
    const onmatchchange = vi.fn();

    render(
      ImportSummary,
      baseProps({ showMatchToggle: true, episodeMatch: 'id', onmatchchange }),
    );

    await fireEvent.click(
      screen.getByRole('switch', {
        name: 'Match episodes by season and episode number',
      }),
    );

    expect(onmatchchange).toHaveBeenCalledWith('positional');
  });
});
