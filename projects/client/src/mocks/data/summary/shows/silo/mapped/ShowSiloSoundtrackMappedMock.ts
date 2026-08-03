import type { SoundtrackTrack } from '$lib/requests/models/SoundtrackTrack.ts';

export const ShowSiloSoundtrackMappedMock: SoundtrackTrack[] = [
  {
    key: 'show_soundtrack_0',
    title: 'Silo Main Title',
    performer: 'Atli Örvarsson',
    spotifyId: '3qRsTuVwXyZaBcDeFgHiJk',
    matchedOn: 'both',
    position: 0,
  },
  {
    key: 'show_soundtrack_1',
    title: 'The Down Deep',
    performer: 'Atli Örvarsson',
    spotifyId: null,
    matchedOn: null,
    position: 1,
  },
];
