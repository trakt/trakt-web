import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  if (
    !event.request.headers.get('content-type')?.includes('text/html') &&
    !event.request.headers.get('content-type')?.includes('text/plain')
  ) {
    return await resolve(event);
  }

  const isAuthenticated = event.locals.auth?.isAuthorized ||
    event.locals.oidcAuth;

  if (isAuthenticated && event.locals.queryClient) {
    try {
      const userQuery =
        (await import('../auth/queries/currentUserSettingsQuery.ts'))
          .currentUserSettingsQuery({ fetch: event.fetch });

      const data = await event.locals.queryClient.fetchQuery(userQuery);
      event.locals.queryClient.setQueryData(userQuery.queryKey, data);
      console.log(
        '------- LAYOUT LOAD',
        event.locals.queryClient.getQueryCache().getAll(),
      );
    } catch (error) {
      console.warn('Failed to prefetch user settings:', error);
    }
  }

  return await resolve(event);
};
