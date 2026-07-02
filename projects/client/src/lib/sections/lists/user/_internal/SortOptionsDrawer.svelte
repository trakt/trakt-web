<script lang="ts" generics="T extends SortBy | UpNextSortBy">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import SortDirectionIcon from "$lib/components/icons/SortDirectionIcon.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { m } from "$lib/features/i18n/messages";
  import type { UpNextSortBy } from "$lib/sections/lists/progress/UpNextSortBy";
  import type { ListUrlBuilder } from "../models/ListUrlBuilder";
  import type { SortBy } from "../models/SortBy";
  import type { SortDirection } from "../models/SortDirection";
  import type { Sorting } from "../models/Sorting";
  import SortIcon from "../SortIcon.svelte";

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

  function sortHowFor(optionValue: T | undefined): SortDirection {
    return optionValue === current.sorting.value
      ? reversedDirection
      : current.sortHow;
  }
</script>

<Drawer {onClose} size="auto" title={m.drawer_title_sort()}>
  <div class="sort-buttons">
    {#each options as option}
      {#snippet icon()}
        {#if option.value}
          <SortIcon sortBy={option.value} />
        {/if}
      {/snippet}

      {#snippet end()}
        <SortDirectionIcon direction={current.sortHow} />
      {/snippet}

      <DropdownItem
        replacestate
        style="flat"
        color="default"
        href={`${urlBuilder({ sortHow: sortHowFor(option.value), sortBy: option.value })}`}
        label={option.label()}
        selected={option.value === current.sorting.value}
        icon={option.value ? icon : undefined}
        end={option.value === current.sorting.value ? end : undefined}
        onclick={() => {
          track({
            sortBy: option.value ?? "default",
            sortHow: sortHowFor(option.value),
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
