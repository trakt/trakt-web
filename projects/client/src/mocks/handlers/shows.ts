import { http, HttpResponse } from 'msw';

import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { OfficialListsResponseMock } from '$mocks/data/lists/response/OfficialListsResponseMock.ts';
import { EpisodeSiloCommentsResponseMock } from '$mocks/data/summary/episodes/silo/response/EpisodeSiloCommentsResponseMock.ts';
import { EpisodeSiloPeopleResponseMock } from '$mocks/data/summary/episodes/silo/response/EpisodeSiloPeopleResponseMock.ts';
import { EpisodeSiloWatchNowResponseMock } from '$mocks/data/summary/episodes/silo/response/EpisodeSiloWatchNowResponseMock.ts';
import { ShowSiloCommentsResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloCommentsResponseMock.ts';
import { ShowSiloSentimentResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloSentimentResponseMock.ts';
import { ShowsAnticipatedResponseMock } from '../data/shows/response/ShowsAnticipatedResponseMock.ts';
import { ShowsPopularResponseMock } from '../data/shows/response/ShowsPopularResponseMock.ts';
import { ShowsTrendingResponseMock } from '../data/shows/response/ShowsTrendingResponseMock.ts';
import { MediaWatchingResponseMock } from '../data/summary/common/response/MediaWatchingResponseMock.ts';
import { EpisodeSiloRatingsResponseMock } from '../data/summary/episodes/silo/response/EpisodeSiloRatingsResponseMock.ts';
import { EpisodeSiloResponseMock } from '../data/summary/episodes/silo/response/EpisodeSiloResponseMock.ts';
import { EpisodeSiloStatsResponseMock } from '../data/summary/episodes/silo/response/EpisodeSiloStatsResponseMock.ts';
import { EpisodeSiloTranslationsResponseMock } from '../data/summary/episodes/silo/response/EpisodeSiloTranslationsResponseMock.ts';
import { ShowSiloPeopleResponseMock } from '../data/summary/shows/silo/response/ShowSiloPeopleResponseMock.ts';
import { ShowSiloProgressResponseMock } from '../data/summary/shows/silo/response/ShowSiloProgressResponseMock.ts';
import { ShowSiloRatingsResponseMock } from '../data/summary/shows/silo/response/ShowSiloRatingsResponseMock.ts';
import { ShowSiloRelatedResponseMock } from '../data/summary/shows/silo/response/ShowSiloRelatedResponseMock.ts';
import { ShowSiloResponseMock } from '../data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import { ShowSiloSeasonEpisodesResponseMock } from '../data/summary/shows/silo/response/ShowSiloSeasonEpisodesResponseMock.ts';
import { ShowSiloSeasonsResponseMock } from '../data/summary/shows/silo/response/ShowSiloSeasonsResponseMock.ts';
import { ShowSiloStatsResponseMock } from '../data/summary/shows/silo/response/ShowSiloStatsResponseMock.ts';
import { ShowSiloStudiosResponseMock } from '../data/summary/shows/silo/response/ShowSiloStudiosResponseMock.ts';
import { ShowSiloTranslationsResponseMock } from '../data/summary/shows/silo/response/ShowSiloTranslationsResponseMock.ts';
import { ShowSiloVideoResponseMock } from '../data/summary/shows/silo/response/ShowSiloVideoResponseMock.ts';
import { ShowSiloVideoSeason1ResponseMock } from '../data/summary/shows/silo/response/ShowSiloVideoSeason1ResponseMock.ts';
import { ShowSiloVideoSeason2ResponseMock } from '../data/summary/shows/silo/response/ShowSiloVideoSeason2ResponseMock.ts';
import { ShowSiloWatchNowResponseMock } from '../data/summary/shows/silo/response/ShowSiloWatchNowResponseMock.ts';
import { SiloListsResponseMock } from '../data/summary/shows/silo/response/SiloListsResponseMock.ts';

export const shows = [
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}`,
    () => {
      return HttpResponse.json(ShowSiloResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/translations/en`,
    () => {
      return HttpResponse.json(
        ShowSiloTranslationsResponseMock.get('en'),
      );
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/translations/nl`,
    () => {
      return HttpResponse.json(
        ShowSiloTranslationsResponseMock.get('nl'),
      );
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/translations/ja`,
    () => {
      return HttpResponse.json(
        ShowSiloTranslationsResponseMock.get('ja'),
      );
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/ratings`,
    () => {
      return HttpResponse.json(ShowSiloRatingsResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/stats`,
    () => {
      return HttpResponse.json(ShowSiloStatsResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/watching`,
    () => {
      return HttpResponse.json(MediaWatchingResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/studios`,
    () => {
      return HttpResponse.json(ShowSiloStudiosResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/people`,
    () => {
      return HttpResponse.json(ShowSiloPeopleResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/progress/watched`,
    () => {
      return HttpResponse.json(ShowSiloProgressResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/seasons`,
    () => {
      return HttpResponse.json(ShowSiloSeasonsResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/watchnow/*`,
    () => {
      return HttpResponse.json(ShowSiloWatchNowResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/seasons/${EpisodeSiloResponseMock.season}/episodes/${EpisodeSiloResponseMock.number}/watching`,
    () => {
      return HttpResponse.json(MediaWatchingResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/seasons/${EpisodeSiloResponseMock.season}/episodes/${EpisodeSiloResponseMock.number}/stats`,
    () => {
      return HttpResponse.json(EpisodeSiloStatsResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/seasons/${EpisodeSiloResponseMock.season}/episodes/${EpisodeSiloResponseMock.number}/ratings`,
    () => {
      return HttpResponse.json(EpisodeSiloRatingsResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/seasons/${EpisodeSiloResponseMock.season}/episodes/${EpisodeSiloResponseMock.number}/translations/en`,
    () => {
      return HttpResponse.json(EpisodeSiloTranslationsResponseMock.get('en'));
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/seasons/${EpisodeSiloResponseMock.season}/episodes/${EpisodeSiloResponseMock.number}/translations/nl`,
    () => {
      return HttpResponse.json(EpisodeSiloTranslationsResponseMock.get('nl'));
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/seasons/${EpisodeSiloResponseMock.season}/episodes/${EpisodeSiloResponseMock.number}/comments/likes*`,
    () => {
      return HttpResponse.json(EpisodeSiloCommentsResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/seasons/${EpisodeSiloResponseMock.season}/episodes/${EpisodeSiloResponseMock.number}/people`,
    () => {
      return HttpResponse.json(EpisodeSiloPeopleResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/seasons/${EpisodeSiloResponseMock.season}/episodes/${EpisodeSiloResponseMock.number}/watchnow/*`,
    () => {
      return HttpResponse.json(EpisodeSiloWatchNowResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/seasons/${EpisodeSiloResponseMock.season}/episodes/${EpisodeSiloResponseMock.number}*`,
    () => {
      return HttpResponse.json(EpisodeSiloResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/seasons/${
      assertDefined(ShowSiloSeasonEpisodesResponseMock[0]).season
    }*`,
    () => {
      return HttpResponse.json(ShowSiloSeasonEpisodesResponseMock);
    },
  ),
  http.get(
    'http://localhost/shows/trending*',
    () => {
      return HttpResponse.json(ShowsTrendingResponseMock);
    },
  ),
  http.get(
    'http://localhost/shows/popular*',
    () => {
      return HttpResponse.json(ShowsPopularResponseMock);
    },
  ),
  http.get(
    'http://localhost/shows/anticipated*',
    () => {
      return HttpResponse.json(ShowsAnticipatedResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/related*`,
    () => {
      return HttpResponse.json(ShowSiloRelatedResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/lists/personal/popular*`,
    () => {
      return HttpResponse.json(SiloListsResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/lists/official/popular*`,
    () => {
      return HttpResponse.json(OfficialListsResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/comments/likes*`,
    () => {
      return HttpResponse.json(ShowSiloCommentsResponseMock);
    },
  ),
  http.get(
    `http://localhost/v3/media/show/${ShowSiloResponseMock.ids.slug}/info/0/version/1`,
    () => {
      return HttpResponse.json(ShowSiloSentimentResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/videos`,
    () => {
      return HttpResponse.json(ShowSiloVideoResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/videos`,
    () => {
      return HttpResponse.json(ShowSiloVideoResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/seasons/1/videos`,
    () => {
      return HttpResponse.json(ShowSiloVideoSeason1ResponseMock);
    },
  ),
  http.get(
    `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/seasons/2/videos`,
    () => {
      return HttpResponse.json(ShowSiloVideoSeason2ResponseMock);
    },
  ),
];
