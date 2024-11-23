<script lang="ts">
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import UpcomingEpisode from "$lib/components/episode/upcoming/UpcomingEpisode.svelte";
  import SectionList from "$lib/components/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { upcomingEpisodesQuery } from "$lib/requests/queries/calendars/upcomingEpisodesQuery";
  import { createQuery } from "@tanstack/svelte-query";
  import { derived } from "svelte/store";

  function daysAgo(days: number) {
    const ONE_DAY = 1000 * 60 * 60 * 24;

    return new Date(Date.now() - ONE_DAY * days);
  }

  const [YYYY_MM_DD] = daysAgo(0).toISOString().split("T");
  const query = createQuery(
    upcomingEpisodesQuery({
      startDate: YYYY_MM_DD,
      days: 14,
    }),
  );

  const calendar = derived(query, ($query) => $query.data ?? []);
</script>

<SectionList
  title={m.upcoming_schedule_title()}
  --height-section-list="var(--height-episode-list)"
>
  {#each $calendar as entry}
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
</SectionList>
