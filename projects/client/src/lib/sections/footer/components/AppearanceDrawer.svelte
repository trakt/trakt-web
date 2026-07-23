<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import FormatPaintIcon from "$lib/components/icons/FormatPaintIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import AppearanceSettings from "$lib/sections/settings/AppearanceSettings.svelte";

  let isOpen = $state(false);
  const close = () => (isOpen = false);
</script>

<ActionButton
  style="ghost"
  label={m.button_label_open_appearance_settings()}
  tooltip={!isOpen}
  onclick={() => (isOpen = true)}
  {...{
    "aria-haspopup": "dialog",
    "aria-expanded": isOpen,
  }}
>
  <FormatPaintIcon />
</ActionButton>

{#if isOpen}
  <Drawer onClose={close} title={m.header_appearance()} size="auto">
    <AppearanceSettings showTitle={false} />
  </Drawer>
{/if}
