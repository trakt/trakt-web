<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import IconWrapper from "$lib/components/icons/IconWrapper.svelte";
  import QuestionIcon from "$lib/components/icons/QuestionIcon.svelte";
  import RenameIcon from "$lib/components/icons/RenameIcon.svelte";
  import TrackIcon from "$lib/components/TrackIcon.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MarkAsWatchedAt } from "$lib/models/MarkAsWatchedAt";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import { onDestroy } from "svelte";
  import CheckInAction from "../../check-in/CheckInAction.svelte";
  import {
    useMarkAsWatched,
    type MarkAsWatchedStoreProps,
  } from "../useMarkAsWatched";
  import DateTimePickerDialog from "./DateTimePickerDialog.svelte";
  import { toMarkAsWatchedMetaInfo } from "./toMarkAsWatchedMetaInfo";

  const {
    onClose,
    title,
    ...target
  }: {
    onClose: () => void;
    title: string;
  } & MarkAsWatchedStoreProps = $props();

  const { confirm } = useConfirm();
  const { isMarkingAsWatched, markAsWatched, isWatched } = $derived(
    useMarkAsWatched(target),
  );

  const confirmedAction = writable<MarkAsWatchedAt | null>(null);

  const isDestroyed = writable(false);
  onDestroy(() => {
    isDestroyed.set(true);
  });

  const autoClose = () => {
    if (!$isDestroyed) {
      onClose();
    }
  };

  const handler = async (watchedAt: MarkAsWatchedAt) => {
    const confirmMarkAsWatched = confirm({
      type: ConfirmationType.MarkAsWatched,
      title,
      target,
      onConfirm: async () => {
        confirmedAction.set(watchedAt);
        await markAsWatched(watchedAt);
        autoClose();
      },
    });

    confirmMarkAsWatched();
  };

  const commonProps = $derived({
    style: "flat" as const,
    color: "default" as const,
    disabled: $isMarkingAsWatched || Boolean($confirmedAction),
  });

  const metaInfo = $derived(toMarkAsWatchedMetaInfo(target));

  const showDateTimePicker = writable(false);

  const isSingleMedia = $derived.by(() => {
    if (Array.isArray(target.media)) {
      return false;
    }

    return target.type === "episode" || target.type === "movie";
  });
</script>

<Drawer {onClose} {title} {metaInfo}>
  <div class="mark-as-watched-buttons">
    {#if isSingleMedia}
      <CheckInAction
        {...target}
        {title}
        style="dropdown-item"
        variant="primary"
        onCheckIn={autoClose}
      />
    {/if}

    <DropdownItem
      onclick={() => handler("now")}
      label={m.button_label_mark_as_watched_now()}
      {...commonProps}
    >
      {m.button_text_mark_as_watched_now()}
      {#snippet icon()}
        <IconWrapper isLoading={$confirmedAction === "now"}>
          <TrackIcon state={$isWatched ? "watched" : "unwatched"} />
        </IconWrapper>
      {/snippet}
    </DropdownItem>

    <DropdownItem
      onclick={() => handler("released")}
      label={m.button_label_mark_as_watched_release_date()}
      {...commonProps}
    >
      {m.button_text_mark_as_watched_release_date()}
      {#snippet icon()}
        <IconWrapper isLoading={$confirmedAction === "released"}>
          <CalendarIcon />
        </IconWrapper>
      {/snippet}
    </DropdownItem>

    <DropdownItem
      onclick={() => showDateTimePicker.set(true)}
      label={m.button_label_mark_as_watched_other_date()}
      {...commonProps}
    >
      {m.button_text_mark_as_watched_other_date()}
      {#snippet icon()}
        <IconWrapper isLoading={$confirmedAction instanceof Date}>
          <RenameIcon />
        </IconWrapper>
      {/snippet}
    </DropdownItem>

    <DropdownItem
      onclick={() => handler("unknown")}
      label={m.button_label_mark_as_watched_unknown_date()}
      {...commonProps}
    >
      {m.button_text_mark_as_watched_unknown_date()}
      {#snippet icon()}
        <IconWrapper isLoading={$confirmedAction === "unknown"}>
          <QuestionIcon />
        </IconWrapper>
      {/snippet}
    </DropdownItem>
  </div>
</Drawer>

{#if $showDateTimePicker}
  <DateTimePickerDialog
    buttonText={m.button_text_mark_as_watched()}
    onCancel={() => showDateTimePicker.set(false)}
    onConfirm={(date) => {
      handler(date);
      showDateTimePicker.set(false);
    }}
  />
{/if}

<style>
  .mark-as-watched-buttons {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
  }
</style>
