<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import ReportButton from "$lib/features/report/ReportButton.svelte";
  import { ReportableType } from "$lib/features/report/models/ReportableType.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import ModerateAction from "$lib/sections/components/admin/ModerateAction.svelte";
  import SetCoverImageAction from "$lib/sections/media-actions/cover-image/SetCoverImageAction.svelte";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { useIsWatched } from "$lib/sections/media-actions/mark-as-watched/useIsWatched";
  import HistoryButton from "$lib/sections/summary/components/history/HistoryButton.svelte";
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

<HistoryButton />

<RenderFor audience="authenticated">
  <ReportButton
    params={{ type: ReportableType.Episode, id: episode.id, title }}
    label={m.button_label_report_media({ title })}
    variant="primary"
  />
</RenderFor>

<ModerateAction />
