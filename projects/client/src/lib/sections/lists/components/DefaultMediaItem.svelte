<script lang="ts">
  import AirDateTag from "$lib/components/media/tags/AirDateTag.svelte";
  import CertificationTag from "$lib/components/media/tags/CertificationTag.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";
  import EpisodeCountTag from "$lib/components/media/tags/EpisodeCountTag.svelte";
  import MediaIconTag from "$lib/components/media/tags/MediaIconTag.svelte";
  import PosterTags from "$lib/components/media/tags/PosterTags.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import TagBar from "$lib/components/tags/TagBar.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { useLargeScreenCards } from "$lib/features/large-screen-cards/useLargeScreenCards.ts";
  import type { MediaInputDefault } from "$lib/models/MediaInput";
  import { manageListsDrawerStore } from "$lib/sections/components/lists-drawer/manageListsDrawerStore";
  import { useIsDropped } from "$lib/sections/media-actions/drop/useIsDropped";
  import { useIsWatched } from "$lib/sections/media-actions/mark-as-watched/useIsWatched";
  import { useIsRewatching } from "$lib/sections/media-actions/rewatching/useIsRewatching";
  import { useIsWatchlisted } from "$lib/stores/useIsWatchlisted";
  import type { Snippet } from "svelte";
  import type { MediaCardProps } from "../components/models/MediaCardProps";
  import DefaultMediaPopupActions from "./DefaultMediaPopupActions.svelte";
  import { resolveItemCardStyle } from "./_internal/resolveItemCardStyle.ts";
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
    ...rest
  }: MediaCardProps<MediaInputDefault> & {
    canDeemphasize?: boolean;
    sortTag?: Snippet;
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

</script>

{#snippet contextualTag()}
  {#if mode === "mixed"}
    <MediaIconTag mediaType={media.type} />
  {/if}
{/snippet}

{#snippet defaultTag()}
  {#if "episode" in media}
    <AirDateTag i18n={TagIntlProvider} airDate={media.airDate} year={media.year} />
    <EpisodeCountTag i18n={TagIntlProvider} count={media.episode.count} />
  {:else if type === "movie" && rest.variant !== "activity" && rest.variant !== "next"}
    <AirDateTag i18n={TagIntlProvider} airDate={media.airDate} year={media.year} />
    {#if media.airDate < new Date()}
      <DurationTag i18n={TagIntlProvider} runtime={media.runtime} />
    {/if}
  {/if}

  {#if isSummary && media.certification}
    <CertificationTag certification={media.certification} />
  {/if}
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
  <TagBar>
    {#if !isSummary}
      {@render contextualTag()}
    {/if}

    {#if isSummary}
      {#if mode === "mixed"}
        <RenderFor audience="all" device={["mobile", "tablet-sm"]}>
          {@render contextualTag()}
        </RenderFor>
      {/if}
      {@render externalTag?.()}
      {@render defaultTag()}
    {:else if externalTag}
      {@render externalTag()}
    {:else}
      {@render defaultTag()}
    {/if}
  </TagBar>
{/snippet}

{#snippet popupActions()}
  {#if rest.popupActions}
    {@render rest.popupActions()}
  {:else}
    <DefaultMediaPopupActions
      {media}
      onListAction={() =>
        manageListsDrawerStore.open({ media, metaInfo: media.title })}
    />
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
      coverTag={externalCoverTag}
      contextualTag={mode === "mixed" ? contextualTag : undefined}
      indicators={indicatorTags}
      {...rest}
      {popupActions}
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
