import type { SoundtrackResponse } from '$lib/requests/models/SoundtrackResponse.ts';

export const ShowSiloSoundtrackResponseMock: SoundtrackResponse = [
  {
    title: 'Silo Main Title',
    performer: 'Atli Örvarsson',
    spotify_id: '3qRsTuVwXyZaBcDeFgHiJk',
    matched_on: 'both',
    position: 0,
  },
  {
    title: 'The Down Deep',
    performer: 'Atli Örvarsson',
    spotify_id: null,
    matched_on: null,
    position: 1,
  },
];
