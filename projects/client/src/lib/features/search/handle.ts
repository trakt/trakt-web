import { env } from '$env/dynamic/private';
import type { Handle } from '@sveltejs/kit';
import { createSearcher } from '../../requests/search/createSearcher.ts';
import { DEFAULT_SEARCH_LIMIT } from '../../utils/constants.ts';
import { time } from '../../utils/timing/time.ts';

export const handle: Handle = ({ event, resolve }) => {
  const typesenseKey = env.TYPESENSE_CLIENT_KEY ?? '';
  const typesenseServer = env.TYPESENSE_SERVER ?? '';

  const typesense = createSearcher({
    key: typesenseKey ?? '',
    server: typesenseServer,
  });

  const expires_at = Math.floor(
    (Date.now() + time.hours(6)) / time.seconds(1),
  );

  const mediaSearchKey = typesense
    .keys()
    .generateScopedSearchKey(typesenseKey, {
      preset: 'search:media',
      limit_hits: DEFAULT_SEARCH_LIMIT,
      expires_at,
    });

  const peopleSearchKey = typesense
    .keys()
    .generateScopedSearchKey(typesenseKey, {
      preset: 'search:people',
      limit_hits: DEFAULT_SEARCH_LIMIT,
      expires_at,
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
