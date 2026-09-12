import { afterEach, beforeEach } from 'vitest';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
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

it('keeps full credits in the show drawer when the flag is off', async () => {
  localStorage.setItem(
    'trakt-feature-flags',
    JSON.stringify({ 'split-cast': false }),
  );
  renderComponent(ShowCastDrawerHost, {
    props: {
      slug: ShowSiloResponseMock.ids.slug,
      crew: ShowSiloPeopleMappedMock,
      onClose: vi.fn(),
    },
  });
  expect(await screen.findByText('Sophie Thompson')).toBeInTheDocument();
  expect(screen.getAllByRole('list')).toHaveLength(1);
  expect(screen.queryByRole('heading', { name: /Main Cast|Supporting Cast/ }))
    .not.toBeInTheDocument();
});

beforeEach(() => {
  localStorage.setItem(
    'trakt-feature-flags',
    JSON.stringify({ 'split-cast': true }),
  );
  setAuthorization(true);
});
afterEach(() => {
  setAuthorization(false);
  localStorage.removeItem('trakt-feature-flags');
});
