import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieHereticYouTubeSpecialMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticYouTubeSpecialMappedMock.ts';
import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { MAX_DATE } from '$lib/utils/constants.ts';
import { ExtendedUsersResponseMock } from '$mocks/data/users/response/ExtendedUserSettingsResponseMock.ts';
import { server } from '$mocks/server.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen } from '@testing-library/svelte';
import { http, HttpResponse } from 'msw';
import { afterEach, describe, expect, it } from 'vitest';
import WhereToWatchList from './WhereToWatchList.svelte';

const FUTURE = new Date('2099-12-18T00:00:00.000Z');

const unreleasedMovie = {
  ...MovieHereticMappedMock,
  status: 'post production',
  airDate: FUTURE,
  effectiveReleaseDate: FUTURE,
} as const;

const unreleasedShow = {
  ...ShowSiloMappedMock,
  status: 'planned',
  airDate: FUTURE,
  effectiveReleaseDate: FUTURE,
} as const;

function asDirector() {
  setAuthorization(true);
  server.use(
    http.get('http://localhost/users/settings', () =>
      HttpResponse.json({
        ...ExtendedUsersResponseMock,
        user: { ...ExtendedUsersResponseMock.user, director: true },
      }),
    ),
  );
}

describe('WhereToWatchList', () => {
  afterEach(() => {
    setAuthorization(false);
  });

  it('should stay hidden for an unreleased movie outside the insights card preview', async () => {
    const { container } = renderComponent(WhereToWatchList, {
      props: { type: 'movie', media: unreleasedMovie },
    });

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(container.querySelector('.trakt-where-to-watch-list')).toBeNull();
  });

  it('should keep its slot with the release date for an unreleased movie', async () => {
    asDirector();
    const { container } = renderComponent(WhereToWatchList, {
      props: { type: 'movie', media: unreleasedMovie },
    });

    expect(await screen.findByText('Not streaming yet')).toBeVisible();
    expect(screen.getByText(/^Releases .*2099/)).toBeVisible();
    expect(
      container.querySelector('.trakt-where-to-watch-list'),
    ).toBeInTheDocument();
  });

  it('should say not streaming yet for an unreleased movie that has a service tile', async () => {
    asDirector();
    renderComponent(WhereToWatchList, {
      props: {
        type: 'movie',
        media: unreleasedMovie,
        youtubeSpecial: MovieHereticYouTubeSpecialMappedMock,
      },
    });

    expect(await screen.findByText('Not streaming yet')).toBeVisible();
  });

  it('should say TBA when the release date is unknown', async () => {
    asDirector();
    const date = MAX_DATE;
    renderComponent(WhereToWatchList, {
      props: {
        type: 'movie',
        media: {
          ...unreleasedMovie,
          airDate: date,
          effectiveReleaseDate: date,
        },
      },
    });

    expect(await screen.findByText('Not streaming yet')).toBeVisible();
    expect(screen.getByText('TBA')).toBeVisible();
  });

  it('should keep its slot for an unreleased show', async () => {
    asDirector();
    renderComponent(WhereToWatchList, {
      props: { type: 'show', media: unreleasedShow },
    });

    expect(await screen.findByText('Not streaming yet')).toBeVisible();
  });

  it('should not offer the drilldown while nothing streams yet', async () => {
    asDirector();
    renderComponent(WhereToWatchList, {
      props: { type: 'movie', media: unreleasedMovie },
    });

    await screen.findByText('Not streaming yet');
    expect(screen.queryByRole('link', { name: /where to watch/i })).toBeNull();
  });

  it('should say there are no services for a released movie', async () => {
    renderComponent(WhereToWatchList, {
      props: { type: 'movie', media: MovieHereticMappedMock },
    });

    expect(await screen.findByText('No services')).toBeVisible();
    expect(screen.queryByText('Not streaming yet')).toBeNull();
  });

  it('should stay hidden for an unaired episode', () => {
    const { container } = renderComponent(WhereToWatchList, {
      props: {
        type: 'episode',
        media: unreleasedShow,
        episode: {
          ...EpisodeSiloMappedMock,
          airDate: FUTURE,
          effectiveReleaseDate: FUTURE,
        },
      },
    });

    expect(container.querySelector('.trakt-where-to-watch-list')).toBeNull();
    expect(screen.queryByText('Not streaming yet')).toBeNull();
  });
});
