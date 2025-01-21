<script lang="ts">
  import AnticipatedTag from "$lib/components/media/tags/AnticipatedTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import MediaItem from "../components/MediaItem.svelte";
  import type { MediaItemProps } from "../components/MediaItemProps";
  import type { MediaStyleProps } from "../components/MediaStyleProps";
  import type { AnticipatedMediaItem } from "./useAnticipatedList";

  const {
    type,
    media,
    style,
  }: MediaItemProps<AnticipatedMediaItem> & MediaStyleProps = $props();
</script>

{#snippet tags()}
  <AnticipatedTag i18n={TagIntlProvider} score={media.score} />
{/snippet}

<MediaItem {type} {media} {tags} {style} />
