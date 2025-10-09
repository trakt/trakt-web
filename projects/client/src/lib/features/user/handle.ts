import type { Handle } from '@sveltejs/kit';
import { currentUserSettingsQuery } from '../auth/queries/currentUserSettingsQuery.ts';

// TODO no boolean, check data
let handled = false;

export const handle: Handle = async ({ event, resolve }) => {
  // TODO proper auth check
  const isAuthenticated = event.locals.auth?.isAuthorized ||
    event.locals.oidcAuth;

  if (!handled && isAuthenticated && event.locals.queryClient) {
    try {
      handled = true;
      // TODO why not always authenticated? i.e. fix 401
      const userQuery = currentUserSettingsQuery({ fetch: event.fetch });
      const existingData = event.locals.queryClient.getQueryData(
        userQuery.queryKey,
      );

      if (!existingData) {
        const data = await event.locals.queryClient.fetchQuery(userQuery);
        event.locals.queryClient.setQueryData(userQuery.queryKey, data);
      }
    } catch (error) {
      console.warn('Failed to prefetch user settings:', error);
    }
  }

  return await resolve(event);
};
