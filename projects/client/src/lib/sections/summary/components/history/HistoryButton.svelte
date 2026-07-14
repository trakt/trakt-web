<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import { m } from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import {
    SummaryDrawers,
    summaryDrawerNavigation,
  } from "$lib/sections/summary/_internal/summaryDrawerNavigation.ts";

  const {
    variant = "primary",
    onclick,
  }: {
    variant?: "primary" | "secondary";
    onclick?: () => void;
  } = $props();

  const { buildDrawerLink } = summaryDrawerNavigation();

  // In stacked contexts (e.g. the episode drawer) the caller opens a locally
  // mounted, episode-scoped history drawer via `onclick`. The default
  // `view=history` link resolves against the page behind the drawer (the
  // show), which would show the wrong history.
  const itemProps = $derived(
    onclick ? { onclick } : buildDrawerLink(SummaryDrawers.History),
  );
</script>

<RenderFor audience="authenticated">
  <DropdownItem
    style="flat"
    color="default"
    {variant}
    {...itemProps}
    label={m.button_label_view_all_history()}
  >
    {m.list_title_history()}
    {#snippet icon()}
      <ClockIcon />
    {/snippet}
  </DropdownItem>
</RenderFor>
