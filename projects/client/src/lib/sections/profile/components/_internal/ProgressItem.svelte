<script lang="ts">
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider.ts";
  import EpisodeRemainingTag from "$lib/components/episode/tags/EpisodeRemainingTag.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { ProgressEntry } from "$lib/requests/models/ProgressEntry.ts";
  import MediaItem from "$lib/sections/lists/components/MediaItem.svelte";
  import DropAction from "$lib/sections/media-actions/drop/DropAction.svelte";
  import { useIsDropped } from "$lib/sections/media-actions/drop/useIsDropped";

  type ProgressItemProps = {
    entry: ProgressEntry;
    style?: "cover" | "summary";
    type: "in-progress" | "completed" | "dropped";
  };

  const { entry, style = "cover", type }: ProgressItemProps = $props();

  const { isDropped } = $derived(useIsDropped(entry.show));
  const hasActions = $derived(!$isDropped);
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

{#snippet popupActions()}
  <RenderFor audience="authenticated">
    {#if !$isDropped}
      <DropAction
        style="dropdown-item"
        type="show"
        id={entry.show.id}
        title={entry.show.title}
      />
    {/if}
  </RenderFor>
{/snippet}

<MediaItem
  media={entry.show}
  type="show"
  source="progress"
  variant="progress"
  {style}
  coverTag={type === "in-progress" ? coverTag : undefined}
  popupActions={hasActions ? popupActions : undefined}
/>
