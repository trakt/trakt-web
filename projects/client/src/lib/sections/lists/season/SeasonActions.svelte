<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import ReportButton from "$lib/features/report/ReportButton.svelte";
  import { ReportableType } from "$lib/features/report/models/ReportableType.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { ListTarget } from "$lib/models/ListTarget";
  import ListAction from "$lib/sections/components/lists-drawer/ListAction.svelte";
  import { manageListsDrawerStore } from "$lib/sections/components/lists-drawer/manageListsDrawerStore";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import type { SeasonActionsProps } from "./SeasonActionsProps.ts";

  const {
    title,
    episodes,
    show,
    season,
    isLoading = false,
  }: SeasonActionsProps = $props();

  const target = $derived<ListTarget>({ type: "season", media: season });
</script>

<MarkAsWatchedAction
  style="dropdown-item"
  type="episode"
  {title}
  media={episodes}
  {show}
  {isLoading}
/>

<ListAction
  style="dropdown-item"
  {target}
  {title}
  onClick={() =>
    manageListsDrawerStore.open({ target, title, metaInfo: show.title })}
/>

<RenderFor audience="authenticated">
  <ReportButton
    params={{ type: ReportableType.Season, id: season.id, title }}
    label={m.button_label_report_media({ title })}
  />
</RenderFor>
