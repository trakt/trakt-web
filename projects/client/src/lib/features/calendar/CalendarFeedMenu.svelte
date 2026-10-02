<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import CalendarAddIcon from "$lib/components/icons/CalendarAddIcon.svelte";
  import CopyIcon from "$lib/components/icons/CopyIcon.svelte";
  import { useActionToast } from "$lib/features/action-toast/useActionToast.ts";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { useDiscover } from "$lib/features/filters/useDiscover.ts";
  import { useFilter } from "$lib/features/filters/useFilter.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { copyToClipboard } from "$lib/utils/clipboard/copyToClipboard.ts";
  import { calendarFeedOrigin } from "./_internal/calendarFeedOrigin.ts";
  import { toCalendarFeedUrl } from "./_internal/toCalendarFeedUrl.ts";
  import { useEpisodeType } from "./useEpisodeType.ts";

  const { user } = useUser();
  const { mode, current: currentMode } = useDiscover();
  const {
    episodeType,
    current: currentEpisodeType,
    isApplicable,
  } = useEpisodeType();
  const { filterMap, activeFilterCount } = useFilter();
  const { track } = useTrack(AnalyticsEvent.CalendarFeed);
  const { notify } = useActionToast();

  const origin = calendarFeedOrigin(TRAKT_TARGET_ENVIRONMENT);

  const feedUrl = $derived.by(() => {
    const token = $user.token;
    if (!token) return null;

    return toCalendarFeedUrl({
      origin,
      token,
      mode: $mode,
      episodeType: $episodeType,
      filters: $filterMap,
    });
  });

  const scope = $derived(
    [
      $currentMode.text(),
      $isApplicable && $episodeType !== "all"
        ? $currentEpisodeType.text()
        : null,
      $activeFilterCount > 0 ? m.text_calendar_feed_filtered() : null,
    ]
      .filter(Boolean)
      .join(" · "),
  );

  const copyLink = async () => {
    if (!feedUrl) return;

    track({ action: "copy", mode: $mode });

    const isCopied = await copyToClipboard(feedUrl.https)
      .then(() => true)
      .catch(() => false);
    if (!isCopied) return;

    notify({ message: m.text_info_calendar_feed_copied() });
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
          subtitleSize="tag"
          href={feedUrl.webcal}
          onclick={() => track({ action: "subscribe", mode: $mode })}
        >
          {m.button_text_open_calendar_feed()}
          {#snippet subtitle()}
            {scope}
          {/snippet}
          {#snippet icon()}
            <CalendarAddIcon />
          {/snippet}
        </DropdownItem>
        <DropdownItem
          style="flat"
          color="default"
          variant="secondary"
          label={m.button_label_copy_calendar_feed()}
          subtitleSize="tag"
          onclick={copyLink}
        >
          {m.button_text_copy_calendar_feed()}
          {#snippet subtitle()}
            {scope}
          {/snippet}
          {#snippet icon()}
            <CopyIcon />
          {/snippet}
        </DropdownItem>
      {/snippet}
    </PopupMenu>
  {/if}
</RenderFor>
