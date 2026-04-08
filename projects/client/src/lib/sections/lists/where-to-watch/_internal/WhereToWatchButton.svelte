<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import {
    Drawers,
    summaryDrawerNavigation,
  } from "$lib/sections/summary/_internal/summaryDrawerNavigation";

  const { buildDrawerLink } = summaryDrawerNavigation();
  const href = $derived(buildDrawerLink(Drawers.WhereToWatch));
</script>

<ActionButton
  label={m.button_label_view_all_where_to_watch()}
  {href}
  noscroll
  style="ghost"
>
  <CaretRightIcon />
</ActionButton>
