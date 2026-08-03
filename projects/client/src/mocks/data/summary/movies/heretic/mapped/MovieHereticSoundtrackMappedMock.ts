import type { SoundtrackTrack } from '$lib/requests/models/SoundtrackTrack.ts';

export const MovieHereticSoundtrackMappedMock: SoundtrackTrack[] = [
  {
    key: 'movie_soundtrack_0',
    title: 'Prologue',
    performer: 'Chris Bacon',
    spotifyId: '1aBcDeFgHiJkLmNoPqRsTu',
    matchedOn: 'credit',
    position: 0,
  },
  {
    key: 'movie_soundtrack_1',
    title: 'The Belief Trap',
    performer: 'Chris Bacon',
    spotifyId: null,
    matchedOn: null,
    position: 1,
  },
  {
    key: 'movie_soundtrack_2',
    title: 'Disbelief',
    performer: 'Chris Bacon',
    spotifyId: '2vWxYzAbCdEfGhIjKlMnOp',
    matchedOn: 'title',
    position: 2,
  },
];
