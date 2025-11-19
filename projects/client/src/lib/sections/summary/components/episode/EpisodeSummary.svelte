<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import RatingList from "$lib/components/summary/RatingList.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import CheckInAction from "$lib/sections/media-actions/check-in/CheckInAction.svelte";
  import SetCoverImageAction from "$lib/sections/media-actions/cover-image/SetCoverImageAction.svelte";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { useWatchCount } from "$lib/stores/useWatchCount";
  import EpisodeTitle from "../_internal/EpisodeTitle.svelte";
  import SummaryTitle from "../_internal/SummaryTitle.svelte";
  import { useMediaMetaInfo } from "../media/useMediaMetaInfo";
  import type { EpisodeSummaryProps } from "./../EpisodeSummaryProps";
  import StreamOnOverlay from "./../overlay/StreamOnOverlay.svelte";
  import RateNow from "./../rating/RateNow.svelte";
  import SummaryActions from "./../summary/SummaryActions.svelte";
  import SummaryContainer from "./../summary/SummaryContainer.svelte";
  import SummaryHeader from "./../summary/SummaryHeader.svelte";
  import SummaryOverview from "./../summary/SummaryOverview.svelte";

  const {
    episode,
    show,
    showIntl,
    episodeIntl,
    streamOn,
    crew,
    posterSrc,
  }: Omit<EpisodeSummaryProps, "seasons"> & { posterSrc: string } = $props();
  const type = "episode";

  const title = $derived(episodeIntl.title ?? episode.title);
  const overview = $derived(episodeIntl.overview ?? episode.overview);
  const showTitle = $derived(showIntl.title ?? show.title);
  const { watchCount } = $derived(useWatchCount({ show, episode, type }));

  const { ratings } = $derived(
    useMediaMetaInfo({ type, episode, media: show }),
  );
</script>

{#snippet mediaActions(size: "small" | "normal" = "normal")}
  <MarkAsWatchedAction
    style="normal"
    {type}
    {title}
    media={episode}
    {show}
    {size}
    allowRewatch={$watchCount > 0}
  />
{/snippet}

<SummaryContainer>
  {#snippet poster()}
    <SummaryPoster src={posterSrc} alt={title} href={streamOn?.preferred?.link}>
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

  <SummaryHeader {title}>
    {#snippet popupActions()}
      <RenderFor audience="authenticated">
        <CheckInAction style="dropdown-item" {title} {type} {show} {episode} />
      </RenderFor>
      <SetCoverImageAction
        style="dropdown-item"
        {type}
        id={episode.id}
        {title}
      />
      <ShareButton
        style="dropdown-item"
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

    <EpisodeTitle {episode} {show} {showIntl} />
    <SummaryTitle {title} {crew} {type} {episode} media={show} />
    <RatingList ratings={$ratings} airDate={episode.airDate} />
  </SummaryHeader>

  <Spoiler media={episode} {show} {type}>
    <SummaryOverview {title} {overview} />
  </Spoiler>

  <RenderFor audience="authenticated">
    <SummaryActions>
      {#snippet contextualActions()}
        <RenderFor audience="authenticated">
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
