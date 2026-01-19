<script lang="ts">
  import DefaultMediaItem from "../components/DefaultMediaItem.svelte";
  import type { MediaCardProps } from "../components/models/MediaCardProps";
  import type { RecommendedEntry } from "./useRecommendedList";

  const { type, media, style, mode }: MediaCardProps<RecommendedEntry> =
    $props();
</script>

<DefaultMediaItem
  {type}
  {media}
  {style}
  {mode}
  source="recommended"
  canDeemphasize
/>
