<script lang="ts">
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import type { StreamOn } from "$lib/requests/models/StreamOn";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { useWatchCount } from "$lib/stores/useWatchCount";
  import SummaryActions from "../../../_internal/SummaryActions.svelte";
  import { TrackIntlProvider } from "../../../media/v2/_internal/TrackIntlProvider";
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

  const { watchCount } = $derived(
    useWatchCount({ show, episode, type: "episode" }),
  );
</script>

<SummaryActions>
  <MarkAsWatchedAction
    style="normal"
    type="episode"
    {title}
    media={episode}
    {show}
    size="small"
    allowRewatch={$watchCount > 0}
    i18n={TrackIntlProvider}
  />

  <EpisodeActionsPopupMenu {episode} {show} {title} {showTitle} {streamOn} />
</SummaryActions>
