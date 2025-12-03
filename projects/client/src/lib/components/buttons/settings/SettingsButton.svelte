<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import GearIcon from "$lib/components/icons/GearIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { style = "action" }: { style?: "action" | "dropdown-item" } = $props();

  const commonProps = {
    href: UrlBuilder.settings.general(),
    label: m.button_label_settings(),
  };
</script>

{#if style === "action"}
  <ActionButton style="ghost" {...commonProps}>
    <GearIcon />
  </ActionButton>
{/if}

{#if style === "dropdown-item"}
  <DropdownItem style="flat" color="default" variant="primary" {...commonProps}>
    Settings
    {#snippet icon()}
      <GearIcon />
    {/snippet}
  </DropdownItem>
{/if}
