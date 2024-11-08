<script lang="ts">
  import { onMount } from "svelte";
  import Episode from "$lib/components/episode/Episode.svelte";

  import {
    upcomingEpisodes,
    type EpisodeEntry,
  } from "$lib/requests/calendars/upcomingEpisodes";
  import * as m from "$lib/features/i18n/messages.ts";
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";

  let calendar: EpisodeEntry[] = $state([]);

  function daysAgo(days: number) {
    const ONE_DAY = 1000 * 60 * 60 * 24;

    return new Date(Date.now() - ONE_DAY * days);
  }

  onMount(async () => {
    const [YYYY_MM_DD] = daysAgo(0).toISOString().split("T");

    calendar = await upcomingEpisodes({
      startDate: YYYY_MM_DD,
      days: 14,
    });
  });
</script>

<div class="upcoming-schedule-container">
  <h2 class="upcoming-schedule-title">{m.upcoming_schedule_title()}</h2>

  <div class="episode-list episode-list-horizontal-scroll">
    {#each calendar as entry}
      <Episode
        i18n={EpisodeIntlProvider}
        episodeNumber={entry.number}
        seasonNumber={entry.season}
        posterUrl={entry.poster.url}
        showTitle={entry.show.title}
        episodeTitle={entry.title}
        airedDate={entry.airedDate}
        type={entry.type}
      />
    {/each}
  </div>
</div>

<style>
  .upcoming-schedule-container {
    /* TODO(@vlad): needed only for testing scroll states, remove when dev stable  */
    padding-bottom: 100dvh;
  }

  .upcoming-schedule-title {
    color: var(--color-text-primary);
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 600;
    margin: 0.5rem 0;
  }

  .episode-list {
    display: flex;
    gap: 1rem;
  }

  .episode-list-horizontal-scroll {
    overflow-x: auto;
  }
</style>
