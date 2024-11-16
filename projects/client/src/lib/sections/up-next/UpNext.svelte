<script lang="ts">
  import EpisodeCardTransition from "$lib/components/episode/card/EpisodeCardTransition.svelte";
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import UpNextEpisode from "$lib/components/episode/up-next/UpNextEpisode.svelte";
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

<div class="up-next-container">
  <h2 class="up-next-title">{m.up_next_title()}</h2>

  <div class="episode-list episode-list-horizontal-scroll">
    {#each $value as entry (entry.show.id)}
      <EpisodeCardTransition>
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
      </EpisodeCardTransition>
    {/each}
  </div>
</div>

<style>
  .up-next-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .up-next-title {
    color: var(--color-text-primary);
    margin: 0 3.5rem;
    font-size: 2.5rem;
    font-style: normal;
    font-weight: 600;
    line-height: 90%;
    letter-spacing: -0.1rem;
  }

  .episode-list {
    display: flex;
    height: 12rem;
    gap: 1rem;
  }

  .episode-list-horizontal-scroll {
    overflow-x: auto;
  }
</style>
