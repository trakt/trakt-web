<script lang="ts">
  import MarkAsWatchedButton from "$lib/components/buttons/mark-as-watched/MarkAsWatchedButton.svelte";
  import { useIsWatchlisted } from "../watchlist/useIsWatchlisted";
  import type { MarkAsWatchedActionProps } from "./MarkAsWatchedActionProps";
  import { useMarkAsWatched } from "./useMarkAsWatched";

  const {
    style = "action",
    size = "normal",
    title,
    allowRewatch = false,
    i18n,
    ...target
  }: MarkAsWatchedActionProps = $props();

  const {
    isMarkingAsWatched,
    isWatched,
    markAsWatched,
    removeWatched,
    isWatchable,
  } = $derived(useMarkAsWatched({ ...target, title }));

  const { isWatchlisted } = $derived(useIsWatchlisted(target));
  const isRewatching = $derived(allowRewatch && $isWatched);
</script>

{#if isWatchable}
  <MarkAsWatchedButton
    {style}
    {title}
    {size}
    {i18n}
    isWatched={$isWatched && !$isWatchlisted}
    {isRewatching}
    isMarkingAsWatched={$isMarkingAsWatched}
    onWatch={markAsWatched}
    onRemove={removeWatched}
  />
{/if}
