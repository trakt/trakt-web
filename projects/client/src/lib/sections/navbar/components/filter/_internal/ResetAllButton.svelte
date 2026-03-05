<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import { useFilter } from "$lib/features/filters/useFilter";
  import { useStoredFilters } from "$lib/features/filters/useStoredFilters";
  import * as m from "$lib/features/i18n/messages.ts";
  import GlobalParameterEscaper from "$lib/features/parameters/GlobalParameterEscaper.svelte";

  const { hasActiveFilter } = useFilter();
  const { resetFilters } = useStoredFilters();
</script>

<GlobalParameterEscaper enabled>
  <DropdownItem
    label={m.button_label_reset_all_filters()}
    color="red"
    style="flat"
    variant="secondary"
    disabled={!$hasActiveFilter || undefined}
    onclick={resetFilters}
  >
    {m.button_text_reset_all_filters()}
  </DropdownItem>
</GlobalParameterEscaper>
