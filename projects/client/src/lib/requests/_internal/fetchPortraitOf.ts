import { api, type ApiParams } from '$lib/requests/api.ts';
import type { PortraitOf } from '$lib/requests/models/PortraitOf.ts';
import { fetchPortraitToken } from './fetchPortraitToken.ts';

type FetchPortraitOfParams = {
  media: PortraitOf['media'];
  slug: string;
} & ApiParams;

function summaryRequest({ fetch, media, slug }: FetchPortraitOfParams) {
  const client = api({ fetch });
  const request = { params: { id: slug }, query: {} };

  return media === 'movie'
    ? client.movies.summary(request)
    : client.shows.summary(request);
}

export async function fetchPortraitOf(
  params: FetchPortraitOfParams,
): Promise<PortraitOf | null> {
  const [response, token] = await Promise.all([
    summaryRequest(params).catch(() => null),
    fetchPortraitToken({ fetch: params.fetch }),
  ]);

  if (response?.status !== 200 || !token) {
    return null;
  }

  return { media: params.media, id: response.body.ids.trakt, token };
}
