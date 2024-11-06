<script lang="ts">
  import { onMount } from "svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import Episode from "$lib/components/Episode.svelte";
  import {
    upcomingEpisodes,
    type EpisodeEntry,
  } from "$lib/requests/calendars/upcomingEpisodes";

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
        episodeNumber={entry.number}
        seasonNumber={entry.season}
        posterUrl={entry.poster.url}
        showTitle={entry.show.title}
        episodeTitle={entry.title}
      />
    {/each}
  </div>
</div>

<style>
  .upcoming-schedule-title {
    color: #bcbcbc;
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
