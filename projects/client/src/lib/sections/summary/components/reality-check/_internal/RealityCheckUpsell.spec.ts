import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import RealityCheckUpsell from './RealityCheckUpsell.svelte';

const { track } = vi.hoisted(() => ({ track: vi.fn() }));

vi.mock('$lib/features/analytics/useTrack.ts', () => ({
  useTrack: () => ({ track }),
}));

describe('RealityCheckUpsell', () => {
  afterEach(() => {
    track.mockClear();
  });

  it('should track the upsell under its own source', async () => {
    const user = userEvent.setup();
    renderComponent(RealityCheckUpsell, { props: {} });

    await user.click(await screen.findByRole('link'));

    expect(track).toHaveBeenCalledWith({ source: 'reality-check' });
  });
});
