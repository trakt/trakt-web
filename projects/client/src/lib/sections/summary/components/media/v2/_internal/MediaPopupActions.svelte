<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import ReportButton from "$lib/features/report/ReportButton.svelte";
  import type { ReportParams } from "$lib/features/report/models/ReportParams.ts";
  import { ReportableType } from "$lib/features/report/models/ReportableType.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import ListAction from "$lib/sections/components/lists-drawer/ListAction.svelte";
  import SetCoverImageAction from "$lib/sections/media-actions/cover-image/SetCoverImageAction.svelte";
  import DropAction from "$lib/sections/media-actions/drop/DropAction.svelte";
  import { useIsDropped } from "$lib/sections/media-actions/drop/useIsDropped";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { useIsWatched } from "$lib/sections/media-actions/mark-as-watched/useIsWatched";
  import HistoryButton from "$lib/sections/summary/components/history/HistoryButton.svelte";
  import SideActions from "./SideActions.svelte";

  type MediaPopupActionsProps = {
    media: MediaEntry;
    title: string;
    onListAction: () => void;
  };

  const { media, title, onListAction }: MediaPopupActionsProps = $props();

  const { isWatched } = $derived(useIsWatched({ media, type: media.type }));
  const { isDropped } = $derived(useIsDropped(media));

  const reportParams = $derived<ReportParams>(
    media.type === "show"
      ? { type: ReportableType.Show, id: media.id, title }
      : { type: ReportableType.Movie, id: media.id, title },
  );
</script>

{#if $isWatched}
  <MarkAsWatchedAction
    style="dropdown-item"
    type={media.type}
    mode="ask"
    {title}
    {media}
  />
{/if}

<ListAction
  style="dropdown-item"
  {media}
  {title}
  onClick={onListAction}
  variant="primary"
/>

<SideActions
  {title}
  style="dropdown-item"
  variant="primary"
  type={media.type}
  {media}
/>

<SetCoverImageAction
  style="dropdown-item"
  type={media.type}
  id={media.id}
  variant="primary"
  {title}
/>

<HistoryButton />

{#if media.type === "show" && !$isDropped}
  <DropAction
    style="dropdown-item"
    type="show"
    id={media.id}
    variant="primary"
    {title}
  />
{/if}

<RenderFor audience="authenticated">
  <ReportButton
    params={reportParams}
    label={m.button_label_report_media({ title })}
    variant="primary"
  />
</RenderFor>
