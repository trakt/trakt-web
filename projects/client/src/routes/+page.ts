import { currentUserQuery } from '$lib/requests/queries/users/currentUserQuery.ts';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ parent, fetch }) => {
  const { queryClient } = await parent();

  await queryClient.prefetchQuery(currentUserQuery({ fetch }));
};
