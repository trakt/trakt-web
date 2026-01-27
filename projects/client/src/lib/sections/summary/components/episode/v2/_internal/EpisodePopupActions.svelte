<script lang="ts">
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import SetCoverImageAction from "$lib/sections/media-actions/cover-image/SetCoverImageAction.svelte";
  import WatchAgainAction from "../../../_internal/WatchAgainAction.svelte";
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
</script>

<WatchAgainAction type="episode" media={episode} {show} {title} />

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
