<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import CalendarAddIcon from "$lib/components/icons/CalendarAddIcon.svelte";
  import CopyIcon from "$lib/components/icons/CopyIcon.svelte";
  import Snackbar from "$lib/components/snackbar/Snackbar.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { copyToClipboard } from "$lib/utils/clipboard/copyToClipboard";
  import { calendarFeedEnvironment } from "./_internal/calendarFeedEnvironment";
  import { toCalendarFeedUrl } from "./_internal/toCalendarFeedUrl";
  import { useEpisodeType } from "./useEpisodeType";

  const { user } = useUser();
  const { mode } = useDiscover();
  const { episodeType } = useEpisodeType();
  const { filterMap } = useFilter();

  const environment = calendarFeedEnvironment(TRAKT_TARGET_ENVIRONMENT);

  const feedUrl = $derived.by(() => {
    const token = $user.token;
    if (!token) return null;

    return toCalendarFeedUrl({
      environment,
      token,
      mode: $mode,
      episodeType: $episodeType,
      filters: $filterMap,
    });
  });

  let isCopied = $state(false);

  const copyLink = async () => {
    if (!feedUrl) return;

    isCopied = await copyToClipboard(feedUrl.https)
      .then(() => true)
      .catch(() => false);
  };
</script>

<RenderFor audience="vip">
  {#if feedUrl}
    <PopupMenu
      label={m.button_label_calendar_feed()}
      title={m.header_calendar_feed()}
      mode="standalone"
      size="normal"
    >
      {#snippet icon()}
        <CalendarAddIcon />
      {/snippet}
      {#snippet items()}
        <DropdownItem
          style="flat"
          color="default"
          variant="secondary"
          label={m.button_label_open_calendar_feed()}
          href={feedUrl.webcal}
        >
          {m.button_text_open_calendar_feed()}
          {#snippet icon()}
            <CalendarAddIcon />
          {/snippet}
        </DropdownItem>
        <DropdownItem
          style="flat"
          color="default"
          variant="secondary"
          label={m.button_label_copy_calendar_feed()}
          onclick={copyLink}
        >
          {m.button_text_copy_calendar_feed()}
          {#snippet icon()}
            <CopyIcon />
          {/snippet}
        </DropdownItem>
      {/snippet}
    </PopupMenu>
  {/if}
</RenderFor>

<Snackbar
  open={isCopied}
  onDismiss={() => (isCopied = false)}
  title={m.header_calendar_feed()}
  message={m.text_info_calendar_feed_copied()}
/>
