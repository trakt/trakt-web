import type { MediaPlays } from '$lib/requests/models/MediaPlays.ts';

export const WatchedShowPlaysMappedMock: MediaPlays[] = [
  {
    id: 4406655,
    plays: [
      { id: 8001, watchedAt: new Date('2024-02-20T20:00:00.000Z') },
      { id: 8002, watchedAt: new Date('2024-01-05T20:00:00.000Z') },
    ],
  },
  {
    id: 4406656,
    plays: [
      { id: 8003, watchedAt: new Date('2024-02-21T20:00:00.000Z') },
    ],
  },
  {
    id: 11106613,
    plays: [
      { id: 8004, watchedAt: new Date('2024-05-10T22:00:00.000Z') },
    ],
  },
];
