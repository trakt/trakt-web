import { EpisodeSiloPeopleMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloPeopleMappedMock.ts';
import { ShowSiloSplitPeopleMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloSplitPeopleMappedMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen, waitFor, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import DrawerCastSection from './DrawerCastSection.svelte';

describe('DrawerCastSection', () => {
  it('should toggle between main cast, supporting cast and crew', async () => {
    const user = userEvent.setup();
    renderComponent(DrawerCastSection, {
      props: { crew: EpisodeSiloPeopleMappedMock, type: 'episode' },
    });

    expect(await screen.findByRole('list', { name: /^Main Cast/ }))
      .toBeInTheDocument();
    expect(screen.queryByText('Sophie Thompson')).not.toBeInTheDocument();
    expect(screen.queryByText('2 eps.')).not.toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Main Cast' })).toHaveAttribute(
      'aria-checked',
      'true',
    );

    await user.click(screen.getByRole('radio', { name: 'Supporting Cast' }));
    expect(
      within(screen.getByRole('list', { name: 'Supporting Cast 1 person' }))
        .getByText('Sophie Thompson'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('list', { name: /^Main Cast/ })).not
      .toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: 'Crew' }));
    expect(screen.queryByText('Sophie Thompson')).not.toBeInTheDocument();
    expect(screen.getByRole('list', { name: /^Crew \d+ (person|people)$/ }))
      .toBeInTheDocument();

    const search = screen.getByRole('searchbox', { name: 'Search people' });
    await user.type(search, 'Sophie');
    expect(screen.getByRole('list', { name: 'Supporting Cast 1 person' }))
      .toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /^Main Cast/ })).not
      .toBeInTheDocument();
    expect(screen.queryByRole('radio')).not.toBeInTheDocument();

    await user.clear(search);
    expect(screen.queryByText('Sophie Thompson')).not.toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Crew' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('should label supporting cast as Cast when the main cast is unavailable', async () => {
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

  it('should group season cast while keeping episode counts', async () => {
    const user = userEvent.setup();
    renderComponent(DrawerCastSection, {
      props: { crew: ShowSiloSplitPeopleMappedMock, type: 'show' },
    });

    expect(await screen.findByRole('list', { name: /^Main Cast/ }))
      .toBeInTheDocument();
    expect(screen.getByText('Rebecca Ferguson')).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: 'Supporting Cast' }));
    expect(screen.getByRole('list', { name: 'Supporting Cast 1 person' }))
      .toBeInTheDocument();
    expect(screen.getByText('Sophie Thompson')).toBeInTheDocument();
    expect(screen.getByText('2 eps.')).toBeInTheDocument();
  });

  it('should only offer Cast and Crew when there is no supporting cast', async () => {
    renderComponent(DrawerCastSection, {
      props: {
        crew: { ...EpisodeSiloPeopleMappedMock, guestStars: [] },
        type: 'episode',
      },
    });

    expect(await screen.findByRole('list', { name: /^Cast/ }))
      .toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Cast' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Crew' })).toBeInTheDocument();
    expect(screen.queryByRole('radio', { name: 'Supporting Cast' })).not
      .toBeInTheDocument();
  });
});

it('should reserve a group heading in the loading skeleton', async () => {
  renderComponent(DrawerCastSection, {
    props: {
      crew: EpisodeSiloPeopleMappedMock,
      type: 'episode',
      isLoading: true,
    },
  });
  await waitFor(() => {
    expect(document.querySelector('.credit-skeleton-header')).not.toBeNull();
  });
});
