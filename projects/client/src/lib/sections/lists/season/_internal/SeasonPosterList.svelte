<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { Season } from "$lib/requests/models/Season";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import SeasonItem from "$lib/sections/lists/components/SeasonItem.svelte";
  import { mediaListHeightResolver } from "$lib/sections/lists/utils/mediaListHeightResolver";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
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
</script>

<SectionList
  {title}
  {subtitle}
  id={`season-poster-list-${show.slug}`}
  items={seasons}
  --height-list={mediaListHeightResolver("portrait")}
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
  {/snippet}
</SectionList>
