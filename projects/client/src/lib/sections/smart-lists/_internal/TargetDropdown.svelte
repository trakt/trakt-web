<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DropdownList from "$lib/components/dropdown/DropdownList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { ListTarget } from "../models/ListTarget";

  const {
    value,
    onChange,
    disabled,
  }: {
    value: ListTarget;
    onChange: (value: ListTarget) => void;
    disabled?: boolean;
  } = $props();

  const targetText = (target: ListTarget) => {
    switch (target) {
      case ListTarget.Trending:
        return m.list_title_trending();
      case ListTarget.Anticipated:
        return m.list_title_most_anticipated();
      case ListTarget.Popular:
        return m.list_title_most_popular();
    }
  };
</script>

<DropdownList
  label={m.header_target()}
  variant="secondary"
  size="small"
  style="flat"
  color="default"
  {disabled}
>
  {targetText(value)}
  {#snippet items()}
    {#each Object.values(ListTarget) as target (target)}
      <DropdownItem color="blue" onclick={() => onChange(target)}>
        {targetText(target)}
      </DropdownItem>
    {/each}
  {/snippet}
</DropdownList>
