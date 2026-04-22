<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import { m } from "$lib/features/i18n/messages";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { Season } from "$lib/requests/models/Season";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import SeasonItem from "$lib/sections/lists/components/SeasonItem.svelte";
  import {
    SummaryDrawers,
    summaryDrawerNavigation,
  } from "$lib/sections/summary/_internal/summaryDrawerNavigation";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import ViewAllButton from "../../components/ViewAllButton.svelte";
  import SeasonPopupMenu from "./SeasonPopupMenu.svelte";

  type SeasonListProps = {
    show: ShowEntry;
    seasons: Season[];
    episodes: EpisodeEntry[];
    title: string;
    subtitle: string;
    currentSeason: number;
  };

  const {
    show,
    seasons,
    episodes,
    title,
    subtitle,
    currentSeason,
  }: SeasonListProps = $props();

  const { buildDrawerLink } = summaryDrawerNavigation();
</script>

<SectionList
  {title}
  {subtitle}
  id={`season-poster-list-${show.slug}`}
  items={seasons}
  --height-list="var(--height-poster-list-sm)"
  --height-override-card="var(--height-portrait-card-sm)"
>
  {#snippet item(season)}
    <SeasonItem
      media={show}
      {season}
      isCurrentSeason={season.number === currentSeason}
      urlBuilder={() => UrlBuilder.show(show.slug, { season: season.number })}
    />
  {/snippet}
  {#snippet actions()}
    <SeasonPopupMenu title={subtitle} {episodes} {show} />

    <ViewAllButton
      {...buildDrawerLink(SummaryDrawers.Seasons)}
      label={m.button_text_view_all()}
      noscroll
      source={{ id: "seasons" }}
    />
  {/snippet}
</SectionList>
