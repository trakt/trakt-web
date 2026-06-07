<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import DateTimePicker from "$lib/components/date-time/DateTimePicker.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import IconWrapper from "$lib/components/icons/IconWrapper.svelte";
  import RenameIcon from "$lib/components/icons/RenameIcon.svelte";
  import TrackIcon from "$lib/components/icons/TrackIcon.svelte";
  import TextTag from "$lib/components/tags/TextTag.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import { toHumanClockTime } from "$lib/utils/formatting/date/toHumanClockTime.ts";
  import { toHumanShortDate } from "$lib/utils/formatting/date/toHumanShortDate.ts";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel.ts";
  import { useMarkAsWatched } from "../../useMarkAsWatched.ts";
  import { buildWatchUntilHereMedia } from "./buildWatchUntilHereMedia.ts";
  import {
    calculateWatchUntilTimestamps,
    type WatchUntilEpisode,
    type WatchUntilMode,
  } from "./calculateWatchUntilTimestamps.ts";

  type WatchedUntilHereDrawerProps = {
    show: ShowEntry;
    title: string;
    episodes: ReadonlyArray<WatchUntilEpisode>;
    isResolvingEpisodes: boolean;
    onClose: () => void;
  };

  const {
    show,
    title,
    episodes,
    isResolvingEpisodes,
    onClose,
  }: WatchedUntilHereDrawerProps = $props();

  let mode = $state<WatchUntilMode>("just-now");
  let anchorKind = $state<"start" | "end">("end");
  let anchorDate = $state<Date | undefined>(undefined);

  const isCustom = $derived(mode === "custom-start" || mode === "custom-end");
  const effectiveMode = $derived<WatchUntilMode>(
    !isCustom ? mode : anchorKind === "start" ? "custom-start" : "custom-end",
  );

  const timestamps = $derived.by(() => {
    if (episodes.length === 0) return [];
    if (isCustom && !anchorDate) return [];

    return calculateWatchUntilTimestamps({
      episodes,
      mode: effectiveMode,
      anchor: anchorDate,
      now: new Date(),
      fallbackRuntime: show.runtime,
    });
  });

  const isWatchUntilMedia = $derived(
    buildWatchUntilHereMedia({
      showId: show.id,
      showReleaseDate: show.effectiveReleaseDate,
      timestamps,
    }),
  );

  const target = $derived({
    type: "show" as const,
    media: isWatchUntilMedia,
  });
  const { markAsWatched, isMarkingAsWatched } = $derived(
    useMarkAsWatched(target),
  );

  const canConfirm = $derived(
    !isResolvingEpisodes && !$isMarkingAsWatched && timestamps.length > 0,
  );

  const handleModeChange = (next: WatchUntilMode) => {
    mode = next;
    if (next !== "custom-start" && next !== "custom-end") {
      anchorDate = undefined;
    }
  };

  const handleConfirm = async () => {
    if (!canConfirm) return;
    await markAsWatched();
    onClose();
  };

  const metaInfo = $derived(
    m.text_watch_until_here_episode_count({ count: episodes.length }),
  );
</script>

<Drawer {onClose} {title} {metaInfo} size="large">
  <div class="watch-until-here-drawer">
    <div class="mode-options">
      <DropdownItem
        onclick={() => handleModeChange("just-now")}
        label={m.button_label_mark_as_watched_now()}
        style="flat"
        color="default"
        variant={mode === "just-now" ? "primary" : "secondary"}
        disabled={mode === "just-now"}
      >
        {m.button_text_mark_as_watched_now()}
        {#snippet icon()}
          <IconWrapper isLoading={false}>
            <TrackIcon state="watched" />
          </IconWrapper>
        {/snippet}
      </DropdownItem>

      <DropdownItem
        onclick={() => handleModeChange("custom-end")}
        label={m.button_label_mark_as_watched_other_date()}
        style="flat"
        color="default"
        variant={isCustom ? "primary" : "secondary"}
        disabled={isCustom}
      >
        {m.button_text_mark_as_watched_other_date()}
        {#snippet icon()}
          <IconWrapper isLoading={false}>
            <RenameIcon />
          </IconWrapper>
        {/snippet}
      </DropdownItem>

      <DropdownItem
        onclick={() => handleModeChange("released")}
        label={m.button_label_mark_as_watched_release_date()}
        style="flat"
        color="default"
        variant={mode === "released" ? "primary" : "secondary"}
        disabled={mode === "released"}
      >
        {m.button_text_mark_as_watched_release_date()}
        {#snippet icon()}
          <IconWrapper isLoading={false}>
            <CalendarIcon />
          </IconWrapper>
        {/snippet}
      </DropdownItem>
    </div>

    {#if isCustom}
      <div class="custom-anchor">
        <div class="anchor-kind">
          <Button
            size="small"
            variant={anchorKind === "start" ? "primary" : "secondary"}
            color={anchorKind === "start" ? "purple" : "default"}
            label={m.button_label_watch_until_here_anchor_start()}
            onclick={() => (anchorKind = "start")}
          >
            {m.button_text_watch_until_here_anchor_start()}
          </Button>
          <Button
            size="small"
            variant={anchorKind === "end" ? "primary" : "secondary"}
            color={anchorKind === "end" ? "purple" : "default"}
            label={m.button_label_watch_until_here_anchor_end()}
            onclick={() => (anchorKind = "end")}
          >
            {m.button_text_watch_until_here_anchor_end()}
          </Button>
        </div>

        <DateTimePicker
          value={anchorDate}
          maxDate={new Date()}
          onChange={(date) => (anchorDate = date)}
          label={m.date_time_label_watch_until_here()}
        />
      </div>
    {/if}

    <section class="preview">
      {#if !isCustom || Boolean(anchorDate)}
        <h2 class="bold capitalize preview-title">
          {m.text_watch_until_here_preview_title()}
        </h2>
      {/if}

      <ol class="preview-list">
        {#each timestamps as { episode, watchedAt } (episode.id)}
          <li class="preview-row">
            <div class="preview-row-label">
              <p class="bold no-wrap">
                {episodeNumberLabel({
                  seasonNumber: episode.season,
                  episodeNumber: episode.number,
                })}
              </p>
            </div>
            <TextTag classList="preview-row-tag">
              <p>
                {toHumanShortDate(watchedAt)} · {toHumanClockTime(watchedAt)}
              </p>
            </TextTag>
          </li>
        {/each}
      </ol>
    </section>

    <div class="actions">
      <Button
        size="small"
        color="default"
        label={m.button_text_cancel()}
        onclick={onClose}
      >
        {m.button_text_cancel()}
      </Button>
      <Button
        size="small"
        variant="primary"
        color="purple"
        label={m.button_label_mark_as_watched({ title })}
        disabled={!canConfirm}
        onclick={handleConfirm}
      >
        {m.button_text_mark_as_watched()}
      </Button>
    </div>
  </div>
</Drawer>

<style lang="scss">
  .watch-until-here-drawer {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    height: 100%;
    max-height: inherit;
    min-height: 0;
  }

  .mode-options {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
  }

  .custom-anchor {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    padding: var(--ni-12);
    border-radius: var(--border-radius-l);
    background: var(--color-surface-subtle, transparent);
  }

  .anchor-kind {
    display: flex;
    gap: var(--gap-xs);

    :global(> *) {
      flex: 1;
    }
  }

  .preview {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    min-height: 0;
  }

  .preview-title {
    color: var(--color-text-secondary);
    font-size: var(--font-size-tag);
  }

  .preview-list {
    list-style: none;
    margin: 0;
    padding: 0;

    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);

    overflow-y: auto;
    min-height: 0;
  }

  .preview-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-s);

    padding: var(--ni-8) var(--ni-12);
    border-radius: var(--border-radius-m);
    background: var(--color-surface-subtle, transparent);

    :global(.preview-row-tag) {
      flex-shrink: 0;
    }
  }

  .preview-row-label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .actions {
    display: flex;
    gap: var(--gap-s);
    margin-top: auto;

    :global(> *) {
      flex: 1;
    }
  }
</style>
