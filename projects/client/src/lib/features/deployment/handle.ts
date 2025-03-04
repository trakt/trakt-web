import type { Handle } from '@sveltejs/kit';
import { DeploymentEndpoint } from './DeploymentEndpoint.ts';

export const DEPLOYMENT_SHA_PLACEHOLDER = '%deployment.sha%';

export const handle: Handle = ({ event, resolve }) => {
  const { request } = event;

  if (
    request.method === 'GET' && event.url.pathname === DeploymentEndpoint.Get
  ) {
    return new Response(TRAKT_GIT_SHA, {});
  }

  return resolve(event, {
    transformPageChunk({ html, done }) {
      if (!done) return html;
      return html
        .replace(DEPLOYMENT_SHA_PLACEHOLDER, TRAKT_GIT_SHA);
    },
  });
};
