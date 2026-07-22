<script
  lang="ts"
  generics="T extends SortBy | UpNextSortBy | UserListsSortBy"
>
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import ReorderIcon from "$lib/components/icons/ReorderIcon.svelte";
  import SortDirectionIcon from "$lib/components/icons/SortDirectionIcon.svelte";
  import OptionList from "$lib/components/option-list/OptionList.svelte";
  import OptionListItem from "$lib/components/option-list/OptionListItem.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { m } from "$lib/features/i18n/messages";
  import type { UserListsSortBy } from "$lib/requests/models/UserListsSortBy.ts";
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
  const usesWatchlistDirectionDefaults = $derived(
    options.some((option) => option.value === "rank"),
  );

  function sortHowForOption(optionValue: T | undefined): SortDirection {
    if (optionValue === current.sorting.value) {
      return reversedDirection;
    }

    if (!usesWatchlistDirectionDefaults) {
      return current.sortHow;
    }

    return optionValue === "rank" || optionValue === "title"
      ? "asc"
      : "desc";
  }
</script>

<Drawer {onClose} size="auto" title={m.drawer_title_sort()}>
  <OptionList>
    {#each options as option (option.value ?? "default")}
      {#snippet icon()}
        {#if option.value}
          <SortIcon sortBy={option.value} />
        {:else}
          <ReorderIcon />
        {/if}
      {/snippet}

      {#snippet end()}
        <SortDirectionIcon direction={current.sortHow} />
      {/snippet}

      <OptionListItem
        replacestate
        href={`${urlBuilder({ sortHow: sortHowForOption(option.value), sortBy: option.value })}`}
        title={option.text()}
        description={option.description?.()}
        selected={option.value === current.sorting.value}
        {icon}
        end={option.value === current.sorting.value ? end : undefined}
        onclick={() => {
          track({
            sortBy: option.value ?? "default",
            sortHow: sortHowForOption(option.value),
          });
        }}
      />
    {/each}
  </OptionList>
</Drawer>
