import { http, HttpResponse } from 'msw';

import { EpisodeSiloResponseMock } from '../data/summary/episodes/silo/response/EpisodeSiloResponseMock.ts';
import { EpisodeSiloWatchNowResponseMock } from '../data/summary/episodes/silo/response/EpisodeSiloWatchNowResponseMock.ts';

export const episodes = [
  http.get(
    `http://localhost/episodes/${EpisodeSiloResponseMock.ids.trakt}/watchnow/*`,
    () => {
      return HttpResponse.json(EpisodeSiloWatchNowResponseMock);
    },
  ),
];
