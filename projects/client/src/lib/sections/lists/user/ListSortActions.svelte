<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import SortDirectionIcon from "$lib/components/icons/SortDirectionIcon.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import * as m from "$lib/features/i18n/messages.ts";
  import { writable } from "svelte/store";
  import SortOptionsDrawer from "./_internal/SortOptionsDrawer.svelte";
  import type { ListUrlBuilder } from "./models/ListUrlBuilder";
  import type { SortDirection } from "./models/SortDirection";
  import type { Sorting } from "./models/Sorting";

  const {
    options,
    current,
    urlBuilder,
  }: {
    options: Sorting[];
    current: { sortHow: SortDirection; sorting: Sorting };
    urlBuilder: ListUrlBuilder;
  } = $props();

  const reversedDirection = $derived(
    current.sortHow === "asc" ? "desc" : "asc",
  );

  const isOpen = writable(false);
  const { track } = useTrack(AnalyticsEvent.ListSort);
</script>

<div class="trakt-list-sort-actions">
  <Button
    style="flat"
    size="small"
    color="default"
    label={m.button_label_sort_list()}
    onclick={() => isOpen.set(true)}
  >
    {current.sorting.text()}
  </Button>

  <ActionButton
    style="flat"
    color="default"
    size="small"
    label={reversedDirection === "asc"
      ? m.button_label_sort_ascending()
      : m.button_label_sort_descending()}
    href={`${urlBuilder({ sortHow: reversedDirection, sortBy: current.sorting.value })}`}
    onclick={() => {
      track({
        sortBy: current.sorting.value ?? "default",
        sortHow: reversedDirection,
      });
    }}
  >
    <SortDirectionIcon direction={current.sortHow} />
  </ActionButton>
</div>

{#if $isOpen}
  <SortOptionsDrawer
    {options}
    {current}
    {urlBuilder}
    onClose={() => isOpen.set(false)}
  />
{/if}

<style>
  .trakt-list-sort-actions {
    display: flex;
    gap: var(--gap-xs);
    align-items: center;

    :global(.trakt-button) {
      padding: var(--ni-6) var(--ni-12);
      --button-height: var(--ni-32);
    }

    :global(.trakt-action-button svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }
</style>
