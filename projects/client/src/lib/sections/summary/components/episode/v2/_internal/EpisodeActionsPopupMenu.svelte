<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import CheckInAction from "$lib/sections/media-actions/check-in/CheckInAction.svelte";
  import SetCoverImageAction from "$lib/sections/media-actions/cover-image/SetCoverImageAction.svelte";
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
</script>

<PopupMenu label={m.button_label_popup_menu({ title })} size="normal">
  {#snippet items()}
    <CheckInAction
      {show}
      {episode}
      {title}
      size="small"
      style="dropdown-item"
      type="episode"
    />

    <EpisodeSideActions {title} {showTitle} {episode} style="dropdown-item" />

    <SetCoverImageAction
      style="dropdown-item"
      type="episode"
      id={episode.id}
      {title}
    />
  {/snippet}
</PopupMenu>
