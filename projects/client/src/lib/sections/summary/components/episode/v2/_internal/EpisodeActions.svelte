<script lang="ts">
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import type { StreamOn } from "$lib/requests/models/StreamOn";
  import TrackAction from "$lib/sections/media-actions/mark-as-watched/TrackAction.svelte";
  import SummaryActions from "../../../_internal/SummaryActions.svelte";
  import EpisodeActionsPopupMenu from "./EpisodeActionsPopupMenu.svelte";

  const {
    episode,
    show,
    title,
    showTitle,
    streamOn,
  }: {
    episode: EpisodeEntry;
    show: ShowEntry;
    title: string;
    showTitle: string;
    streamOn?: StreamOn;
  } = $props();
</script>

<SummaryActions>
  <TrackAction {title} type="episode" media={episode} {show} />
  <EpisodeActionsPopupMenu {episode} {show} {title} {showTitle} {streamOn} />
</SummaryActions>
