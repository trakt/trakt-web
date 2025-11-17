<script lang="ts">
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import TrackAction from "$lib/sections/media-actions/mark-as-watched/TrackAction.svelte";
  import SummaryActions from "../../../_internal/SummaryActions.svelte";
  import EpisodeActionsDrawer from "./EpisodeActionsDrawer.svelte";

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

<SummaryActions>
  <TrackAction {title} type="episode" media={episode} {show} />
  <EpisodeActionsDrawer {episode} {show} {title} {showTitle} />
</SummaryActions>
