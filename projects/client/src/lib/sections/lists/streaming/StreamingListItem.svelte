<script lang="ts">
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import TrendTag from "$lib/components/media/tags/TrendTag.svelte";
  import MediaCard from "../components/MediaCard.svelte";
  import type { MediaCardProps } from "../components/MediaCardProps";
  import type { StreamingEntry } from "./useStreamingList";

  const { type, media, style }: MediaCardProps<StreamingEntry> = $props();
</script>

{#snippet tags()}
  <TrendTag i18n={TagIntlProvider} delta={media.delta} />
{/snippet}

<MediaCard {type} {media} {tags} {style} />
