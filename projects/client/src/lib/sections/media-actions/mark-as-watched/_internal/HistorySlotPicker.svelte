<script lang="ts">
  import { getLocale } from "$lib/features/i18n";
  import { m } from "$lib/features/i18n/messages";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { HistoryEntry } from "$lib/sections/lists/stores/models/HistoryEntry";
  import { MEDIA_POSTER_PLACEHOLDER } from "$lib/utils/assets";
  import { toHumanDate } from "$lib/utils/formatting/date/toHumanDate";
  import { episodeActivityTitle } from "$lib/utils/intl/episodeActivityTitle";
  import { buildHistorySlots } from "./buildHistorySlots";
  import { calculateHistorySelection } from "./calculateHistorySelection";
  import { getActiveSlotKey } from "./getActiveSlotKey";
  import HistorySlotButton from "./HistorySlotButton.svelte";
  import type { HistorySelection } from "./models/HistorySelection";
  import type { SlottedEntry } from "./models/SlottedEntry";

  type HistorySlotPickerProps = {
    list: HistoryEntry[];
    selectedDate?: Date;
    onSelect: (selection: HistorySelection) => void;
    title: string;
  };

  const { list, onSelect, selectedDate, title }: HistorySlotPickerProps =
    $props();

  const now = new Date();
  const slottedHistory = $derived(buildHistorySlots({ now, list }));

  const getEntryCover = (entry: HistoryEntry) => {
    return entry.type === "episode"
      ? entry.show.poster.url.thumb
      : entry.movie.poster.url.thumb;
  };

  let lastClickedKey = $state<string | null>(null);

  const activeSlotKey = $derived.by(() => {
    if (!selectedDate) return null;

    return getActiveSlotKey(
      { date: selectedDate, key: lastClickedKey },
      slottedHistory,
    );
  });

  const handleSelect = (slot: SlottedEntry) => {
    lastClickedKey = slot.key;
    const selection = calculateHistorySelection(slot.startDate, slot.endDate);
    onSelect(selection);
  };
</script>

<ul class="trakt-history-slot-picker">
  {#each slottedHistory as slot (slot.key)}
    {#if slot.entry}
      {@const entry = slot.entry}
      <li class="trakt-history-slot-row">
        <CrossOriginImage
          classList="trakt-card-cover-image"
          src={getEntryCover(entry) ?? MEDIA_POSTER_PLACEHOLDER}
          alt={m.image_alt_media_poster({ title })}
        />
        <div class="trakt-watch-history-info">
          {#if entry.type === "episode"}
            <p class="ellipsis">
              {episodeActivityTitle(entry.episode, entry.show)}
            </p>
          {:else}
            <p class="ellipsis">{entry.movie.title}</p>
          {/if}
          <p class="capitalize ellipsis secondary italic">
            {toHumanDate(now, entry.watchedAt, getLocale())}
          </p>
        </div>
      </li>
    {/if}

    <HistorySlotButton
      timeSlot={{ startDate: slot.startDate, endDate: slot.endDate }}
      isActive={activeSlotKey === slot.key}
      label={m.button_label_history_slot({
        startDate: toHumanDate(now, slot.startDate, getLocale()),
        endDate: toHumanDate(now, slot.endDate, getLocale()),
      })}
      onClick={() => handleSelect(slot)}
    />
  {/each}
</ul>

<style>
  .trakt-history-slot-picker {
    display: flex;
    flex-direction: column;

    list-style: none;

    margin: 0;
    padding: 0;
  }

  .trakt-history-slot-row {
    display: flex;
    align-items: center;
    gap: var(--gap-s);

    :global(.trakt-card-cover-image) {
      height: var(--ni-56);
      width: calc(var(--ni-56) * (2 / 3));

      border-radius: var(--border-radius-s);

      box-shadow: var(--shadow-base);
    }
  }

  .trakt-watch-history-info {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);

    min-width: 0;
  }
</style>
