<script lang="ts">
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { StreamOn } from "$lib/requests/models/StreamOn";
  import TrackAction from "$lib/sections/media-actions/mark-as-watched/TrackAction.svelte";
  import ListDropdown from "$lib/sections/summary/components/list-dropdown/ListDropdown.svelte";
  import type { ListDropdownProps } from "$lib/sections/summary/components/list-dropdown/ListDropdownProps";
  import SummaryActions from "../../../_internal/SummaryActions.svelte";
  import MediaActionsPopupMenu from "./MediaActionsPopupMenu.svelte";

  const {
    media,
    streamOn,
    title,
  }: { media: MediaEntry; streamOn?: StreamOn; title: string } = $props();

  const targetProps = $derived({
    title: media.title,
    type: media.type,
    media,
  });

  const listProps = $derived<ListDropdownProps>({
    ...targetProps,
    size: "small" as const,
  });
</script>

<SummaryActions>
  <TrackAction {...targetProps} />
  <ListDropdown {...listProps} style="popup" />
  <MediaActionsPopupMenu {media} {streamOn} {title} />
</SummaryActions>
