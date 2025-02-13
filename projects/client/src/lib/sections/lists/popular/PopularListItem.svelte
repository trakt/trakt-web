<script lang="ts">
  import MediaCard from "../components/MediaCard.svelte";
  import type { MediaCardProps } from "../components/MediaCardProps";
  import type { PopularEntry } from "./usePopularList";

  const { type, media, style }: MediaCardProps<PopularEntry> = $props();
</script>

<MediaCard {type} {media} {style} />
