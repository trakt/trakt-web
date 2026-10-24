import { RealityCheckVipMappedMock } from '$mocks/data/summary/reality-check/mapped/RealityCheckVipMappedMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import RealityCheckDetail from './RealityCheckDetail.svelte';

const detail = RealityCheckVipMappedMock.detail!;

describe('RealityCheckDetail', () => {
  it('should render the breakdown and the claims as definition pairs', async () => {
    const { container } = renderComponent(RealityCheckDetail, {
      props: { detail },
    });

    expect(await screen.findByText('The real story')).toBeVisible();
    expect(
      container.querySelector('.reality-breakdown [data-spacing="relaxed"]'),
    ).not.toBeNull();
    expect(container.querySelectorAll('dl dt')).toHaveLength(
      detail.claims.length * 2,
    );
  });

  it('should not render a sources section', async () => {
    const { container } = renderComponent(RealityCheckDetail, {
      props: { detail },
    });

    await screen.findByText('The real story');

    expect(screen.queryByText('Sources')).toBeNull();
    expect(container.querySelector('.reality-sources')).toBeNull();
  });
});
