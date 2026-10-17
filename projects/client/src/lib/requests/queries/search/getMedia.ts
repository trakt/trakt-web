import type { SearchResultResponse } from '@trakt/api';
import type { MediaType } from '../../models/MediaType.ts';
import { hasSlug } from '../../search/hasSlug.ts';
import { lookup } from '../../search/lookup.ts';
import { toMedia } from './response/toMedia.ts';

type GetMediaProps = {
  query: string;
  limit: number;
  types: MediaType[];
  config: TypesenseConfig;
  signal?: AbortSignal;
};

export async function getMedia({
  query,
  limit,
  types,
  config,
  signal,
}: GetMediaProps): Promise<SearchResultResponse[]> {
  const { hits } = await lookup({
    key: config.keys.media.default,
    server: config.server,
    query,
    limit,
    types,
    signal,
  });

  return hits.flatMap((hit) => {
    const { document } = hit;

    if (!hasSlug(document)) {
      return [];
    }

    const type = 'episode_count' in document ? 'show' : 'movie';

    return [
      {
        score: Number(hit.text_match_info?.score ?? -1),
        type,
        [type]: toMedia(type, document),
      },
    ];
  });
}
