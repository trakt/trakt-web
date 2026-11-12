import { DocumentaryCheckVipMappedMock } from '$mocks/data/summary/documentary-check/mapped/DocumentaryCheckVipMappedMock.ts';
import { RealityCheckPublicMappedMock } from '$mocks/data/summary/reality-check/mapped/RealityCheckPublicMappedMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen, waitFor } from '@testing-library/svelte';
import { beforeEach, describe, expect, it } from 'vitest';
import RealityCheckTab from './RealityCheckTab.svelte';

describe('RealityCheckTab', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it('should render the loading skeleton while the check loads', async () => {
    const { container } = renderComponent(RealityCheckTab, {
      props: { realityCheck: undefined },
    });

    await waitFor(() =>
      expect(
        container.querySelector('.trakt-reality-check-skeleton'),
      ).toBeInTheDocument(),
    );
    expect(container.querySelector('.trakt-documentary-check-tab')).toBeNull();
    expect(container.querySelector('.trakt-reality-check-tab')).toBeNull();
  });

  it('should render the documentary variant for a documentary check', async () => {
    const { container } = renderComponent(RealityCheckTab, {
      props: { realityCheck: DocumentaryCheckVipMappedMock },
    });

    expect(await screen.findByText('Disputed claims')).toBeVisible();
    expect(container.querySelector('.trakt-reality-check-skeleton')).toBeNull();
    expect(container.querySelector('.trakt-reality-check-summary')).toBeNull();
  });

  it('should keep the story variant for a story check', async () => {
    const { container } = renderComponent(RealityCheckTab, {
      props: { realityCheck: RealityCheckPublicMappedMock },
    });

    expect(
      await screen.findByRole('heading', { name: 'Loosely based' }),
    ).toBeVisible();
    expect(container.querySelector('.trakt-documentary-check-tab')).toBeNull();
  });
});
