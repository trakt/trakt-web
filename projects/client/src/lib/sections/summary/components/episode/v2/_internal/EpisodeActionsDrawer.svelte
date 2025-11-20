<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import CheckInAction from "$lib/sections/media-actions/check-in/CheckInAction.svelte";
  import SetCoverImageAction from "$lib/sections/media-actions/cover-image/SetCoverImageAction.svelte";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { useIsWatched } from "$lib/sections/media-actions/mark-as-watched/useIsWatched";
  import SummaryActionsDrawer from "../../../_internal/SummaryActionsDrawer.svelte";
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

<SummaryActionsDrawer
  {title}
  metaInfo={`${showTitle} • ${m.text_season_episode_number(episode)}`}
>
  {#if $isWatched}
    <MarkAsWatchedAction
      style="dropdown-item"
      type="episode"
      media={episode}
      mode="act"
      {title}
      {show}
    />
  {/if}

  <MarkAsWatchedAction
    style="dropdown-item"
    type="episode"
    media={episode}
    mode="ask"
    {title}
    {show}
  />

  <CheckInAction
    {show}
    {episode}
    {title}
    size="small"
    style="dropdown-item"
    type="episode"
    variant="primary"
  />

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
</SummaryActionsDrawer>
