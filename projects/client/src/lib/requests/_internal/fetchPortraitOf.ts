import { api, type ApiParams } from '$lib/requests/api.ts';
import type { PortraitOf } from '$lib/requests/models/PortraitOf.ts';

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
  const response = await summaryRequest(params).catch(() => null);

  if (response?.status !== 200) {
    return null;
  }

  return { media: params.media, id: response.body.ids.trakt };
}
