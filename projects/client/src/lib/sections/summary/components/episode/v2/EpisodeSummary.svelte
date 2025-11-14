<script lang="ts">
  import RatingList from "$lib/components/summary/RatingList.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { useWatchCount } from "$lib/stores/useWatchCount";
  import SpoilerSection from "../../_internal/SpoilerSection.svelte";
  import Summary from "../../_internal/Summary.svelte";
  import SummaryDetails from "../../_internal/SummaryDetails.svelte";
  import SummaryPosterTags from "../../_internal/SummaryPosterTags.svelte";
  import SummaryRateNow from "../../_internal/SummaryRateNow.svelte";
  import MediaDetails from "../../details/MediaDetails.svelte";
  import { useMediaMetaInfo } from "../../media/useMediaMetaInfo";
  import SummaryTitle from "../../media/v2/_internal/SummaryTitle.svelte";
  import { useIsRateable } from "../../rating/_internal/useIsRateable";
  import type { EpisodeSummaryProps } from "./../../EpisodeSummaryProps";
  import EpisodeActions from "./_internal/EpisodeActions.svelte";
  import EpisodeSideActions from "./_internal/EpisodeSideActions.svelte";
  import EpisodeTitle from "./_internal/EpisodeTitle.svelte";

  const {
    episode,
    show,
    showIntl,
    episodeIntl,
    crew,
  }: Omit<EpisodeSummaryProps, "seasons" | "streamon"> = $props();
  const type = "episode";

  const title = $derived(episodeIntl.title ?? episode.title);
  const overview = $derived(episodeIntl.overview ?? episode.overview);
  const showTitle = $derived(showIntl.title ?? show.title);
  const { watchCount } = $derived(useWatchCount({ show, episode, type }));
  const postCreditsCount = $derived(episode.postCredits?.length ?? 0);

  const { ratings } = $derived(
    useMediaMetaInfo({ type, episode, media: show }),
  );

  const hasTags = $derived(postCreditsCount > 0 || $watchCount > 0);

  const { isRateable } = $derived(
    useIsRateable({ type, media: episode, show }),
  );
</script>

{#snippet tags()}
  <SummaryPosterTags {postCreditsCount} watchCount={$watchCount} />
{/snippet}

{#if $isRateable}
  <NavbarStateSetter>
    {#snippet contextualActions()}
      <SummaryRateNow {type} media={episode} {show} />
    {/snippet}
  </NavbarStateSetter>
{/if}

<Summary>
  {#snippet poster()}
    <SummaryPoster
      src={show.poster.url.medium}
      alt={title}
      tags={hasTags ? tags : undefined}
    />
  {/snippet}

  {#snippet sideActions()}
    <EpisodeSideActions {title} {showTitle} {episode} />
  {/snippet}

  {#snippet meta()}
    <RatingList ratings={$ratings} airDate={episode.airDate} />
    <EpisodeTitle {episode} {show} {showIntl} />
    <SummaryTitle
      {title}
      {type}
      {crew}
      genres={show.genres}
      year={episode.year}
    />

    <RenderFor audience="authenticated">
      <EpisodeActions {episode} {show} {title} {showTitle} />
    </RenderFor>
  {/snippet}

  <SpoilerSection media={episode} {show} {type}>
    <p class="secondary">{overview}</p>
  </SpoilerSection>

  <SummaryDetails {type}>
    <MediaDetails {episode} {crew} {type} />
  </SummaryDetails>
</Summary>
