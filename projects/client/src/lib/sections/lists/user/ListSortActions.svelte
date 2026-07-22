<script
  lang="ts"
  generics="T extends SortBy | UpNextSortBy | UserListsSortBy"
>
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import SortIcon from "$lib/components/icons/SortIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UserListsSortBy } from "$lib/requests/models/UserListsSortBy.ts";
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
    disabled,
  }: {
    options: Sorting<T>[];
    current: { sortHow: SortDirection; sorting: Sorting<T> };
    urlBuilder: ListUrlBuilder<T>;
    disabled?: boolean;
  } = $props();

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
