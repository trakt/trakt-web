<script lang="ts">
  import SingleSelect from "$lib/components/select/SingleSelect.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { ListTarget } from "../models/ListTarget";
  import { toTargetLabel } from "./toTargetLabel";

  const {
    value,
    onChange,
    disabled,
  }: {
    value: ListTarget;
    onChange: (value: ListTarget) => void;
    disabled?: boolean;
  } = $props();

  const options = $derived(
    Object.values(ListTarget).map((target) => ({
      value: target,
      label: toTargetLabel(target),
    })),
  );
</script>

<SingleSelect
  {options}
  {value}
  {disabled}
  placeholder={m.header_target()}
  variant="chip"
  autoWidth
  onChange={(value) => onChange(value as ListTarget)}
/>
