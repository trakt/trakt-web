<script lang="ts">
  import AnticipatedTag from "$lib/components/media/tags/AnticipatedTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import type { AnticipatedMediaItem } from "../stores/useAnticipatedList";
  import MediaItem from "./MediaItem.svelte";
  import type { MediaItemProps } from "./MediaItemProps";

  const { type, media }: MediaItemProps<AnticipatedMediaItem> = $props();
</script>

<MediaItem {type} {media}>
  {#snippet tags()}
    <AnticipatedTag i18n={TagIntlProvider} score={media.score} />
  {/snippet}
</MediaItem>
