<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { StreamOn } from "$lib/requests/models/StreamOn";
  import CheckInAction from "$lib/sections/media-actions/check-in/CheckInAction.svelte";
  import StreamOnButton from "../../../stream/StreamOnButton.svelte";
  import SideActions from "./SideActions.svelte";

  const {
    media,
    streamOn,
    title,
  }: { media: MediaEntry; streamOn?: StreamOn; title: string } = $props();
</script>

<PopupMenu label={m.button_label_popup_menu({ title })} size="normal">
  {#snippet items()}
    <StreamOnButton
      {streamOn}
      {media}
      type={media.type}
      style="dropdown-item"
      size="small"
    />

    {#if media.type === "movie"}
      <CheckInAction
        {media}
        {title}
        size="small"
        style="dropdown-item"
        type="movie"
      />
    {/if}

    <SideActions
      {title}
      style="dropdown-item"
      type={media.type}
      trailer={media.trailer}
      slug={media.slug}
    />
  {/snippet}
</PopupMenu>
