<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import { useEpisodeSpoilerImage } from "$lib/features/spoilers/useEpisodeSpoilerImage";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import SeasonList from "$lib/sections/lists/season/SeasonList.svelte";
  import CastList from "../lists/CastList.svelte";
  import MediaWatchHistoryList from "../lists/history/MediaWatchHistoryList.svelte";
  import RelatedList from "../lists/RelatedList.svelte";
  import WhereToWatchList from "../lists/where-to-watch/WhereToWatchList.svelte";
  import SummaryCover from "./components/_internal/SummaryCover.svelte";
  import Comments from "./components/comments/Comments.svelte";
  import MediaDetails from "./components/details/MediaDetails.svelte";
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

  const posterSrc = $derived(
    useEpisodeSpoilerImage({ episode, show, variant: "default" }),
  );
</script>

<!-- 
  Episodes don't have their own colors, so we fallback to their show's color
  if available. This approach ensures visual consistency between a show and its
  episodes.
-->
<SummaryCover src={episode.cover.url ?? ""} colors={show.colors} type="show" />

<RenderFor audience="all" device={["mobile", "tablet-sm"]}>
  <EpisodeSummaryV2
    {episode}
    {show}
    {showIntl}
    {episodeIntl}
    {crew}
    posterSrc={$posterSrc}
  />
</RenderFor>

<RenderFor audience="all" device={["tablet-lg", "desktop"]}>
  <EpisodeSummary
    {episode}
    {show}
    {showIntl}
    {episodeIntl}
    {streamOn}
    {crew}
    posterSrc={$posterSrc}
  >
    {#snippet contextualContent()}
      <RenderFor audience="authenticated" device={["desktop"]}>
        <WhereToWatchList
          type="episode"
          {episode}
          media={show}
          {streamOn}
          variant="inline"
        />
      </RenderFor>
    {/snippet}
  </EpisodeSummary>
</RenderFor>

<RenderFor audience="authenticated">
  <RenderFor
    audience="authenticated"
    device={["mobile", "tablet-sm", "tablet-lg"]}
  >
    <WhereToWatchList type="episode" {episode} media={show} {streamOn} />
  </RenderFor>

  <CastList title={m.list_title_actors()} cast={crew.cast} slug={show.slug} />

  <Comments
    media={show}
    type="episode"
    season={episode.season}
    episode={episode.number}
    id={episode.id}
  />

  <SeasonList {show} {seasons} currentSeason={episode.season} />

  <RelatedList
    title={m.list_title_related_shows()}
    slug={show.slug}
    type="show"
  />

  <MediaWatchHistoryList
    title={m.list_title_history()}
    {episode}
    {show}
    type="episode"
  />

  <MediaDetails {crew} {episode} type="episode" />
</RenderFor>
