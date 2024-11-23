<script lang="ts">
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import UpNextEpisode from "$lib/components/episode/up-next/UpNextEpisode.svelte";
  import SectionList from "$lib/components/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import {
    upNextQuery,
    upNextQueryKey,
    type UpNextEntry,
  } from "$lib/requests/queries/sync/upNextQuery";
  import { markAsWatchedRequest } from "$lib/requests/sync/markAsWatchedRequest";
  import { createQuery, useQueryClient } from "@tanstack/svelte-query";
  import { SvelteMap } from "svelte/reactivity";
  import { useEpisodeStore } from "./useEpisodeStore";

  const { value, set } = useEpisodeStore<UpNextEntry>();

  const client = useQueryClient();
  const query = createQuery({
    ...upNextQuery(),
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  query.subscribe((query) => {
    if (query.data == null) return;
    set(query.data);
  });

  const loadingMap = new SvelteMap<number, boolean>();
</script>

<SectionList
  title={m.up_next_title()}
  --height-section-list="var(--height-episode-list)"
>
  {#each $value as entry (entry.show.id)}
    <UpNextEpisode
      i18n={EpisodeIntlProvider}
      episodeNumber={entry.number}
      seasonNumber={entry.season}
      posterUrl={entry.poster.url}
      showTitle={entry.show.title}
      episodeTitle={entry.title}
      completed={entry.completed}
      total={entry.total}
      remaining={entry.remaining}
      runtime={entry.runtime}
      type={entry.type}
      isLoading={loadingMap.get(entry.id) ?? false}
      onMarkAsWatched={async () => {
        loadingMap.set(entry.id, true);
        await markAsWatchedRequest({
          body: {
            episodes: [
              {
                ids: { trakt: entry.id },
                watched_at: new Date().toISOString(),
              },
            ],
          },
        });
        loadingMap.set(entry.id, false);
        client.refetchQueries({
          queryKey: upNextQueryKey,
        });
      }}
    />
  {/each}
</SectionList>
