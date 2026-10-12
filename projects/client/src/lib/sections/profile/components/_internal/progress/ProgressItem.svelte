<script lang="ts">
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider.ts";
  import EpisodeRemainingTag from "$lib/components/episode/tags/EpisodeRemainingTag.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { ProgressEntry } from "$lib/requests/models/ProgressEntry.ts";
  import MediaItem from "$lib/sections/lists/components/MediaItem.svelte";
  import type { ProgressListType } from "$lib/sections/profile/components/_internal/useProgressList.ts";
  import DropAction from "$lib/sections/media-actions/drop/DropAction.svelte";
  import { useIsDropped } from "$lib/sections/media-actions/drop/useIsDropped";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import type { Snippet } from "svelte";

  type ProgressItemProps = {
    entry: ProgressEntry;
    style?: "cover" | "summary";
    type: ProgressListType;
    sortTag?: Snippet;
  };

  const { entry, style = "cover", type, sortTag }: ProgressItemProps = $props();

  const { isDropped } = $derived(useIsDropped(entry.show));
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
    <MarkAsWatchedAction
      style="dropdown-item"
      type="show"
      title={entry.show.title}
      media={entry.show}
    />
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
  {sortTag}
  coverTag={type === "in-progress" ? coverTag : undefined}
  {popupActions}
/>
