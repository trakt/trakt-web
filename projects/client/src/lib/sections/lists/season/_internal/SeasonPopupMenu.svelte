<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import ReportButton from "$lib/features/report/ReportButton.svelte";
  import { ReportableType } from "$lib/features/report/models/ReportableType.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";

  type SeasonPopupMenuProps = {
    title: string;
    episodes: EpisodeEntry[];
    show: ShowEntry;
    seasonId?: number;
    disabled?: boolean;
  };

  const { title, episodes, show, seasonId, disabled }: SeasonPopupMenuProps =
    $props();
</script>

<PopupMenu
  label={m.button_label_popup_menu({ title })}
  mode="standalone"
  {title}
  {disabled}
>
  {#snippet items()}
    <MarkAsWatchedAction
      style="dropdown-item"
      type="episode"
      {title}
      media={episodes}
      {show}
    />

    {#if seasonId != null}
      <RenderFor audience="authenticated">
        <ReportButton
          params={{ type: ReportableType.Season, id: seasonId, title }}
          label={m.button_label_report_media({ title })}
        />
      </RenderFor>
    {/if}
  {/snippet}
</PopupMenu>
