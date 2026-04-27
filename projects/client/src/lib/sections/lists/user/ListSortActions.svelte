<script lang="ts" generics="T extends SortBy | UpNextSortBy">
  import { page } from "$app/state";
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import SortIcon from "$lib/components/icons/SortIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UpNextSortBy } from "$lib/sections/lists/progress/UpNextSortBy";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import SortOptionsDrawer from "./_internal/SortOptionsDrawer.svelte";
  import type { ListUrlBuilder } from "./models/ListUrlBuilder";
  import type { SortBy } from "./models/SortBy";
  import type { SortDirection } from "./models/SortDirection";
  import type { Sorting } from "./models/Sorting";

  const {
    options,
    current,
    urlBuilder,
    onUpdate,
    disabled,
  }: {
    options: Sorting<T>[];
    current: { sortHow: SortDirection; sorting: Sorting<T> };
    urlBuilder: ListUrlBuilder<T>;
    onUpdate: (params: Record<string, string>) => void;
    disabled?: boolean;
  } = $props();

  const sortHowParam = $derived(page.url.searchParams.get("sort_how"));
  const sortByParam = $derived(page.url.searchParams.get("sort_by"));

  $effect(() => {
    const params: Record<string, string> = {};
    if (sortHowParam) params.sort_how = sortHowParam;
    if (sortByParam) params.sort_by = sortByParam;
    onUpdate(params);
  });

  const isOpen = writable(false);
</script>

<ActionButton
  style="ghost"
  label={m.button_label_sort_list()}
  onclick={() => isOpen.set(true)}
  {disabled}
>
  <SortIcon />
</ActionButton>

{#if $isOpen}
  <SortOptionsDrawer
    {options}
    {current}
    {urlBuilder}
    onClose={() => isOpen.set(false)}
  />
{/if}
