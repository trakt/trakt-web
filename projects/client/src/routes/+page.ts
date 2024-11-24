import { isAuthorized } from '$lib/features/auth/token/index.ts';
import { currentUserQuery } from '$lib/requests/queries/users/currentUserQuery.ts';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ parent, fetch }) => {
  const { queryClient } = await parent();

  if (isAuthorized()) {
    await queryClient.prefetchQuery(currentUserQuery({ fetch }));
  }
};
