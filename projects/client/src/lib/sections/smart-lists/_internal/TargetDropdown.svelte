<script lang="ts">
  import SingleSelect from "$lib/components/select/SingleSelect.svelte";
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

  const options = $derived(
    Object.values(ListTarget).map((target) => ({
      value: target,
      label: targetText(target),
    })),
  );
</script>

<SingleSelect
  {options}
  {value}
  {disabled}
  placeholder={m.header_target()}
  autoWidth
  onChange={(value) => onChange(value as ListTarget)}
/>
