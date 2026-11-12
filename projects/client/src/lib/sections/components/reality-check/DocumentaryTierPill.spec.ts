import type { DocumentaryTier } from '$lib/requests/models/DocumentaryTier.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import DocumentaryTierPill from './DocumentaryTierPill.svelte';

describe('DocumentaryTierPill', () => {
  it.each<[DocumentaryTier, string]>([
    ['none', 'No disputes found'],
    ['minor', 'Minor points disputed'],
    ['central', 'Central claims disputed'],
    ['wide', 'Widely disputed'],
    ['not_enough', 'Not enough sources'],
  ])('should name the %s tier "%s"', async (tier, label) => {
    const { container } = renderComponent(DocumentaryTierPill, {
      props: { tier },
    });

    expect(await screen.findByText(label)).toBeVisible();
    expect(
      container.querySelector('.trakt-documentary-tier-pill'),
    ).toHaveAttribute('data-tier', tier);
  });

  it('should lead with a dot and no segment meter', async () => {
    const { container } = renderComponent(DocumentaryTierPill, {
      props: { tier: 'central' },
    });

    await screen.findByText('Central claims disputed');

    expect(container.querySelector('.pill-dot')).toBeInTheDocument();
    expect(container.querySelector('.trakt-segment-meter')).toBeNull();
  });

  it('should render the large size on request', async () => {
    const { container } = renderComponent(DocumentaryTierPill, {
      props: { tier: 'wide', size: 'large' },
    });

    await screen.findByText('Widely disputed');

    expect(
      container.querySelector('.trakt-documentary-tier-pill'),
    ).toHaveAttribute('data-size', 'large');
  });
});
