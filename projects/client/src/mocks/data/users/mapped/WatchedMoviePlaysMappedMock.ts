import type { MediaPlays } from '$lib/requests/models/MediaPlays.ts';

export const WatchedMoviePlaysMappedMock: MediaPlays[] = [
  {
    id: 190430,
    plays: [
      { id: 9001, watchedAt: new Date('2024-03-01T20:00:00.000Z') },
      { id: 9002, watchedAt: new Date('2024-01-15T21:30:00.000Z') },
      { id: 9003, watchedAt: new Date('2024-02-10T19:00:00.000Z') },
    ],
  },
  {
    id: 294963,
    plays: [
      { id: 9004, watchedAt: new Date('2024-04-05T18:00:00.000Z') },
    ],
  },
];
