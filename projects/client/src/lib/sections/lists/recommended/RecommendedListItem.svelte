<script lang="ts">
  import MediaCard from "../components/MediaCard.svelte";
  import type { MediaCardProps } from "../components/MediaCardProps";
  import type { MediaStyleProps } from "../components/MediaStyleProps";
  import type { RecommendedEntry } from "./useRecommendedList";

  const {
    type,
    media,
    style,
  }: MediaCardProps<RecommendedEntry> & MediaStyleProps = $props();
</script>

<MediaCard {type} {media} {style} />
