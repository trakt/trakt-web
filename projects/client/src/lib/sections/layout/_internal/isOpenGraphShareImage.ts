import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { isTrendingShareImage } from './isTrendingShareImage.ts';

export function isOpenGraphShareImage(url: URL): boolean {
  return (
    isTrendingShareImage(url) ||
    url.pathname.startsWith(`${UrlBuilder.api.profileShareableImagePath()}/`)
  );
}
