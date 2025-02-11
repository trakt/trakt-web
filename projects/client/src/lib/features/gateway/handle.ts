import { ClientEnvironment } from '$lib/requests/ClientEnvironment.ts';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith(ClientEnvironment.legacy)) {
    const traktUrl = new URL(
      url.pathname.replace(ClientEnvironment.legacy, ''),
      TRAKT_TARGET_ENVIRONMENT,
    );

    // Copy query parameters
    for (const [key, value] of url.searchParams) {
      traktUrl.searchParams.set(key, value);
    }

    const token = event.locals.auth?.token?.access;

    const headers = new Headers(event.request.headers);

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(traktUrl, {
      method: event.request.method,
      headers,
      body: event.request.method !== 'GET'
        ? await event.request.text()
        : undefined,
    });

    return response;
  }

  return resolve(event);
};
