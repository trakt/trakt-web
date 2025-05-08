import type { WatchingResponse } from '@trakt/api';
import { MovieHereticResponseMock } from '../../summary/movies/heretic/response/MovieHereticResponseMock.ts';

export const UserWatchingResponseMock: WatchingResponse = {
  'started_at': '2023-10-01T12:00:00.000Z',
  'expires_at': '2023-10-01T13:00:00.000Z',
  'type': 'movie',
  'movie': MovieHereticResponseMock,
  'action': 'checkin',
};
