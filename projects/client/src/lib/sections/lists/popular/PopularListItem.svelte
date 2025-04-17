<script lang="ts">
  import DefaultMediaItem from "../components/DefaultMediaItem.svelte";
  import type { MediaCardProps } from "../components/MediaCardProps";
  import type { PopularEntry } from "./usePopularList";

  const { type, media, style }: MediaCardProps<PopularEntry> = $props();
</script>

<DefaultMediaItem {type} {media} {style} />
