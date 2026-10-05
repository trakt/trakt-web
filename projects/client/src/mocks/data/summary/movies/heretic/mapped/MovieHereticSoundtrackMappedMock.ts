import type { SoundtrackTrack } from '$lib/requests/models/SoundtrackTrack.ts';

export const MovieHereticSoundtrackMappedMock: SoundtrackTrack[] = [
  {
    key: 'movie_soundtrack_0',
    title: 'Prologue',
    performer: 'Chris Bacon',
    spotifyId: '1aBcDeFgHiJkLmNoPqRsTu',
    matchedOn: 'credit',
    position: 0,
    season: null,
    source: 'imdb',
  },
  {
    key: 'movie_soundtrack_1',
    title: 'The Belief Trap',
    performer: 'Chris Bacon',
    spotifyId: null,
    matchedOn: null,
    position: 1,
    season: null,
    source: 'imdb',
  },
  {
    key: 'movie_soundtrack_2',
    title: 'Disbelief',
    performer: 'Chris Bacon',
    spotifyId: '2vWxYzAbCdEfGhIjKlMnOp',
    matchedOn: 'title',
    position: 2,
    season: null,
    source: 'both',
  },
  {
    key: 'movie_soundtrack_3',
    title: 'Mr. Reed',
    performer: 'Chris Bacon',
    spotifyId: '4pQrStUvWxYzAbCdEfGhIj',
    matchedOn: 'album_spotify',
    position: 3,
    season: null,
    source: 'album',
  },
];
