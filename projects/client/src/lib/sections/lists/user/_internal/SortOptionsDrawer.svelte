<script lang="ts" generics="T extends SortBy | UpNextSortBy">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import SortDirectionIcon from "$lib/components/icons/SortDirectionIcon.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { m } from "$lib/features/i18n/messages";
  import type { UpNextSortBy } from "$lib/sections/lists/progress/UpNextSortBy";
  import type { ListUrlBuilder } from "../models/ListUrlBuilder";
  import type { SortBy } from "../models/SortBy";
  import type { SortDirection } from "../models/SortDirection";
  import type { Sorting } from "../models/Sorting";
  import SortIcon from "./SortIcon.svelte";

  const {
    options,
    onClose,
    current,
    urlBuilder,
  }: {
    options: Sorting<T>[];
    onClose: () => void;
    current: { sortHow: SortDirection; sorting: Sorting<T> };
    urlBuilder: ListUrlBuilder<T>;
  } = $props();

  const { track } = useTrack(AnalyticsEvent.ListSort);

  const reversedDirection = $derived(
    current.sortHow === "asc" ? "desc" : "asc",
  );
</script>

{#snippet badge()}
  <ActionButton
    replacestate
    style="ghost"
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
{/snippet}

<Drawer {onClose} {badge} size="auto" title={m.drawer_title_sort()}>
  <div class="sort-buttons">
    {#each options as option}
      {#snippet icon()}
        {#if option.value === current.sorting.value}
          <CheckIcon />
        {:else if option.value}
          <SortIcon sortBy={option.value} />
        {/if}
      {/snippet}

      <DropdownItem
        replacestate
        style="flat"
        color="default"
        href={`${urlBuilder({ sortHow: current.sortHow, sortBy: option.value })}`}
        label={option.label()}
        disabled={option.value === current.sorting.value}
        icon={Boolean(option.value) || option.value === current.sorting.value
          ? icon
          : undefined}
        onclick={() => {
          track({
            sortBy: option.value ?? "default",
            sortHow: current.sortHow,
          });
        }}
      >
        {option.text()}
      </DropdownItem>
    {/each}
  </div>
</Drawer>

<style>
  .sort-buttons {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
  }
</style>
