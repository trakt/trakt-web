<script lang="ts">
  import AirDateTag from "$lib/components/media/tags/AirDateTag.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";
  import EpisodeCountTag from "$lib/components/media/tags/EpisodeCountTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaInputDefault } from "$lib/models/MediaInput";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import MediaCard from "../components/MediaCard.svelte";
  import type { MediaCardProps } from "../components/MediaCardProps";

  const {
    type,
    media,
    style,
    variant,
    ...rest
  }: MediaCardProps<MediaInputDefault> = $props();
</script>

{#snippet tag()}
  {#if media.airDate > new Date()}
    <AirDateTag
      i18n={TagIntlProvider}
      year={media.year}
      airDate={media.airDate}
    />
  {:else if "episode" in media}
    <EpisodeCountTag i18n={TagIntlProvider} count={media.episode.count} />
  {:else if type === "movie" && variant !== "activity"}
    <DurationTag i18n={TagIntlProvider} runtime={media.runtime} />
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
    </RenderFor>
  {/if}
{/snippet}

<MediaCard {type} {media} {style} {tag} {...rest} {popupActions} />
