import { ShowSiloPeopleMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloPeopleMappedMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen, within } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import ShowCastDrawerHost from './ShowCastDrawerHost.svelte';

describe('ShowCastDrawerHost', () => {
  it('should load split credits when opened with the full show-page cast', async () => {
    Element.prototype.scrollTo = vi.fn();
    renderComponent(ShowCastDrawerHost, {
      props: {
        slug: ShowSiloResponseMock.ids.slug,
        crew: ShowSiloPeopleMappedMock,
        onClose: vi.fn(),
      },
    });

    const guests = await screen.findByRole('list', {
      name: 'Supporting Cast 1 person',
    });
    expect(within(guests).getByText('Sophie Thompson')).toBeInTheDocument();
    expect(
      within(screen.getByRole('list', { name: /^Main Cast/ }))
        .queryByText('Sophie Thompson'),
    ).not.toBeInTheDocument();
  });
});
