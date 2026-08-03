import type { SoundtrackTrack } from '$lib/requests/models/SoundtrackTrack.ts';

// Blurred sample behind the VIP upsell - shows the shape of the section
// without implying anything about the title being viewed. The ids are
// placeholders; the rows never become interactive.
export const teaserTracks: ReadonlyArray<SoundtrackTrack> = [
  {
    key: 'teaser_0',
    title: 'Main Title',
    performer: null,
    spotifyId: 'teaser',
    position: 0,
  },
  {
    key: 'teaser_1',
    title: 'Opening Credits',
    performer: null,
    spotifyId: 'teaser',
    position: 1,
  },
  {
    key: 'teaser_2',
    title: 'End Credits',
    performer: null,
    spotifyId: null,
    position: 2,
  },
];
