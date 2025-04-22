<script lang="ts">
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import TrendTag from "$lib/components/media/tags/TrendTag.svelte";
  import DefaultMediaItem from "../components/DefaultMediaItem.svelte";
  import type { MediaCardProps } from "../components/MediaCardProps";
  import type { StreamingEntry } from "./useStreamingList";

  const { type, media, style }: MediaCardProps<StreamingEntry> = $props();
</script>

{#snippet tag()}
  <TrendTag i18n={TagIntlProvider} delta={media.delta} />
{/snippet}

<DefaultMediaItem {type} {media} {tag} {style} />
