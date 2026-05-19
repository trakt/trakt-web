import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';

type OpenGraphUrlBuilderProps = {
  url: URL;
  type: MediaType;
  slug: string;
};

export function openGraphUrlBuilder(
  { url, type, slug }: OpenGraphUrlBuilderProps,
): HttpsUrl {
  const root = url.origin;
  const urlBuilder = UrlBuilder.api.shareableImage.openGraph;

  return `${root}${urlBuilder(type, slug)}` as HttpsUrl;
}
