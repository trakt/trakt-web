<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import DateTimePicker from "$lib/components/date-time/DateTimePicker.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import PaginatedList from "$lib/components/lists/PaginatedList.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { m } from "$lib/features/i18n/messages";
  import ShadowScroller from "$lib/sections/components/ShadowScroller.svelte";
  import { useRecentlyWatchedList } from "$lib/sections/lists/stores/useRecentlyWatchedList";
  import { MIN_DATE } from "$lib/utils/constants";
  import HistorySlotPicker from "./HistorySlotPicker.svelte";
  import type { HistorySelection } from "./models/HistorySelection";

  type HistorySlotDrawerProps = {
    onClose: () => void;
    title: string;
    metaInfo?: string;
    onConfirm: (watchedAt: Date) => void;
  };

  const { onClose, title, metaInfo, onConfirm }: HistorySlotDrawerProps =
    $props();

  const now = new Date();
  let selectedSlot = $state<HistorySelection | undefined>(undefined);

  const handleSelectSlot = ({ date, bounds }: HistorySelection) => {
    selectedSlot = { date, bounds };
  };

  const { history } = useUser();
  const hasHistory = $derived.by(() => {
    if (!$history) return false;
    return $history.shows.size > 0 || $history.movies.size > 0;
  });

  let isOpen = $state(false);
</script>

<Drawer
  {onClose}
  {title}
  {metaInfo}
  size={hasHistory ? "large" : "auto"}
  onOpened={() => (isOpen = true)}
>
  <div class="trakt-history-slot-drawer-content">
    <div class="picker-wrapper">
      <DateTimePicker
        value={selectedSlot?.date}
        disabled={!selectedSlot && hasHistory}
        minDate={selectedSlot?.bounds.minDate}
        maxDate={selectedSlot?.bounds.maxDate ?? now}
        onChange={(date) => {
          if (!date) {
            selectedSlot = undefined;
            return;
          }
          selectedSlot = {
            date,
            bounds: selectedSlot?.bounds ?? {
              minDate: MIN_DATE,
              maxDate: now,
            },
          };
        }}
        label={m.date_time_label_watched({ title })}
      />
      <div class="picker-footer">
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
          disabled={!selectedSlot}
          onclick={() => {
            if (!selectedSlot) return;
            onConfirm(selectedSlot.date);
          }}
        >
          {m.button_text_mark_as_watched()}
        </Button>
      </div>
    </div>

    {#if hasHistory && isOpen}
      <p class="italic secondary">
        {m.text_pick_history_slot({ title })}
      </p>

      <ShadowScroller>
        <PaginatedList
          type={"media" as const}
          target="parent"
          useList={useRecentlyWatchedList}
        >
          {#snippet items(items)}
            <HistorySlotPicker
              list={items}
              selectedDate={selectedSlot?.date}
              onSelect={handleSelectSlot}
              {title}
            />
          {/snippet}
        </PaginatedList>
      </ShadowScroller>
    {/if}
  </div>
</Drawer>

<style>
  .trakt-history-slot-drawer-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    max-height: inherit;
    overflow: hidden;

    gap: var(--gap-m);

    :global(.trakt-paginated-list) {
      display: flex;
      flex-direction: column;
    }
  }

  .picker-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
    flex-shrink: 0;

    padding: var(--ni-4);
  }

  .picker-footer {
    display: flex;
    gap: var(--gap-s);

    :global(> *) {
      flex: 1;
    }
  }
</style>
