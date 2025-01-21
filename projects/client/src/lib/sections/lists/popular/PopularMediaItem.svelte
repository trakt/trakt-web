<script lang="ts">
  import MediaItem from "../components/MediaItem.svelte";
  import type { MediaItemProps } from "../components/MediaItemProps";
  import type { MediaStyleProps } from "../components/MediaStyleProps";
  import type { PopularMediaItem } from "./usePopularList";

  const {
    type,
    media,
    style,
  }: MediaItemProps<PopularMediaItem> & MediaStyleProps = $props();
</script>

<MediaItem {type} {media} {style} />
