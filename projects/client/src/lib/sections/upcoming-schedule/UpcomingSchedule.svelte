<script lang="ts">
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import UpcomingEpisode from "$lib/components/episode/upcoming/UpcomingEpisode.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import {
    upcomingEpisodes,
    type EpisodeEntry,
  } from "$lib/requests/calendars/upcomingEpisodes";
  import { onMount } from "svelte";

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
      <UpcomingEpisode
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
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .upcoming-schedule-title {
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
    height: 11rem;
    gap: 1rem;
  }

  .episode-list-horizontal-scroll {
    overflow-x: auto;
  }
</style>
