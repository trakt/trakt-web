<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import * as m from "$lib/features/i18n/messages";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import TrackAction from "$lib/sections/media-actions/mark-as-watched/TrackAction.svelte";
  import MediaReactionsAction from "$lib/sections/summary/components/reactions/MediaReactionsAction.svelte";
  import SummaryActionsBar from "../../_internal/SummaryActionsBar.svelte";
  import EpisodePopupActions from "./_internal/EpisodePopupActions.svelte";

  const {
    episode,
    show,
    title,
    showTitle,
    onHistoryOpen,
  }: {
    episode: EpisodeEntry;
    show: ShowEntry;
    title: string;
    showTitle: string;
    onHistoryOpen?: () => void;
  } = $props();
</script>

{#snippet popupActions()}
  <EpisodePopupActions {episode} {show} {title} {showTitle} {onHistoryOpen} />
{/snippet}

<SummaryActionsBar
  popup={{
    title,
    actions: popupActions,
    metaInfo: `${showTitle} • ${m.text_season_episode_number(episode)}`,
  }}
>
  <TrackAction {title} type="episode" media={episode} {show} />
  <RenderForFeature flag={FeatureFlag.Reactions}>
    {#snippet enabled()}
      <MediaReactionsAction target={{ type: "episode", id: episode.id }} />
    {/snippet}
  </RenderForFeature>
</SummaryActionsBar>
