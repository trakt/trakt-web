<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import GenreList from "$lib/components/summary/GenreList.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import SeasonList from "$lib/sections/lists/SeasonList.svelte";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { useStreamOn } from "$lib/stores/useStreamOn";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import RelatedList from "../lists/RelatedList.svelte";
  import Comments from "./components/comments/Comments.svelte";
  import type { EpisodeSummaryProps } from "./components/EpisodeSummaryProps";
  import MediaMetaInfo from "./components/media/MediaMetaInfo.svelte";
  import StreamOnOverlay from "./components/overlay/StreamOnOverlay.svelte";
  import RateNow from "./components/rating/RateNow.svelte";
  import SummaryActions from "./components/summary/SummaryActions.svelte";
  import SummaryContainer from "./components/summary/SummaryContainer.svelte";
  import SummaryHeader from "./components/summary/SummaryHeader.svelte";
  import SummaryOverview from "./components/summary/SummaryOverview.svelte";
  import SummaryTitle from "./components/summary/SummaryTitle.svelte";

  const {
    episode,
    show,
    showIntl,
    seasons,
    ratings,
    episodeIntl,
    stats,
    watchers,
  }: EpisodeSummaryProps = $props();
  const type = "episode";

  const title = $derived(episodeIntl.title ?? episode.title);
  const overview = $derived(episodeIntl.overview ?? episode.overview);
  const showTitle = $derived(showIntl.title ?? show.title);
  const { streamOn } = useStreamOn({
    type,
    id: episode.id,
  });
</script>

{#snippet mediaActions()}
  <MarkAsWatchedAction
    style="normal"
    {type}
    {title}
    media={episode}
    {episode}
    {show}
  />
{/snippet}

<CoverImageSetter src={episode.cover.url ?? ""} type="show" />

<SummaryContainer>
  {#snippet poster()}
    <SummaryPoster
      src={show.poster.url.medium}
      alt={title}
      href={$streamOn?.preferred?.link}
    >
      {#snippet hoverOverlay()}
        <StreamOnOverlay service={$streamOn?.preferred} />
      {/snippet}
      {#snippet actions()}
        <RenderFor device={["tablet-lg", "desktop"]} audience="authenticated">
          {@render mediaActions()}
        </RenderFor>
      {/snippet}
    </SummaryPoster>
  {/snippet}

  <SummaryHeader>
    {#snippet headerActions()}
      <ShareButton
        {title}
        textFactory={(title) =>
          m.share_episode({
            title,
            show: showTitle,
            season: episode.season,
            episode: episode.number,
          })}
      />
    {/snippet}
    <SummaryTitle {title} />
    <Link href={UrlBuilder.show(show.slug)}>
      <h6>{showTitle}</h6>
    </Link>
    <p class="meta-info">{m.season_episode_number_label(episode)}</p>
    <GenreList genres={show.genres} />
  </SummaryHeader>

  <MediaMetaInfo
    certification={show.certification}
    year={episode.year}
    airDate={episode.airDate}
    media={episode}
    {ratings}
    {stats}
    {watchers}
    {type}
  />

  <Spoiler media={episode} {episode} {show} {type}>
    <SummaryOverview {title} {overview} />
  </Spoiler>

  <RenderFor audience="authenticated">
    <SummaryActions>
      <RateNow type="episode" media={episode} {episode} {show} />

      <RenderFor device={["mobile", "tablet-sm"]} audience="authenticated">
        {@render mediaActions()}
      </RenderFor>
    </SummaryActions>
  </RenderFor>
</SummaryContainer>

<SeasonList {show} {seasons} />

<Comments
  media={show}
  type="episode"
  season={episode.season}
  episode={episode.number}
/>

<RelatedList title={m.related_shows_title()} slug={show.slug} type="show" />
