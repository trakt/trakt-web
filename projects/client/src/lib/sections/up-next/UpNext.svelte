<script lang="ts">
  import UpNextEpisode from "$lib/components/episode/up-next/UpNextEpisode.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { upNext, type UpNextEntry } from "$lib/requests/sync/upNext";
  import { onMount } from "svelte";

  let next: UpNextEntry[] = $state([]);

  onMount(async () => {
    next = await upNext();
  });
</script>

<div class="up-next-container">
  <h2 class="up-next-title">{m.up_next_title()}</h2>

  <div class="episode-list episode-list-horizontal-scroll">
    {#each next as entry}
      <UpNextEpisode
        episodeNumber={entry.number}
        seasonNumber={entry.season}
        posterUrl={entry.poster.url}
        showTitle={entry.show.title}
        episodeTitle={entry.title}
        completed={entry.completed}
        total={entry.total}
        remaining={entry.remaining}
      />
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
    gap: 1rem;
  }

  .episode-list-horizontal-scroll {
    overflow-x: auto;
  }
</style>
