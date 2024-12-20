<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import UpcomingEpisode from "$lib/components/episode/upcoming/UpcomingEpisode.svelte";
  import SectionList from "$lib/components/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
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
      <Button
        href={UrlBuilder.shows()}
        label={m.navbar_link_shows_label()}
        style="ghost"
        variant="primary"
      >
        {m.navbar_link_shows()}
      </Button>
    {/if}
  {/snippet}
</SectionList>
