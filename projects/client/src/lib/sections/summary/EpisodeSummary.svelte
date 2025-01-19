<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import GenreList from "$lib/components/summary/GenreList.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import SeasonList from "$lib/sections/lists/SeasonList.svelte";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { EpisodeSummaryProps } from "./components/EpisodeSummaryProps";
  import MediaMetaInfo from "./components/media/MediaMetaInfo.svelte";
  import RateNowButton from "./components/rating/RateNowButton.svelte";
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
      href={UrlBuilder.show(show.slug)}
      src={show.poster.url.medium}
      alt={title}
    >
      {#snippet actions()}
        <RenderFor device={["tablet-lg", "desktop"]} audience="authenticated">
          {@render mediaActions()}
        </RenderFor>
      {/snippet}
    </SummaryPoster>
  {/snippet}

  <SummaryHeader {title}>
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
    {ratings}
    {stats}
    {watchers}
  />

  <SummaryOverview {title} {overview} />

  <RenderFor audience="authenticated">
    <SummaryActions>
      <RateNowButton type="episode" id={episode.id} />

      <RenderFor device={["mobile", "tablet-sm"]} audience="authenticated">
        {@render mediaActions()}
      </RenderFor>
    </SummaryActions>
  </RenderFor>
</SummaryContainer>

<SeasonList {show} {seasons} />
