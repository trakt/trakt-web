import { http, HttpResponse } from 'msw';

import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { AllListedShowsResponseMock } from '$mocks/data/lists/response/AllListedShowsResponseMock.ts';
import { ListedMoviesResponseMock } from '$mocks/data/lists/response/ListedMoviesResponseMock.ts';
import { ListedShowsResponseMock } from '$mocks/data/lists/response/ListedShowsResponseMock.ts';
import { HereticListsMappedMock } from '$mocks/data/summary/movies/heretic/mapped/HereticListsMappedMock.ts';
import { SiloListsMappedMock } from '$mocks/data/summary/shows/silo/mapped/SiloListsMappedMock.ts';
import { SiloListsResponseMock } from '$mocks/data/summary/shows/silo/response/SiloListsResponseMock.ts';
import { UserProfileHarryMappedMock } from '$mocks/data/users/mapped/UserProfileHarryMappedMock.ts';
import { CollaborationListsResponseMock } from '$mocks/data/users/response/CollaborationListsResponseMock.ts';
import { ExtendedUserProfileHarryResponseMock } from '$mocks/data/users/response/ExtendedUserProfileHarryResponseMock.ts';
import { PersonalListsResponseMock } from '$mocks/data/users/response/PersonalListsResponseMock.ts';
import { RatedShowsResponseMock } from '$mocks/data/users/response/RatedShowsResponseMock.ts';
import { EpisodeActivityHistoryResponseMock } from '../data/users/response/EpisodeActivityHistoryResponseMock.ts';
import { ExtendedUsersResponseMock } from '../data/users/response/ExtendedUserSettingsResponseMock.ts';
import { FavoritedMoviesResponseMock } from '../data/users/response/FavoritedMoviesResponseMock.ts';
import { FavoritedShowsResponseMock } from '../data/users/response/FavoritedShowsResponseMock.ts';
import { FilterResponseMock } from '../data/users/response/FilterResponseMock.ts';
import { HiddenShowProgressResponseMock } from '../data/users/response/HiddenShowProgressResponseMock.ts';
import { MinimalLikedListsResponseMock } from '../data/users/response/MinimalLikedListsResponseMock.ts';
import { MovieActivityHistoryResponseMock } from '../data/users/response/MovieActivityHistoryResponseMock.ts';
import { RatedEpisodesResponseMock } from '../data/users/response/RatedEpisodesResponseMock.ts';
import { RatedMoviesResponseMock } from '../data/users/response/RatedMoviesResponseMock.ts';
import { ShowActivityHistoryResponseMock } from '../data/users/response/ShowActivityHistoryResponseMock.ts';
import { SocialActivityResponseMock } from '../data/users/response/SocialActivityResponseMock.ts';
import { UserBlockedResponseMock } from '../data/users/response/UserBlockedResponseMock.ts';
import { UserFollowersResponseMock } from '../data/users/response/UserFollowersResponseMock.ts';
import { UserFollowingResponseMock } from '../data/users/response/UserFollowingResponseMock.ts';
import { UserMonthInReviewResponseMock } from '../data/users/response/UserMonthInReviewResponseMock.ts';
import { UserWatchingResponseMock } from '../data/users/response/UserWatchingResponseMock.ts';
import { WatchedMoviesResponseMock } from '../data/users/response/WatchedMoviesResponseMock.ts';
import { WatchedShowsMinimalResponseMock } from '../data/users/response/WatchedShowsMinimalResponseMock.ts';
import { WatchedShowsResponseMock } from '../data/users/response/WatchedShowsResponseMock.ts';
import { WatchlistMinimalResponseMock } from '../data/users/response/WatchlistMinimalResponseMock.ts';
import { WatchlistMoviesResponseMock } from '../data/users/response/WatchlistMoviesResponseMock.ts';
import { WatchlistShowsResponseMock } from '../data/users/response/WatchlistShowsResponseMock.ts';

export const users = [
  http.get('http://localhost/users/settings', () => {
    return HttpResponse.json(ExtendedUsersResponseMock);
  }),
  http.get(
    `http://localhost/users/${
      assertDefined(ExtendedUserProfileHarryResponseMock.ids.slug)
    }`,
    () => {
      return HttpResponse.json(ExtendedUserProfileHarryResponseMock);
    },
  ),
  http.get('http://localhost/users/hidden/progress_watched*', () => {
    return HttpResponse.json(HiddenShowProgressResponseMock);
  }),
  http.get('http://localhost/users/me/watched/shows*', (response) => {
    const { searchParams } = new URL(response.request.url);
    const extended = searchParams.get('extended');
    const page = Number(searchParams.get('page') ?? 1);

    if (page > 1) {
      return HttpResponse.json({});
    }

    return HttpResponse.json(
      extended === 'min'
        ? WatchedShowsMinimalResponseMock
        : WatchedShowsResponseMock,
    );
  }),
  http.get('http://localhost/users/me/watched/movies*', (response) => {
    const { searchParams } = new URL(response.request.url);
    const page = Number(searchParams.get('page') ?? 1);

    if (page > 1) {
      return HttpResponse.json({});
    }

    return HttpResponse.json(WatchedMoviesResponseMock);
  }),
  http.get('http://localhost/users/me/watchlist/movies*', () => {
    return HttpResponse.json(WatchlistMoviesResponseMock);
  }),
  http.get('http://localhost/users/me/watchlist/shows*', () => {
    return HttpResponse.json(WatchlistShowsResponseMock);
  }),
  http.get('http://localhost/v3/users/me/watchlist/minimal', () => {
    return HttpResponse.json(WatchlistMinimalResponseMock);
  }),
  http.get('http://localhost/users/me/ratings/movies', () => {
    return HttpResponse.json(RatedMoviesResponseMock);
  }),
  http.get('http://localhost/users/me/ratings/shows', () => {
    return HttpResponse.json(RatedShowsResponseMock);
  }),
  http.get('http://localhost/users/me/ratings/episodes', () => {
    return HttpResponse.json(RatedEpisodesResponseMock);
  }),
  http.get('http://localhost/users/me/favorites/movies*', () => {
    return HttpResponse.json(FavoritedMoviesResponseMock);
  }),
  http.get('http://localhost/users/me/favorites/shows*', () => {
    return HttpResponse.json(FavoritedShowsResponseMock);
  }),
  http.get('http://localhost/users/me/history/shows*', () => {
    return HttpResponse.json(ShowActivityHistoryResponseMock);
  }),
  http.get('http://localhost/users/me/history/movies*', () => {
    return HttpResponse.json(MovieActivityHistoryResponseMock);
  }),
  http.get('http://localhost/users/me/history/episodes*', () => {
    return HttpResponse.json(EpisodeActivityHistoryResponseMock);
  }),
  http.get('http://localhost/users/me/following/activities', () => {
    return HttpResponse.json(SocialActivityResponseMock);
  }),
  http.get('http://localhost/users/me/lists/collaborations*', () => {
    return HttpResponse.json(CollaborationListsResponseMock);
  }),
  http.get('http://localhost/users/me/lists*', () => {
    return HttpResponse.json(PersonalListsResponseMock);
  }),
  http.get('http://localhost/users/me/watching*', () => {
    return HttpResponse.json(UserWatchingResponseMock);
  }),
  http.get('http://localhost/users/me/mir*', () => {
    return HttpResponse.json(UserMonthInReviewResponseMock);
  }),
  http.get('http://localhost/users/me/following', () => {
    return HttpResponse.json(UserFollowingResponseMock);
  }),
  http.get(
    `http://localhost/users/${UserProfileHarryMappedMock.slug}/lists/${
      assertDefined(SiloListsMappedMock.at(0)).slug
    }`,
    () => {
      return HttpResponse.json(SiloListsResponseMock.at(0));
    },
  ),
  http.get(
    `http://localhost/users/${UserProfileHarryMappedMock.slug}/lists/${
      assertDefined(SiloListsMappedMock.at(0)).slug
    }/items/movie,show*`,
    () => {
      return HttpResponse.json([
        ...ListedShowsResponseMock,
        ...ListedMoviesResponseMock,
      ]);
    },
  ),
  http.get(
    `http://localhost/users/${UserProfileHarryMappedMock.slug}/lists/${
      assertDefined(SiloListsMappedMock.at(0)).slug
    }/items/show*`,
    (response) => {
      const { searchParams } = new URL(response.request.url);
      const limit = searchParams.get('limit');

      const responseMock = limit === 'all'
        ? AllListedShowsResponseMock
        : ListedShowsResponseMock;

      return HttpResponse.json(responseMock);
    },
  ),
  http.get(
    `http://localhost/users/${UserProfileHarryMappedMock.slug}/lists/${
      assertDefined(HereticListsMappedMock.at(0)).slug
    }/items/movie*`,
    () => {
      return HttpResponse.json(ListedMoviesResponseMock);
    },
  ),
  http.get(
    `http://localhost/users/${UserProfileHarryMappedMock.slug}/following`,
    () => {
      return HttpResponse.json(UserFollowingResponseMock);
    },
  ),
  http.get(
    `http://localhost/users/${UserProfileHarryMappedMock.slug}/followers`,
    () => {
      return HttpResponse.json(UserFollowersResponseMock);
    },
  ),
  http.get(
    'http://localhost/users/saved_filters/:section',
    (req) => {
      return HttpResponse.json(
        FilterResponseMock.filter((f) => f.section === req.params.section),
      );
    },
  ),
  http.get('http://localhost/users/likes/lists', () => {
    return HttpResponse.json(MinimalLikedListsResponseMock);
  }),
  http.get('http://localhost/users/blocked', () => {
    return HttpResponse.json(UserBlockedResponseMock);
  }),
  http.post('http://localhost/users/:id/block', () => {
    return new HttpResponse(null, { status: 201 });
  }),
  http.delete('http://localhost/users/:id/block', () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
