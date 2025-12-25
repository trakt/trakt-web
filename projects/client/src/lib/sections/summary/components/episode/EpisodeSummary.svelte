<script lang="ts">
  import RatingList from "$lib/components/summary/RatingList.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { useWatchCount } from "$lib/stores/useWatchCount";
  import EpisodeTitle from "../_internal/EpisodeTitle.svelte";
  import SummaryPosterTags from "../_internal/SummaryPosterTags.svelte";
  import SummaryTitle from "../_internal/SummaryTitle.svelte";
  import { useMediaMetaInfo } from "../media/useMediaMetaInfo";
  import type { EpisodeSummaryProps } from "./../EpisodeSummaryProps";
  import StreamOnOverlay from "./../overlay/StreamOnOverlay.svelte";
  import RateNow from "./../rating/RateNow.svelte";
  import SummaryActions from "./../summary/SummaryActions.svelte";
  import SummaryContainer from "./../summary/SummaryContainer.svelte";
  import SummaryHeader from "./../summary/SummaryHeader.svelte";
  import SummaryOverview from "./../summary/SummaryOverview.svelte";
  import EpisodeActions from "./v2/_internal/EpisodeActions.svelte";

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
  const postCreditsCount = $derived(episode.postCredits?.length ?? 0);

  const { ratings } = $derived(
    useMediaMetaInfo({ type, episode, media: show }),
  );
</script>

{#snippet tags()}
  <SummaryPosterTags {postCreditsCount} watchCount={$watchCount} />
{/snippet}

<SummaryContainer>
  {#snippet poster()}
    <SummaryPoster
      src={posterSrc}
      alt={title}
      href={streamOn?.preferred?.link}
      {tags}
      variant="landscape"
    >
      {#snippet hoverOverlay()}
        <StreamOnOverlay service={streamOn?.preferred} />
      {/snippet}
    </SummaryPoster>
  {/snippet}

  <SummaryHeader {title}>
    <EpisodeTitle {episode} {show} {showIntl} />
    <SummaryTitle {title} {crew} {type} {episode} media={show} />
    <RatingList ratings={$ratings} airDate={episode.airDate} {type} />
  </SummaryHeader>

  <Spoiler media={episode} {show} {type}>
    <SummaryOverview {title} {overview} />
  </Spoiler>

  <RenderFor audience="authenticated">
    <SummaryActions>
      <RenderFor audience="authenticated">
        <EpisodeActions {episode} {show} {title} {showTitle} />
      </RenderFor>

      {#snippet contextualActions()}
        <RenderFor audience="authenticated">
          <RateNow type="episode" media={episode} {show} />
        </RenderFor>
      {/snippet}
    </SummaryActions>
  </RenderFor>
</SummaryContainer>
