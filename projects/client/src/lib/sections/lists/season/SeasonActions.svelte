<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import ReportButton from "$lib/features/report/ReportButton.svelte";
  import { ReportableType } from "$lib/features/report/models/ReportableType.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import type { SeasonActionsProps } from "./SeasonActionsProps.ts";

  const {
    title,
    episodes,
    show,
    seasonId,
    isLoading = false,
  }: SeasonActionsProps = $props();
</script>

<MarkAsWatchedAction
  style="dropdown-item"
  type="episode"
  {title}
  media={episodes}
  {show}
  {isLoading}
/>

{#if seasonId != null}
  <RenderFor audience="authenticated">
    <ReportButton
      params={{ type: ReportableType.Season, id: seasonId, title }}
      label={m.button_label_report_media({ title })}
    />
  </RenderFor>
{/if}
