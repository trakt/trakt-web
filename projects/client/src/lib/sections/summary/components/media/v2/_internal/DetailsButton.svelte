<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import InfoIcon from "$lib/components/icons/InfoIcon.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { m } from "$lib/features/i18n/messages";
  import {
    Drawers,
    summaryDrawerNavigation,
  } from "$lib/sections/summary/_internal/summaryDrawerNavigation";

  const {
    variant,
    style = "action",
    size,
    title,
  }: {
    variant?: "primary" | "secondary";
    style?: "action" | "dropdown-item";
    size?: "normal" | "small";
    title: string;
  } = $props();

  const { buildDrawerLink } = summaryDrawerNavigation();
  const { track } = useTrack(AnalyticsEvent.Drilldown);

  const onclick = () => track({ source: "details" });

  const commonProps = $derived({
    href: buildDrawerLink(Drawers.Details),
    label: m.button_label_details({ title }),
    onclick,
  });
</script>

{#if style === "action"}
  <ActionButton style="ghost" {variant} {size} {...commonProps}>
    <InfoIcon />
  </ActionButton>
{/if}

{#if style === "dropdown-item"}
  <DropdownItem
    style="flat"
    color="default"
    variant={variant ?? "primary"}
    {...commonProps}
  >
    {m.button_text_details()}
    {#snippet icon()}
      <InfoIcon />
    {/snippet}
  </DropdownItem>
{/if}
