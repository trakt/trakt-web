<script lang="ts">
  import ShadowList from "$lib/components/lists/section-list/ShadowList.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { Season } from "$lib/requests/models/Season";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import SeasonItem from "$lib/sections/lists/components/SeasonItem.svelte";
  import { mediaListHeightResolver } from "$lib/sections/lists/utils/mediaListHeightResolver";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

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

<ShadowList
  {title}
  {subtitle}
  id={`season-poster-list-${show.slug}`}
  items={seasons}
  --height-list={mediaListHeightResolver("portrait")}
>
  {#snippet item(season)}
    <SeasonItem
      {season}
      isCurrentSeason={season.number === currentSeason}
      urlBuilder={() => UrlBuilder.show(show.slug, { season: season.number })}
    />
  {/snippet}
  {#snippet actions()}
    <RenderFor audience="authenticated" device={["desktop", "tablet-lg"]}>
      <MarkAsWatchedAction
        style="normal"
        type="episode"
        size="small"
        title={subtitle}
        media={episodes}
        {show}
      />
    </RenderFor>
    <RenderFor audience="authenticated" device={["mobile", "tablet-sm"]}>
      <MarkAsWatchedAction
        style="action"
        type="episode"
        size="small"
        title={subtitle}
        media={episodes}
        {show}
      />
    </RenderFor>
  {/snippet}
</ShadowList>
