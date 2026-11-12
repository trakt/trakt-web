<script lang="ts">
  import AirDateTag from "$lib/components/media/tags/AirDateTag.svelte";
  import CertificationTag from "$lib/components/media/tags/CertificationTag.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";
  import EpisodeCountTag from "$lib/components/media/tags/EpisodeCountTag.svelte";
  import MediaIconTag from "$lib/components/media/tags/MediaIconTag.svelte";
  import PosterTags from "$lib/components/media/tags/PosterTags.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import TagBar from "$lib/components/tags/TagBar.svelte";
  import { useLargeScreen } from "$lib/features/large-screen-cards/useLargeScreen.ts";
  import { useLargeScreenCards } from "$lib/features/large-screen-cards/useLargeScreenCards.ts";
  import type { MediaInputDefault } from "$lib/models/MediaInput";
  import { useIsDropped } from "$lib/sections/media-actions/drop/useIsDropped";
  import { useIsWatched } from "$lib/sections/media-actions/mark-as-watched/useIsWatched";
  import { useIsRewatching } from "$lib/sections/media-actions/rewatching/useIsRewatching";
  import { useIsWatchlisted } from "$lib/stores/useIsWatchlisted";
  import type { Snippet } from "svelte";
  import type { MediaCardProps } from "../components/models/MediaCardProps";
  import DefaultMediaPopupActions from "./DefaultMediaPopupActions.svelte";
  import { resolveItemCardStyle } from "$lib/sections/lists/utils/resolveItemCardStyle.ts";
  import { resolveSummaryCardLayout } from "$lib/sections/lists/utils/resolveSummaryCardLayout.ts";
  import MediaItem from "./MediaItem.svelte";
  import MediaSwipe from "./MediaSwipe.svelte";

  const {
    type,
    media,
    style,
    mode,
    tag: externalTag,
    coverTag: externalCoverTag,
    canDeemphasize,
    popupActions: externalPopupActions,
    ...rest
  }: DistributiveOmit<MediaCardProps<MediaInputDefault>, "popupActions"> & {
    canDeemphasize?: boolean;
    sortTag?: Snippet;
    popupActions?: Snippet | null;
  } = $props();

  const { isWatched, isPartiallyWatched } = $derived(
    useIsWatched({ type, media }),
  );
  const { isRewatching } = $derived(useIsRewatching({ type, media }));
  const { isWatchlisted } = $derived(useIsWatchlisted({ type, media }));
  const { isDropped } = $derived(useIsDropped(media));

  const isDeemphasized = $derived(canDeemphasize && $isWatched);

  const isLargeScreenCards = useLargeScreenCards();
  const isSummary = $derived(
    resolveItemCardStyle(style ?? "cover", $isLargeScreenCards) === "summary",
  );

  const hasHoverTag = $derived(Boolean(externalTag || media.certification));

  const isLargeScreen = useLargeScreen();
  const isLargeLayout = $derived(
    isSummary &&
      resolveSummaryCardLayout({
          style: style ?? "cover",
          isLargeScreen: $isLargeScreen,
        }) === "large",
  );

  const hasReleaseTags = $derived(
    "episode" in media ||
      (type === "movie" && rest.variant !== "activity" &&
        rest.variant !== "next"),
  );

</script>

{#snippet contextualTag()}
  {#if mode === "mixed"}
    <MediaIconTag mediaType={media.type} />
  {/if}
{/snippet}

{#snippet releaseTag()}
  {#if hasReleaseTags}
    <AirDateTag i18n={TagIntlProvider} airDate={media.airDate} year={media.year} />
  {/if}
{/snippet}

{#snippet lengthTag()}
  {#if "episode" in media}
    {#if !isLargeLayout || media.episode.count > 0}
      <EpisodeCountTag i18n={TagIntlProvider} count={media.episode.count} />
    {/if}
  {:else if hasReleaseTags && media.airDate < new Date()}
    <DurationTag i18n={TagIntlProvider} runtime={media.runtime} />
  {/if}
{/snippet}

{#snippet certificationTag()}
  {#if media.certification}
    <CertificationTag certification={media.certification} />
  {/if}
{/snippet}

{#snippet defaultTag(hasCertification: boolean)}
  {@render releaseTag()}
  {@render lengthTag()}

  {#if hasCertification}
    {@render certificationTag()}
  {/if}
{/snippet}

{#snippet detailsTag()}
  <TagBar isWrappable>
    {@render defaultTag(true)}
  </TagBar>
{/snippet}

{#snippet indicatorTags()}
  <PosterTags
    isRewatching={$isRewatching}
    isWatched={$isWatched}
    isPartiallyWatched={$isPartiallyWatched}
    isWatchlisted={$isWatchlisted}
    isDropped={$isDropped}
  />
{/snippet}

{#snippet tag()}
  <TagBar isWrappable={isLargeLayout}>
    {#if !isSummary}
      {@render contextualTag()}
    {/if}

    {#if isSummary}
      {#if mode === "mixed"}
        {@render contextualTag()}
      {/if}
      {@render externalTag?.()}
      {#if !isLargeLayout}
        {@render defaultTag(true)}
      {/if}
    {:else if externalTag}
      {@render externalTag()}
    {:else}
      {@render defaultTag(false)}
    {/if}
  </TagBar>
{/snippet}

{#snippet hoverTag()}
  <TagBar>
    {#if externalTag}
      {@render defaultTag(true)}
    {:else if media.certification}
      <CertificationTag certification={media.certification} />
    {/if}
  </TagBar>
{/snippet}

{#snippet popupActions()}
  {#if externalPopupActions}
    {@render externalPopupActions()}
  {:else}
    <DefaultMediaPopupActions {media} />
  {/if}
{/snippet}

<MediaSwipe {type} {media} {style}>
  <trakt-default-media-item
    role="listitem"
    class:is-deemphasized={isDeemphasized}
  >
    <MediaItem
      {type}
      {media}
      {style}
      tag={rest.variant !== "next" ? tag : undefined}
      hoverTag={hasHoverTag ? hoverTag : undefined}
      detailsTag={isLargeLayout ? detailsTag : undefined}
      coverTag={externalCoverTag}
      indicators={indicatorTags}
      {...rest}
      popupActions={externalPopupActions === null ? undefined : popupActions}
    />
  </trakt-default-media-item>
</MediaSwipe>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  trakt-default-media-item {
    &.is-deemphasized {
      /* FIXME: find the root cause why on safari this does not work on .trakt-card */
      :global(.trakt-card-cover-image) {
        transition: opacity var(--transition-increment) ease-in-out;
        opacity: var(--de-emphasized-opacity);
      }

      @include for-mouse() {
        &:hover {
          :global(.trakt-card-cover-image) {
            opacity: 1;
          }
        }
      }
    }
  }
</style>
