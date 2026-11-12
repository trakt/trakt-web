import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import DocumentaryCheckUpsell from './DocumentaryCheckUpsell.svelte';

const { track } = vi.hoisted(() => ({ track: vi.fn() }));

vi.mock('$lib/features/analytics/useTrack.ts', () => ({
  useTrack: () => ({ track }),
}));

describe('DocumentaryCheckUpsell', () => {
  afterEach(() => {
    track.mockClear();
  });

  it('should track the upsell under the Reality Check source', async () => {
    const user = userEvent.setup();
    renderComponent(DocumentaryCheckUpsell, { props: {} });

    await user.click(await screen.findByRole('link'));

    expect(track).toHaveBeenCalledWith({ source: 'reality-check' });
  });

  it('should hide the sample disputes from assistive tech and input', async () => {
    const { container } = renderComponent(DocumentaryCheckUpsell, {
      props: {},
    });

    await screen.findByRole('link');

    const preview = container.querySelector('.documentary-preview');
    expect(preview).toHaveAttribute('aria-hidden', 'true');
    expect(preview).toHaveAttribute('inert');
    expect(preview?.querySelectorAll('.dispute').length).toBeGreaterThan(0);
  });
});
