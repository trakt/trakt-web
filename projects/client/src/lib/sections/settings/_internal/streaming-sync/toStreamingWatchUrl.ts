type WatchUrlParams = {
  serviceId: string | Nil;
  contentId: string | Nil;
  idType: 'movie' | 'episode';
};

/**
 * Builds a deep link to watch an item on its streaming service, mirroring the
 * v2 `younify_content_link` helper. Returns undefined when the service is
 * unknown or the content id is missing.
 */
export function toStreamingWatchUrl(
  { serviceId, contentId, idType }: WatchUrlParams,
): string | undefined {
  if (!serviceId || !contentId) {
    return undefined;
  }

  switch (serviceId) {
    case 'amazon':
      return `https://www.amazon.com/gp/video/detail/${contentId}`;
    case 'netflix':
      return `https://www.netflix.com/watch/${contentId}`;
    case 'disneyplus':
      return `https://www.disneyplus.com/play/${contentId}`;
    case 'appletv':
      return `https://tv.apple.com/${idType}/${contentId}`;
    case 'hulu':
      return `https://www.hulu.com/watch/${contentId}`;
    case 'hbomax':
      return `https://play.max.com/video/watch/${contentId}`;
    default:
      return undefined;
  }
}
