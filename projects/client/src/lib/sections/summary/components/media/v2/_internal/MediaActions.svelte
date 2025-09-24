<script lang="ts">
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { StreamOn } from "$lib/requests/models/StreamOn";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import type { MarkAsWatchedActionProps } from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedActionProps";
  import ListDropdown from "$lib/sections/summary/components/list-dropdown/ListDropdown.svelte";
  import type { ListDropdownProps } from "$lib/sections/summary/components/list-dropdown/ListDropdownProps";
  import { useWatchCount } from "$lib/stores/useWatchCount";
  import MediaActionsPopupMenu from "./MediaActionsPopupMenu.svelte";
  import { TrackIntlProvider } from "./TrackIntlProvider";

  const {
    media,
    streamOn,
    title,
  }: { media: MediaEntry; streamOn?: StreamOn; title: string } = $props();

  const { watchCount } = $derived(useWatchCount({ media, type: media.type }));

  const commonProps = $derived({
    size: "small" as const,
    title: media.title,
    type: media.type,
    media,
  });

  const listProps = $derived<ListDropdownProps>(commonProps);
  const markAsWatchedProps = $derived<MarkAsWatchedActionProps>({
    ...commonProps,
    style: "normal",
    allowRewatch: $watchCount > 0,
    isAlwaysVisible: true,
  });
</script>

<div class="trakt-media-actions">
  <MarkAsWatchedAction {...markAsWatchedProps} i18n={TrackIntlProvider} />
  <ListDropdown {...listProps} style="popup" />
  <MediaActionsPopupMenu {media} {streamOn} {title} />
</div>

<style>
  .trakt-media-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-xs);

    position: relative;

    height: var(--ni-56);
    width: var(--ni-272);

    padding: var(--ni-8) var(--ni-10);
    box-sizing: border-box;

    background-color: var(--color-card-background);
    border-radius: var(--border-radius-l);
    box-shadow: var(--popup-shadow);

    :global(.trakt-button) {
      flex-grow: 1;

      flex-direction: row-reverse;
      justify-content: flex-end;
    }

    :global(.trakt-popup-menu-button) {
      color: var(--color-text-primary);
    }
  }
</style>
