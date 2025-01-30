<script lang="ts">
  import MarkAsWatchedButton from "$lib/components/buttons/mark-as-watched/MarkAsWatchedButton.svelte";
  import { onMount } from "svelte";
  import {
    type MarkAsWatchedStoreProps,
    useMarkAsWatched,
  } from "./useMarkAsWatched";

  type MarkAsWatchedActionProps = {
    style: "normal" | "action";
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

  onMount(() => {
    return isMarkingAsWatched.subscribe((value) => onAction?.(value));
  });
</script>

{#if isWatchable}
  <MarkAsWatchedButton
    {style}
    {title}
    {size}
    isWatched={$isWatched}
    isMarkingAsWatched={$isMarkingAsWatched}
    onWatch={markAsWatched}
    onRemove={removeWatched}
  />
{/if}
