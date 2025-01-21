<script lang="ts">
  import MediaCard from "../components/MediaCard.svelte";
  import type { MediaCardProps } from "../components/MediaCardProps";
  import type { MediaStyleProps } from "../components/MediaStyleProps";
  import type { PopularMediaItem } from "./usePopularList";

  const {
    type,
    media,
    style,
  }: MediaCardProps<PopularMediaItem> & MediaStyleProps = $props();
</script>

<MediaCard {type} {media} {style} />
