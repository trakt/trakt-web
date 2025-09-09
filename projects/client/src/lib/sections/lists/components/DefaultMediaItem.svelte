<script lang="ts">
  import AirDateTag from "$lib/components/media/tags/AirDateTag.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";
  import EpisodeCountTag from "$lib/components/media/tags/EpisodeCountTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaInputDefault } from "$lib/models/MediaInput";
  import CheckInAction from "$lib/sections/media-actions/check-in/CheckInAction.svelte";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import type { MediaCardProps } from "../components/MediaCardProps";
  import MediaItem from "./MediaItem.svelte";
  import MediaSwipe from "./MediaSwipe.svelte";

  const {
    type,
    media,
    style,
    tag,
    ...rest
  }: MediaCardProps<MediaInputDefault> = $props();
</script>

{#snippet defaultTag()}
  {#if "episode" in media}
    <AirDateTag i18n={TagIntlProvider} airDate={media.airDate} />
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
  <MediaItem
    {type}
    {media}
    {style}
    tag={tag ?? defaultTag}
    {...rest}
    {popupActions}
  />
</MediaSwipe>
