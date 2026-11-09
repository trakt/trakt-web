type MediaImageSlots = {
  movies: 'poster' | 'fanart' | 'logo' | 'clearart' | 'banner' | 'thumb';
  shows: 'poster' | 'fanart' | 'logo' | 'clearart' | 'banner' | 'thumb';
  seasons: 'poster' | 'thumb';
  episodes: 'screenshot';
  people: 'headshot' | 'fanart';
  networks: 'logo';
  companies: 'logo';
  lists: 'fanart';
};

type MediaImageType = keyof MediaImageSlots;

type MediaImageSize = 'thumb' | 'medium' | 'full';

type MediaImageUrlProps<T extends MediaImageType> = {
  type: T;
  id: number;
  slot: MediaImageSlots[T];
  size: MediaImageSize;
};

const MEDIA_HOST = 'https://media.trakt.tv';

const SLOTS_WITHOUT_THUMB: ReadonlySet<string> = new Set([
  'logo',
  'clearart',
  'banner',
]);

function toAvailableSize(slot: string, size: MediaImageSize): MediaImageSize {
  if (size === 'thumb' && SLOTS_WITHOUT_THUMB.has(slot)) {
    return 'medium';
  }

  return size;
}

export function toMediaImageUrl<T extends MediaImageType>({
  type,
  id,
  slot,
  size,
}: MediaImageUrlProps<T>): HttpsUrl {
  const availableSize = toAvailableSize(slot, size);

  return `${MEDIA_HOST}/${type}/${id}/${availableSize}/${slot}.webp` as HttpsUrl;
}
