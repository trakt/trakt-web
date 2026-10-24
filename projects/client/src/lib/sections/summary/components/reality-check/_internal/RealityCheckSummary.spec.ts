import { RealityCheckPublicMappedMock } from '$mocks/data/summary/reality-check/mapped/RealityCheckPublicMappedMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import RealityCheckSummary from './RealityCheckSummary.svelte';

describe('RealityCheckSummary', () => {
  it('should lead with the verdict while the story tier stays in the rows', async () => {
    const { container } = renderComponent(RealityCheckSummary, {
      props: {
        realityCheck: {
          ...RealityCheckPublicMappedMock,
          verdict: 'mostly_true',
          story: 'loose',
        },
      },
    });

    expect(
      await screen.findByRole('heading', { name: 'Mostly true' }),
    ).toBeVisible();
    expect(
      container.querySelectorAll('.reality-hero .meter-segment.is-filled'),
    ).toHaveLength(3);
    expect(
      container.querySelector('.reality-row[data-tier="loose"]'),
    ).toHaveTextContent('Loosely based');
  });
});
