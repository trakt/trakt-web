<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import SeasonList from "$lib/sections/lists/season/SeasonList.svelte";
  import CastList from "../lists/CastList.svelte";
  import MediaWatchHistoryList from "../lists/history/MediaWatchHistoryList.svelte";
  import RelatedList from "../lists/RelatedList.svelte";
  import Comments from "./components/comments/Comments.svelte";
  import EpisodeSummary from "./components/episode/EpisodeSummary.svelte";
  import EpisodeSummaryV2 from "./components/episode/v2/EpisodeSummary.svelte";
  import type { EpisodeSummaryProps } from "./components/EpisodeSummaryProps";

  const {
    episode,
    show,
    showIntl,
    seasons,
    episodeIntl,
    streamOn,
    crew,
  }: EpisodeSummaryProps = $props();
</script>

<!-- 
  Episodes don't have their own colors, so we fallback to their show's color
  if available. This approach ensures visual consistency between a show and its
  episodes.
-->
<CoverImageSetter
  src={episode.cover.url ?? ""}
  colors={show.colors}
  type="show"
/>

<RenderFor audience="all" device={["mobile"]}>
  <EpisodeSummaryV2
    {episode}
    {show}
    {showIntl}
    {episodeIntl}
    {streamOn}
    {crew}
  />
</RenderFor>

<RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
  <EpisodeSummary {episode} {show} {showIntl} {episodeIntl} {streamOn} {crew} />
</RenderFor>

<CastList title={m.list_title_actors()} cast={crew.cast} slug={show.slug} />

<SeasonList {show} {seasons} currentSeason={episode.season} />

<Comments
  media={show}
  type="episode"
  season={episode.season}
  episode={episode.number}
  id={episode.id}
/>

<RelatedList
  title={m.list_title_related_shows()}
  slug={show.slug}
  type="show"
/>

<MediaWatchHistoryList
  title={m.list_title_recently_watched()}
  {episode}
  {show}
  type="episode"
/>
