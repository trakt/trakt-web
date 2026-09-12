import { afterEach, beforeEach } from 'vitest';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { EpisodeSiloPeopleMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloPeopleMappedMock.ts';
import { ShowSiloSplitPeopleMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloSplitPeopleMappedMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import DrawerCastSection from './DrawerCastSection.svelte';

describe('DrawerCastSection', () => {
  it('groups episode credits and searches supporting cast from the crew view', async () => {
    const user = userEvent.setup();
    renderComponent(DrawerCastSection, {
      props: { crew: EpisodeSiloPeopleMappedMock, type: 'episode' },
    });

    expect(await screen.findByRole('list', { name: /^Main Cast/ }))
      .toBeInTheDocument();
    expect(
      within(screen.getByRole('list', { name: 'Supporting Cast 1 person' }))
        .getByText('Sophie Thompson'),
    ).toBeInTheDocument();
    expect(screen.queryByText('2 eps.')).not.toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: 'Crew' }));
    expect(screen.queryByText('Sophie Thompson')).not.toBeInTheDocument();

    const search = screen.getByRole('searchbox', { name: 'Search people' });
    await user.type(search, 'Sophie');
    expect(screen.getByRole('list', { name: 'Supporting Cast 1 person' }))
      .toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /^Main Cast/ })).not
      .toBeInTheDocument();

    await user.clear(search);
    expect(screen.queryByText('Sophie Thompson')).not.toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Crew' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('labels supporting cast as Cast when the main cast is unavailable', async () => {
    renderComponent(DrawerCastSection, {
      props: {
        crew: { ...EpisodeSiloPeopleMappedMock, cast: [] },
        type: 'episode',
      },
    });

    expect(await screen.findByRole('list', { name: 'Cast 1 person' }))
      .toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Main Cast|Supporting Cast/ }))
      .not.toBeInTheDocument();
  });

  it('groups season cast while keeping episode counts', async () => {
    renderComponent(DrawerCastSection, {
      props: { crew: ShowSiloSplitPeopleMappedMock, type: 'show' },
    });

    expect(await screen.findByRole('list', { name: /^Main Cast/ }))
      .toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Supporting Cast 1 person' }))
      .toBeInTheDocument();
    expect(screen.getByText('2 eps.')).toBeInTheDocument();
    expect(screen.getByText('Rebecca Ferguson')).toBeInTheDocument();
    expect(screen.getByText('Sophie Thompson')).toBeInTheDocument();
  });
});

it('shows one full cast list without group headings when the flag is off', async () => {
  localStorage.setItem(
    'trakt-feature-flags',
    JSON.stringify({ 'split-cast': false }),
  );
  renderComponent(DrawerCastSection, {
    props: { crew: EpisodeSiloPeopleMappedMock, type: 'episode' },
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
