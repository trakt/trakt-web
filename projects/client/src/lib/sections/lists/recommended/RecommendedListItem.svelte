<script lang="ts">
  import DefaultMediaItem from "../components/DefaultMediaItem.svelte";
  import type { MediaCardProps } from "../components/MediaCardProps";
  import type { RecommendedEntry } from "./useRecommendedList";

  const { type, media, style }: MediaCardProps<RecommendedEntry> = $props();
</script>

<DefaultMediaItem {type} {media} {style} canDeemphasize />
