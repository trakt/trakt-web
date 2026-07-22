import type { SearchResultResponse } from '@trakt/api';
import { hasSlug } from '../../search/hasSlug.ts';
import { lookup } from '../../search/lookup.ts';
import { toPerson } from './response/toPerson.ts';

type GetPeopleProps = {
  query: string;
  limit: number;
  config: TypesenseConfig;
};

export async function getPeople({
  query,
  limit,
  config,
}: GetPeopleProps): Promise<SearchResultResponse[]> {
  const type = 'person';

  const { hits } = await lookup({
    key: config.keys.people,
    server: config.server,
    query,
    limit,
    types: [type],
  });

  return hits
    .flatMap((hit) => {
      const { document } = hit;

      if (!hasSlug(document)) {
        return [];
      }

      return [{
        score: Number(hit.text_match_info?.score ?? -1),
        type,
        [type]: toPerson(document),
      }];
    });
}
