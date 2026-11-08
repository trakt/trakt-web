<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import ResetFiltersIcon from "$lib/components/icons/ResetFiltersIcon.svelte";
  import SaveFiltersIcon from "$lib/components/icons/SaveFiltersIcon.svelte";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useFilter } from "./useFilter.ts";

  const { onSave, onReset }: { onSave: () => void; onReset: () => void } =
    $props();

  const { hasActiveFilter } = useFilter();
</script>

<Tooltip content={m.tooltip_reset_filters()} variant="compact" side="bottom">
  <ActionButton
    label={m.button_label_reset_all_filters()}
    style="ghost"
    color="red"
    tooltip={false}
    disabled={!$hasActiveFilter}
    onclick={onReset}
  >
    <ResetFiltersIcon />
  </ActionButton>
</Tooltip>
<Tooltip content={m.tooltip_save_as_default()} variant="compact" side="bottom">
  <ActionButton
    label={m.button_label_save_filters()}
    style="ghost"
    tooltip={false}
    onclick={onSave}
  >
    <SaveFiltersIcon />
  </ActionButton>
</Tooltip>
