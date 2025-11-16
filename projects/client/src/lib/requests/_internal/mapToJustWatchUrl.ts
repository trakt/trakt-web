import type { JustWatchLinkResponse } from '@trakt/api';
import { prependHttps } from '../../utils/url/prependHttps.ts';

export function mapToJustWatchUrl(
  response: JustWatchLinkResponse,
  country: string,
): HttpsUrl | null {
  const data = response[country];
  const url = data ? prependHttps(data) : null;

  return url;
}
