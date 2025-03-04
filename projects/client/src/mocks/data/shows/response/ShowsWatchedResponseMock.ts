import { ShowDevsResponseMock } from '$mocks/data/summary/shows/devs/ShowDevsResponseMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import type { ShowWatchedResponse } from '@trakt/api';

export const ShowsWatchedResponseMock: ShowWatchedResponse[] = [
  {
    watcher_count: 127434,
    play_count: 1,
    collected_count: 1,
    collector_count: 1,
    show: ShowSiloResponseMock,
  },
  {
    watcher_count: 12,
    play_count: 12,
    collected_count: 13,
    collector_count: 14,
    show: ShowDevsResponseMock,
  },
];
