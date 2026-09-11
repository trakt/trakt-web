const HASH = '8ce8357c78ea940b9c2015daf05ce1a5/ea/72';

function source(name: string, width: number, height: number) {
  return {
    url: `https://static.klipy.com/ii/${HASH}/${name}`,
    width,
    height,
    size: 1234,
  };
}

export const GifTrendingResponseMock = {
  result: true,
  data: {
    data: [
      {
        id: 1098661743151650,
        slug: 'its-thursday-dance-1',
        title: "It's Thursday Dance Celebration",
        type: 'gif',
        tags: [],
        blur_preview: 'data:image/jpeg;base64,deadbeef',
        file: {
          hd: {
            gif: source('hd.gif', 480, 480),
            webp: source('hd.webp', 480, 480),
            jpg: source('hd.jpg', 480, 480),
          },
          md: {
            gif: source('md.gif', 480, 480),
            webp: source('md.webp', 480, 480),
            jpg: source('md.jpg', 480, 480),
          },
          sm: {
            gif: source('sm.gif', 220, 220),
            webp: source('sm.webp', 220, 220),
            jpg: source('sm.jpg', 220, 220),
          },
          xs: {
            gif: source('xs.gif', 90, 90),
            webp: source('xs.webp', 90, 90),
            jpg: source('xs.jpg', 90, 90),
          },
        },
      },
      // Klipy mixes sponsored items into the same array; the picker drops them.
      {
        id: 999,
        type: 'ad',
        content: '<iframe src="https://ads.klipy.com/999"></iframe>',
      },
    ],
    current_page: 1,
    per_page: 24,
    has_next: false,
    meta: {
      item_min_width: 80,
      ad_max_resize_percent: 10,
    },
  },
};
