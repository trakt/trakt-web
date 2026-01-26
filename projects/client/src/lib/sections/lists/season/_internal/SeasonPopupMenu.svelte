<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";

  type SeasonPopupMenuProps = {
    title: string;
    episodes: EpisodeEntry[];
    show: ShowEntry;
  };

  const { title, episodes, show }: SeasonPopupMenuProps = $props();
</script>

<PopupMenu label={m.button_label_popup_menu({ title })} mode="standalone">
  {#snippet items()}
    <MarkAsWatchedAction
      style="dropdown-item"
      type="episode"
      {title}
      media={episodes}
      {show}
    />
  {/snippet}
</PopupMenu>
