import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen, within } from '@testing-library/svelte';
import { beforeEach, describe, expect, it } from 'vitest';
import MixtapeNavbarEntry from './MixtapeNavbarEntry.svelte';

const LINK_NAME = 'Make a mixtape';

describe('MixtapeNavbarEntry', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it('should open the mixtape from the navbar for the browsed media type', async () => {
    renderComponent(MixtapeNavbarEntry, { props: {}, withFilters: true });

    const link = await screen.findByRole('link', { name: LINK_NAME });

    expect(link.getAttribute('href')).toContain(
      '/discover/mixtape?type=movie&source=navbar',
    );
  });

  it('should name the feature on the pill', async () => {
    renderComponent(MixtapeNavbarEntry, { props: {}, withFilters: true });

    const link = await screen.findByRole('link', { name: LINK_NAME });

    expect(within(link).getByText('Mixtape')).toBeInTheDocument();
  });
});
