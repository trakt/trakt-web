import { browser } from '$app/environment';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import {
  type UpNextEntry,
  upNextQuery,
  upNextQueryKey,
} from '$lib/requests/queries/sync/upNextQuery.ts';
import { useStableArray } from '$lib/sections/up-next/stores/useStableArray.ts';
import { createQuery, useQueryClient } from '@tanstack/svelte-query';

const UP_NEXT_LIMIT = 100;

export const useUpNextEpisodes = () => {
  const { list, set } = useStableArray<UpNextEntry>((l, r) =>
    l.show.id === r.show.id
  );

  const client = browser ? useQueryClient() : undefined;
  const { current: user } = useUser();

  const query = createQuery(
    upNextQuery({
      limit: UP_NEXT_LIMIT,
      sort: user().preferences.progress.sort,
    }),
  );

  query.subscribe((query) => {
    if (query.data == null) return;
    set(query.data.entries.map((entry) => entry));
  });

  const reload = () => {
    client?.resetQueries({
      queryKey: upNextQueryKey,
    });
  };

  return {
    list,
    reload,
  };
};
