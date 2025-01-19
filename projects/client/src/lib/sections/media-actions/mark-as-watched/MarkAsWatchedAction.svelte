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
  } & MarkAsWatchedStoreProps;

  const {
    style = "action",
    title,
    onAction,
    ...target
  }: MarkAsWatchedActionProps = $props();

  const { isMarkingAsWatched, isWatched, markAsWatched, removeWatched } =
    $derived(useMarkAsWatched(target));

  onMount(() => {
    return isMarkingAsWatched.subscribe((value) => onAction?.(value));
  });
</script>

<MarkAsWatchedButton
  {style}
  {title}
  isWatched={$isWatched}
  isMarkingAsWatched={$isMarkingAsWatched}
  onWatch={markAsWatched}
  onRemove={removeWatched}
/>
