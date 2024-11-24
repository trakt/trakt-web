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
  import { useStableArray } from "./stores/useStableArray";

  const { list, set } = useStableArray<UpNextEntry>(
    (l, r) => l.show.id === r.show.id,
  );

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
  {#each $list as episode (episode.show.id)}
    <UpNextEpisode
      i18n={EpisodeIntlProvider}
      episodeNumber={episode.number}
      seasonNumber={episode.season}
      posterUrl={episode.poster.url}
      showTitle={episode.show.title}
      episodeTitle={episode.title}
      completed={episode.completed}
      total={episode.total}
      remaining={episode.remaining}
      runtime={episode.runtime}
      type={episode.type}
      isLoading={loadingMap.get(episode.id) ?? false}
      onMarkAsWatched={async () => {
        loadingMap.set(episode.id, true);
        await markAsWatchedRequest({
          body: {
            episodes: [
              {
                ids: { trakt: episode.id },
                watched_at: new Date().toISOString(),
              },
            ],
          },
        });
        loadingMap.set(episode.id, false);
        client.refetchQueries({
          queryKey: upNextQueryKey,
        });
      }}
    />
  {/each}
</SectionList>
