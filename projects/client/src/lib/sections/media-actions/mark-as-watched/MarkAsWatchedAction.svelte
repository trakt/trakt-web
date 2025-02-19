<script lang="ts">
  import MarkAsWatchedButton from "$lib/components/buttons/mark-as-watched/MarkAsWatchedButton.svelte";
  import { onMount } from "svelte";
  import { useIsWatchlisted } from "../watchlist/useIsWatchlisted";
  import {
    type MarkAsWatchedStoreProps,
    useMarkAsWatched,
  } from "./useMarkAsWatched";

  type MarkAsWatchedActionProps = {
    style: "normal" | "action" | "dropdown-item";
    title: string;
    onAction?: (state: boolean) => void;
    size?: "normal" | "small";
  } & MarkAsWatchedStoreProps;

  const {
    style = "action",
    size = "normal",
    title,
    onAction,
    ...target
  }: MarkAsWatchedActionProps = $props();

  const {
    isMarkingAsWatched,
    isWatched,
    markAsWatched,
    removeWatched,
    isWatchable,
  } = $derived(useMarkAsWatched(target));

  const { isWatchlisted } = $derived(useIsWatchlisted(target));

  onMount(() => {
    return isMarkingAsWatched.subscribe((value) => onAction?.(value));
  });
</script>

{#if isWatchable}
  <MarkAsWatchedButton
    {style}
    {title}
    {size}
    isWatched={$isWatched && !$isWatchlisted}
    isMarkingAsWatched={$isMarkingAsWatched}
    onWatch={markAsWatched}
    onRemove={removeWatched}
  />
{/if}
