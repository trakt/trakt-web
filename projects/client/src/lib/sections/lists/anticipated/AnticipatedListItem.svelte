<script lang="ts">
  import AnticipatedTag from "$lib/components/media/tags/AnticipatedTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import MediaCard from "../components/MediaCard.svelte";
  import type { MediaCardProps } from "../components/MediaCardProps";
  import type { MediaStyleProps } from "../components/MediaStyleProps";
  import type { AnticipatedMediaItem } from "./useAnticipatedList";

  const {
    type,
    media,
    style,
  }: MediaCardProps<AnticipatedMediaItem> & MediaStyleProps = $props();
</script>

{#snippet tags()}
  <AnticipatedTag i18n={TagIntlProvider} score={media.score} />
{/snippet}

<MediaCard {type} {media} {tags} {style} />
