<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import type { StreamOn } from "$lib/requests/models/StreamOn";
  import CheckInAction from "$lib/sections/media-actions/check-in/CheckInAction.svelte";
  import StreamOnButton from "../../../stream/StreamOnButton.svelte";
  import EpisodeSideActions from "./EpisodeSideActions.svelte";

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
</script>

<PopupMenu label={m.button_label_popup_menu({ title })} size="normal">
  {#snippet items()}
    <StreamOnButton
      {streamOn}
      {episode}
      media={show}
      type="episode"
      style="dropdown-item"
      size="small"
    />

    <CheckInAction
      {show}
      {episode}
      {title}
      size="small"
      style="dropdown-item"
      type="episode"
    />

    <EpisodeSideActions {title} {showTitle} {episode} style="dropdown-item" />
  {/snippet}
</PopupMenu>
