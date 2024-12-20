<script lang="ts">
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import UpcomingEpisode from "$lib/components/episode/upcoming/UpcomingEpisode.svelte";
  import SectionList from "$lib/components/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import FindShowsLink from "./components/FindShowsLink.svelte";
  import { useCalendarEpisodes } from "./stores/useCalendarEpisodes";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  const { calendar, isLoading } = useCalendarEpisodes();
</script>

<SectionList
  items={$calendar}
  title={m.upcoming_schedule_title()}
  --height-section-list={mediaListHeightResolver("episode")}
>
  {#snippet item(entry)}
    <UpcomingEpisode
      i18n={EpisodeIntlProvider}
      episodeNumber={entry.number}
      seasonNumber={entry.season}
      posterUrl={entry.poster.url ?? entry.show.cover.url.thumb}
      showTitle={entry.show.title}
      episodeTitle={entry.title}
      airedDate={entry.airedDate}
      type={entry.type}
      showHref={UrlBuilder.show(entry.show.slug)}
    />
  {/snippet}
  {#snippet empty()}
    {#if !$isLoading}
      <p class="small">{m.upcoming_schedule_empty()}</p>
      <FindShowsLink />
    {/if}
  {/snippet}
</SectionList>
