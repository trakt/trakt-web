import { findDefined } from '$lib/utils/string/findDefined.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import { mediumUrl } from './mediumUrl.ts';
import { thumbUrl } from './thumbUrl.ts';

type ToImageUrlsProps = {
  candidates: string[] | Nil;
  mediumPlaceholder: HttpsUrl;
  thumbPlaceholder: HttpsUrl;
};

export function toImageUrls({
  candidates,
  mediumPlaceholder,
  thumbPlaceholder,
}: ToImageUrlsProps) {
  const candidate = findDefined(...(candidates ?? []));

  return {
    url: {
      medium: prependHttps(mediumUrl(candidate), mediumPlaceholder),
      thumb: prependHttps(thumbUrl(candidate), thumbPlaceholder),
    },
  };
}
