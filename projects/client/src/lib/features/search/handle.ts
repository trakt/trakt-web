import { env } from '$env/dynamic/private';
import type { Handle } from '@sveltejs/kit';
import { createSearcher } from '../../requests/search/createSearcher.ts';
import { DEFAULT_SEARCH_LIMIT } from '../../utils/constants.ts';

export const handle: Handle = ({ event, resolve }) => {
  const typesenseKey = env.TYPESENSE_CLIENT_KEY ?? '';
  const typesenseServer = env.TYPESENSE_SERVER ?? '';

  const typesense = createSearcher({
    key: typesenseKey ?? '',
    server: typesenseServer,
  });

  const mediaSearchKey = typesense
    .keys()
    .generateScopedSearchKey(typesenseKey, {
      query_by: [
        'title',
        'original_title',
        'aliases',
        'translations',
      ],
      sort_by: [
        '_text_match:desc',
        'trending_count:desc',
        'list_count:desc',
      ],
      limit_hits: DEFAULT_SEARCH_LIMIT,
    });

  const peopleSearchKey = typesense
    .keys()
    .generateScopedSearchKey(typesenseKey, {
      query_by: [
        'name',
      ],
      sort_by: [
        '_text_match:desc',
        'top_billed_count:desc',
      ],
      limit_hits: DEFAULT_SEARCH_LIMIT,
    });

  event.locals.typesense = {
    keys: {
      media: mediaSearchKey,
      people: peopleSearchKey,
    },
    server: env.TYPESENSE_SERVER ?? '',
  };

  return resolve(event);
};
