<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import { m } from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import {
    Drawers,
    summaryDrawerNavigation,
  } from "$lib/sections/summary/_internal/summaryDrawerNavigation.ts";

  const { variant = "primary" }: { variant?: "primary" | "secondary" } =
    $props();

  const { buildDrawerLink } = summaryDrawerNavigation();
</script>

<RenderFor audience="authenticated">
  <DropdownItem
    style="flat"
    color="default"
    {variant}
    href={buildDrawerLink(Drawers.History)}
    noscroll
    label={m.button_label_view_all_history()}
  >
    {m.list_title_history()}
    {#snippet icon()}
      <ClockIcon />
    {/snippet}
  </DropdownItem>
</RenderFor>
