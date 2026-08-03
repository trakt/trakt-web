import type { SoundtrackResponse } from '$lib/requests/models/SoundtrackResponse.ts';

export const MovieHereticSoundtrackResponseMock: SoundtrackResponse = [
  {
    title: 'Prologue',
    performer: 'Chris Bacon',
    spotify_id: '1aBcDeFgHiJkLmNoPqRsTu',
    matched_on: 'credit',
    position: 0,
  },
  {
    title: 'The Belief Trap',
    performer: 'Chris Bacon',
    spotify_id: null,
    matched_on: null,
    position: 1,
  },
  {
    title: 'Disbelief',
    performer: 'Chris Bacon',
    spotify_id: '2vWxYzAbCdEfGhIjKlMnOp',
    matched_on: 'title',
    position: 2,
  },
];
