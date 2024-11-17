<script lang="ts">
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import UpNextEpisode from "$lib/components/episode/up-next/UpNextEpisode.svelte";
  import SectionList from "$lib/components/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { markAsWatched } from "$lib/requests/sync/markAsWatched";
  import { upNext, type UpNextEntry } from "$lib/requests/sync/upNext";
  import { onMount } from "svelte";
  import { SvelteMap } from "svelte/reactivity";
  import { useEpisodeStore } from "./useEpisodeStore";

  const { value, set } = useEpisodeStore<UpNextEntry>();

  onMount(async () => {
    set(await upNext());
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
        await markAsWatched({
          episodes: [
            {
              ids: { trakt: entry.id },
              watched_at: new Date().toISOString(),
            },
          ],
        });
        loadingMap.set(entry.id, false);
        set(await upNext());
      }}
    />
  {/each}
</SectionList>
