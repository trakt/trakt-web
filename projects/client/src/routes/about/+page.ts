import { registeredMemberCountQuery } from '$lib/requests/queries/stats/registeredMemberCountQuery.ts';
import { delay } from '$lib/utils/timing/delay.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { PageLoad } from '$types/about/$types.d.ts';

const PREFETCH_WAIT_LIMIT = time.seconds(1);

export const load: PageLoad = async ({ parent, fetch }) => {
  const { queryClient } = await parent();

  await Promise.race([
    queryClient.prefetchQuery(registeredMemberCountQuery({ fetch })),
    delay(PREFETCH_WAIT_LIMIT),
  ]);
};
