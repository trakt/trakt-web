import type { WatchNowServiceResponse } from '@trakt/api';

export function mapToDirectLink(response: WatchNowServiceResponse) {
  const { source, link_direct } = response;

  if (!link_direct) {
    return;
  }

  if (source.includes('netflix')) {
    return link_direct.replace('/title/', '/watch/');
  }

  if (source.includes('disney')) {
    const uParam = new URL(link_direct).searchParams.get('u');
    if (!uParam) {
      return link_direct;
    }

    return decodeURIComponent(uParam);
  }

  return link_direct;
}
