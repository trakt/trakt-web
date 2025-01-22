<script lang="ts">
  import MediaCard from "../components/MediaCard.svelte";
  import type { MediaCardProps } from "../components/MediaCardProps";
  import type { MediaStyleProps } from "../components/MediaStyleProps";
  import type { PopularEntry } from "./usePopularList";

  const { type, media, style }: MediaCardProps<PopularEntry> & MediaStyleProps =
    $props();
</script>

<MediaCard {type} {media} {style} />
