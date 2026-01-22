<script lang="ts">
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import SetCoverImageAction from "$lib/sections/media-actions/cover-image/SetCoverImageAction.svelte";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { useIsWatched } from "$lib/sections/media-actions/mark-as-watched/useIsWatched";
  import EpisodeSideActions from "./EpisodeSideActions.svelte";

  const {
    episode,
    show,
    title,
    showTitle,
  }: {
    episode: EpisodeEntry;
    show: ShowEntry;
    title: string;
    showTitle: string;
  } = $props();

  const { isWatched } = $derived(
    useIsWatched({ media: episode, show, type: "episode" }),
  );
</script>

{#if $isWatched}
  <MarkAsWatchedAction
    style="dropdown-item"
    type="episode"
    media={episode}
    mode="ask"
    {title}
    {show}
  />
{/if}

<EpisodeSideActions
  {title}
  {showTitle}
  {episode}
  style="dropdown-item"
  variant="primary"
/>

<SetCoverImageAction
  style="dropdown-item"
  type="episode"
  id={episode.id}
  {title}
  variant="primary"
/>
