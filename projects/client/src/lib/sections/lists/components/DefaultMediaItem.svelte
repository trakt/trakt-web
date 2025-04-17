<script lang="ts">
  import AirDateTag from "$lib/components/media/tags/AirDateTag.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";
  import EpisodeCountTag from "$lib/components/media/tags/EpisodeCountTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import type { MediaInputDefault } from "$lib/models/MediaInput";
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

{#snippet tags()}
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

<MediaCard {type} {media} {style} {tags} {...rest} />
