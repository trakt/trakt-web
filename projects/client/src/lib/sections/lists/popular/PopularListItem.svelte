<script lang="ts">
  import DefaultMediaItem from "../components/DefaultMediaItem.svelte";
  import type { MediaCardProps } from "../components/models/MediaCardProps";
  import type { PopularEntry } from "./usePopularList";

  const {
    type,
    media,
    style,
    popupActions,
    mode,
  }: MediaCardProps<PopularEntry> = $props();
</script>

<DefaultMediaItem
  {type}
  {media}
  {style}
  {popupActions}
  {mode}
  source="popular"
  canDeemphasize
/>
