import type { SearchResultResponse } from '@trakt/api';
import type { MediaType } from '../../models/MediaType.ts';
import { lookup } from '../../search/lookup.ts';
import { toMedia } from './response/toMedia.ts';

type GetMediaProps = {
  query: string;
  types: MediaType[];
  config: TypesenseConfig;
};

export async function getMedia({
  query,
  types,
  config,
}: GetMediaProps): Promise<SearchResultResponse[]> {
  const { hits } = await lookup({
    key: config.keys.media,
    server: config.server,
    query,
    types,
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
