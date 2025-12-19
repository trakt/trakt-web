import type { SearchResultResponse } from '@trakt/api';
import type { MediaType } from '../../models/MediaType.ts';
import { lookup } from '../../search/lookup.ts';
import { toMedia } from './response/toMedia.ts';

type GetMediaProps = {
  query: string;
  limit: number;
  types: MediaType[];
  config: TypesenseConfig;
  exact: boolean;
};

export async function getMedia({
  query,
  limit,
  types,
  config,
  exact,
}: GetMediaProps): Promise<SearchResultResponse[]> {
  const { hits } = await lookup({
    key: exact ? config.keys.media.exact : config.keys.media.default,
    server: config.server,
    query,
    limit,
    types,
    exact,
  });

  return hits
    .map((hit) => {
      const type = 'episode_count' in hit.document ? 'show' : 'movie';

      return {
        score: Number(hit.text_match_info?.score ?? -1),
        type,
        [type]: toMedia(type, hit.document),
      };
    });
}
