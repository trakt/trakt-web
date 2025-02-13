import type { MediaType } from '$lib/requests/models/MediaType.ts';

export function mapToMediaType(params: URLSearchParams): MediaType | undefined {
  const type = params.get('type');

  if (type !== 'movie' && type !== 'show') {
    return;
  }

  return type;
}
