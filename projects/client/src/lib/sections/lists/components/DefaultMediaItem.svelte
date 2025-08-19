<script lang="ts">
  import AirDateTag from "$lib/components/media/tags/AirDateTag.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";
  import EpisodeCountTag from "$lib/components/media/tags/EpisodeCountTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaInputDefault } from "$lib/models/MediaInput";
  import CheckInAction from "$lib/sections/media-actions/check-in/CheckInAction.svelte";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { useIsWatched } from "$lib/sections/media-actions/mark-as-watched/useIsWatched";
  import { useIsWatchlisted } from "$lib/sections/media-actions/watchlist/useIsWatchlisted";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import type { MediaCardProps } from "../components/MediaCardProps";
  import MediaItem from "./MediaItem.svelte";
  import MediaSwipe from "./MediaSwipe.svelte";

  const {
    type,
    media,
    style,
    tag,
    canDeemphasize,
    ...rest
  }: MediaCardProps<MediaInputDefault> & { canDeemphasize?: boolean } =
    $props();

  const { isWatched } = $derived(useIsWatched({ type, media }));
  const { isWatchlisted } = $derived(useIsWatchlisted({ type, media }));

  const isDeemphasized = $derived(
    canDeemphasize && ($isWatched || $isWatchlisted),
  );
</script>

{#snippet defaultTag()}
  {#if "episode" in media}
    <EpisodeCountTag i18n={TagIntlProvider} count={media.episode.count} />
  {:else if type === "movie" && rest.variant !== "activity"}
    <AirDateTag i18n={TagIntlProvider} airDate={media.airDate} />
    {#if media.airDate < new Date()}
      <DurationTag i18n={TagIntlProvider} runtime={media.runtime} />
    {/if}
  {/if}
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
      {#if media.type === "movie"}
        <CheckInAction
          style="dropdown-item"
          title={media.title}
          type={media.type}
          {media}
        />
      {/if}
    </RenderFor>
  {/if}
{/snippet}

<MediaSwipe {type} {media} {style}>
  <trakt-default-media-item class:is-deemphasized={isDeemphasized}>
    <MediaItem
      {type}
      {media}
      {style}
      tag={tag ?? defaultTag}
      {...rest}
      {popupActions}
    />
  </trakt-default-media-item>
</MediaSwipe>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  trakt-default-media-item {
    &.is-deemphasized {
      :global(.trakt-card) {
        transition: opacity var(--transition-increment) ease-in-out;
        opacity: var(--de-emphasized-opacity);
      }

      @include for-mouse() {
        &:hover {
          :global(.trakt-card) {
            opacity: 1;
          }
        }
      }
    }
  }
</style>
