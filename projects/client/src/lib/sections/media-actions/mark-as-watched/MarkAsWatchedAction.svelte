<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import MarkAsWatchedButton from "$lib/components/buttons/mark-as-watched/MarkAsWatchedButton.svelte";
  import { onMount } from "svelte";
  import { attachWarning } from "../_internal/attachWarning";
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

  const isShow = $derived(target.type === "show");
  const episodeCount = $derived(
    target.type === "episode" &&
      Array.isArray(target.episode) &&
      target.episode.length,
  );

  const isMultipleEpisodes = $derived(episodeCount && episodeCount > 1);
  const isDangerousAction = $derived(isShow || isMultipleEpisodes);

  const message = $derived.by(() => {
    if (!isDangerousAction) return "";

    return target.type === "show"
      ? m.mark_as_watched_show_warning({ title })
      : m.mark_as_watched_multiple_episodes_warning({ count: episodeCount });
  });

  const onWatchHandler = $derived(
    isDangerousAction ? attachWarning(markAsWatched, message) : markAsWatched,
  );

  const onRemoveHandler = $derived(
    attachWarning(removeWatched, m.remove_from_watched_warning({ title })),
  );

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
    onWatch={onWatchHandler}
    onRemove={onRemoveHandler}
  />
{/if}
