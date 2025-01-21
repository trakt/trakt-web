<script lang="ts">
  import MediaItem from "../components/MediaItem.svelte";
  import type { MediaItemProps } from "../components/MediaItemProps";
  import type { MediaStyleProps } from "../components/MediaStyleProps";
  import type { RecommendedMediaItem } from "./useRecommendedList";

  const {
    type,
    media,
    style,
  }: MediaItemProps<RecommendedMediaItem> & MediaStyleProps = $props();
</script>

<MediaItem {type} {media} {style} />
