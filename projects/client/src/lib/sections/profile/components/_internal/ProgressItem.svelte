<script lang="ts">
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider.ts";
  import EpisodeRemainingTag from "$lib/components/episode/tags/EpisodeRemainingTag.svelte";
  import type { ProgressEntry } from "$lib/requests/models/ProgressEntry.ts";
  import MediaItem from "$lib/sections/lists/components/MediaItem.svelte";

  type ProgressItemProps = {
    entry: ProgressEntry;
    style?: "cover" | "summary";
    type: "in-progress" | "completed" | "dropped";
  };

  const { entry, style = "cover", type }: ProgressItemProps = $props();
</script>

{#snippet coverTag()}
  {#if entry.type === "watched" && entry.remaining > 0}
    <EpisodeRemainingTag
      i18n={EpisodeIntlProvider}
      remaining={entry.remaining}
      type="tag"
    />
  {/if}
{/snippet}

<MediaItem
  media={entry.show}
  type="show"
  source="progress"
  variant="progress"
  {style}
  coverTag={type === "in-progress" ? coverTag : undefined}
/>
