import type { GifEntry } from '$lib/requests/models/GifEntry.ts';

const HASH = '8ce8357c78ea940b9c2015daf05ce1a5/ea/72';

export const GifTrendingMappedMock: GifEntry[] = [
  {
    id: '1098661743151650',
    slug: 'its-thursday-dance-1',
    title: "It's Thursday Dance Celebration",
    preview: {
      url: `https://static.klipy.com/ii/${HASH}/sm.webp`,
      width: 220,
      height: 220,
    },
    url: `https://static.klipy.com/ii/${HASH}/md.gif`,
    still: {
      url: `https://static.klipy.com/ii/${HASH}/sm.jpg`,
      width: 220,
      height: 220,
    },
    blurPreview: 'data:image/jpeg;base64,deadbeef',
  },
];
