<script lang="ts">
  import BookmarkIcon from "$lib/components/icons/BookmarkIcon.svelte";
  import AirDateTag from "$lib/components/media/tags/AirDateTag.svelte";
  import CertificationTag from "$lib/components/media/tags/CertificationTag.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";
  import EpisodeCountTag from "$lib/components/media/tags/EpisodeCountTag.svelte";
  import IndicatorTag from "$lib/components/media/tags/IndicatorTag.svelte";
  import MediaIconTag from "$lib/components/media/tags/MediaIconTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import TagBar from "$lib/components/tags/TagBar.svelte";
  import TrackIcon from "$lib/components/TrackIcon.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaInputDefault } from "$lib/models/MediaInput";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { useIsWatched } from "$lib/sections/media-actions/mark-as-watched/useIsWatched";
  import { useIsWatchlisted } from "$lib/sections/media-actions/watchlist/useIsWatchlisted";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import type { Snippet } from "svelte";
  import type { MediaCardProps } from "../components/models/MediaCardProps";
  import MediaItem from "./MediaItem.svelte";
  import MediaSwipe from "./MediaSwipe.svelte";

  const {
    type,
    media,
    style,
    mode,
    tag: externalTag,
    canDeemphasize,
    ...rest
  }: MediaCardProps<MediaInputDefault> & {
    canDeemphasize?: boolean;
    sortTag?: Snippet;
  } = $props();

  const { isWatched } = $derived(useIsWatched({ type, media }));
  const { isWatchlisted } = $derived(useIsWatchlisted({ type, media }));

  const isDeemphasized = $derived(canDeemphasize && $isWatched);

  const isSummary = $derived(style === "summary");
</script>

{#snippet contextualTag()}
  {#if mode === "mixed"}
    <MediaIconTag mediaType={media.type} />
  {/if}
{/snippet}

{#snippet defaultTag()}
  {#if "episode" in media}
    <AirDateTag i18n={TagIntlProvider} airDate={media.airDate} />
    <EpisodeCountTag i18n={TagIntlProvider} count={media.episode.count} />
  {:else if type === "movie" && rest.variant !== "activity" && rest.variant !== "next"}
    <AirDateTag i18n={TagIntlProvider} airDate={media.airDate} />
    {#if media.airDate < new Date()}
      <DurationTag i18n={TagIntlProvider} runtime={media.runtime} />
    {/if}
  {/if}

  {#if isSummary && media.certification}
    <CertificationTag certification={media.certification} />
  {/if}
{/snippet}

{#snippet indicatorTags()}
  {#if $isWatched}
    <IndicatorTag>
      <TrackIcon />
    </IndicatorTag>
  {:else if $isWatchlisted}
    <IndicatorTag>
      <BookmarkIcon state="added" />
    </IndicatorTag>
  {/if}
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
    <RenderFor audience="authenticated">
      <WatchlistAction
        style="dropdown-item"
        title={media.title}
        type={media.type}
        {media}
      />
      <MarkAsWatchedAction
        style="dropdown-item"
        title={media.title}
        type={media.type}
        {media}
      />
    </RenderFor>
  {/if}
{/snippet}

<MediaSwipe {type} {media} {style}>
  <trakt-default-media-item class:is-deemphasized={isDeemphasized}>
    <MediaItem
      {type}
      {media}
      {style}
      tag={rest.variant !== "next" ? tag : undefined}
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
