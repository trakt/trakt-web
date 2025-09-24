<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import GenreList from "$lib/components/summary/GenreList.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import CheckInAction from "$lib/sections/media-actions/check-in/CheckInAction.svelte";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { useWatchCount } from "$lib/stores/useWatchCount";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import MediaDetails from "../details/MediaDetails.svelte";
  import MediaStreamingServices from "../details/MediaStreamingServices.svelte";
  import type { EpisodeSummaryProps } from "./../EpisodeSummaryProps";
  import MediaMetaInfo from "./../media/MediaMetaInfo.svelte";
  import StreamOnOverlay from "./../overlay/StreamOnOverlay.svelte";
  import RateNow from "./../rating/RateNow.svelte";
  import StreamOnButton from "./../stream/StreamOnButton.svelte";
  import SummaryActions from "./../summary/SummaryActions.svelte";
  import SummaryContainer from "./../summary/SummaryContainer.svelte";
  import SummaryHeader from "./../summary/SummaryHeader.svelte";
  import SummaryOverview from "./../summary/SummaryOverview.svelte";
  import SummaryTitle from "./../summary/SummaryTitle.svelte";

  const {
    episode,
    show,
    showIntl,
    episodeIntl,
    streamOn,
    crew,
  }: Omit<EpisodeSummaryProps, "seasons"> = $props();
  const type = "episode";

  const title = $derived(episodeIntl.title ?? episode.title);
  const overview = $derived(episodeIntl.overview ?? episode.overview);
  const showTitle = $derived(showIntl.title ?? show.title);
  const { watchCount } = $derived(useWatchCount({ show, episode, type }));
</script>

{#snippet mediaActions(size: "small" | "normal" = "normal")}
  <RenderFor audience="authenticated" navigation="dpad">
    <StreamOnButton
      {streamOn}
      {type}
      {episode}
      media={show}
      style="normal"
      size="normal"
    />
  </RenderFor>
  <MarkAsWatchedAction
    style="normal"
    {type}
    {title}
    media={episode}
    {show}
    {size}
    allowRewatch={$watchCount > 0}
  />
  <RenderFor audience="authenticated" navigation="dpad">
    <RateNow type="episode" media={episode} {show} />
  </RenderFor>
{/snippet}

<SummaryContainer>
  {#snippet poster()}
    <SummaryPoster
      src={show.poster.url.medium}
      alt={title}
      href={streamOn?.preferred?.link}
    >
      {#snippet hoverOverlay()}
        <StreamOnOverlay service={streamOn?.preferred} />
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
      <RenderFor audience="authenticated" navigation="default">
        <CheckInAction
          style="normal"
          size="small"
          {title}
          {type}
          {show}
          {episode}
        />
      </RenderFor>
      <ShareButton
        {title}
        textFactory={({ title }) =>
          m.text_share_episode({
            title,
            show: showTitle,
            season: episode.season,
            episode: episode.number,
          })}
        source={{ id: "episode" }}
      />
    {/snippet}
    <SummaryTitle {title} />
    <Link href={UrlBuilder.show(show.slug)}>
      <h6>{showTitle}</h6>
    </Link>
    <p class="meta-info">{m.text_season_episode_number(episode)}</p>
    <GenreList genres={show.genres} />
  </SummaryHeader>

  <MediaMetaInfo
    watchCount={$watchCount}
    {streamOn}
    {type}
    {episode}
    media={show}
  />

  <Spoiler media={episode} {show} {type}>
    <SummaryOverview {title} {overview} />
  </Spoiler>

  <RenderFor audience="authenticated">
    <SummaryActions>
      {#snippet contextualActions()}
        <RenderFor audience="authenticated" navigation="default">
          <RateNow type="episode" media={episode} {show} />
        </RenderFor>
      {/snippet}

      <RenderFor device={["tablet-sm"]} audience="authenticated">
        {@render mediaActions()}
      </RenderFor>

      <RenderFor device={["mobile"]} audience="authenticated">
        {@render mediaActions("small")}
      </RenderFor>
    </SummaryActions>
  </RenderFor>
</SummaryContainer>

<RenderFor audience="all" navigation="default">
  <SummaryContainer>
    <MediaDetails {episode} {crew} type="episode" />

    {#if streamOn}
      <MediaStreamingServices
        services={streamOn.services}
        preferred={streamOn.preferred}
      />
    {/if}
  </SummaryContainer>
</RenderFor>
