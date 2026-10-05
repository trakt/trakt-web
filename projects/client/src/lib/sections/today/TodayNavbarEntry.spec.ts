import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen, waitFor, within } from '@testing-library/svelte';
import { beforeEach, describe, expect, it } from 'vitest';
import TodayNavbarEntry from './TodayNavbarEntry.svelte';
import { useTodaySeenStories } from './useTodaySeenStories.ts';

const LINK_NAME = "Open today's stories";

describe('TodayNavbarEntry', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it('should invite the user to open today with the number of new stories', async () => {
    renderComponent(TodayNavbarEntry, { props: {} });

    const link = await screen.findByRole('link', { name: LINK_NAME });

    expect(within(link).getByText('Today')).toBeInTheDocument();
    expect(within(link).getByText('2')).toBeInTheDocument();
    expect(link.closest('.trakt-today-navbar-entry')).toHaveAttribute(
      'data-seen',
      'false',
    );
  });

  it('should open the newest story that was not seen yet', async () => {
    renderComponent(TodayNavbarEntry, { props: {} });

    const link = await screen.findByRole('link', { name: LINK_NAME });

    await waitFor(() => {
      expect(link.getAttribute('href')).toContain(
        `story=show-${ShowSiloMappedMock.id}`,
      );
    });
  });

  it('should be quiet once every story was seen', async () => {
    const { markSeen } = useTodaySeenStories();
    markSeen(`movie-${MovieHereticMappedMock.id}`);
    markSeen(`show-${ShowSiloMappedMock.id}`);

    renderComponent(TodayNavbarEntry, { props: {} });

    const link = await screen.findByRole('link', { name: LINK_NAME });

    expect(link.closest('.trakt-today-navbar-entry')).toHaveAttribute(
      'data-seen',
      'true',
    );
    expect(within(link).queryByText('2')).not.toBeInTheDocument();
  });
});
