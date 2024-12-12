<script lang="ts">
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import UpcomingEpisode from "$lib/components/episode/upcoming/UpcomingEpisode.svelte";
  import SectionList from "$lib/components/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { useCalendarEpisodes } from "./stores/useCalendarEpisodes";

  const calendar = useCalendarEpisodes();
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
      posterUrl={entry.poster.url ?? entry.show.cover.url}
      showTitle={entry.show.title}
      episodeTitle={entry.title}
      airedDate={entry.airedDate}
      type={entry.type}
      showHref={UrlBuilder.show(entry.show.slug)}
    />
  {/each}
</SectionList>
