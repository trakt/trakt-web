<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import TrackAction from "$lib/sections/media-actions/mark-as-watched/TrackAction.svelte";
  import SummaryActionsBar from "../../../_internal/SummaryActionsBar.svelte";
  import EpisodePopupActions from "./EpisodePopupActions.svelte";

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

{#snippet popupActions()}
  <EpisodePopupActions {episode} {show} {title} {showTitle} />
{/snippet}

<SummaryActionsBar
  popup={{
    title,
    actions: popupActions,
    metaInfo: `${showTitle} • ${m.text_season_episode_number(episode)}`,
  }}
>
  <TrackAction {title} type="episode" media={episode} {show} />
</SummaryActionsBar>
