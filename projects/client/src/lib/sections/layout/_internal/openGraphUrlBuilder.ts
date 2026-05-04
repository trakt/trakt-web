import type { ShareType } from '$lib/features/share/models/ShareType.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

type OpenGraphUrlBuilderProps = {
  url: URL;
  type: MediaType;
  slug: string;
  shareType: ShareType;
};

function toUrlBuilder(type: ShareType) {
  switch (type) {
    case 'open-graph':
      return UrlBuilder.api.shareableImage.openGraph;
  }
}

export function openGraphUrlBuilder(
  { url, type, slug, shareType }: OpenGraphUrlBuilderProps,
): HttpsUrl {
  const root = url.origin;
  const urlBuilder = toUrlBuilder(shareType);

  return `${root}${urlBuilder(type, slug)}` as HttpsUrl;
}
