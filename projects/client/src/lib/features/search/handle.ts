import { hasAuthSession } from '$lib/features/auth/hasAuthSession.ts';
import type { Handle } from '@sveltejs/kit';
import { mintSearchKeysFromEnv } from './mintSearchKeysFromEnv.ts';

export const OPEN_SEARCH_LINK_PLACEHOLDER = '%search.opensearch%';

// Search is signed-in only, so a signed-out visitor who added Trakt as a
// search engine would land on the welcome page and lose the query.
const OPEN_SEARCH_LINK =
  '<link rel="search" type="application/opensearchdescription+xml" title="Trakt" href="/opensearch.xml" />';

export const handle: Handle = ({ event, resolve }) => {
  event.locals.typesense = mintSearchKeysFromEnv();

  const openSearchLink = hasAuthSession(event.locals.oidcAuth)
    ? OPEN_SEARCH_LINK
    : '';

  return resolve(event, {
    transformPageChunk({ html, done }) {
      if (!done) return html;
      return html.replace(OPEN_SEARCH_LINK_PLACEHOLDER, openSearchLink);
    },
  });
};
