<script lang="ts">
  import AnticipatedTag from "$lib/components/media/tags/AnticipatedTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import MediaItem from "../components/MediaItem.svelte";
  import type { MediaItemProps } from "../components/MediaItemProps";
  import type { AnticipatedMediaItem } from "./useAnticipatedList";

  const { type, media }: MediaItemProps<AnticipatedMediaItem> = $props();
</script>

<MediaItem {type} {media}>
  {#snippet tags()}
    <AnticipatedTag i18n={TagIntlProvider} score={media.score} />
  {/snippet}
</MediaItem>
