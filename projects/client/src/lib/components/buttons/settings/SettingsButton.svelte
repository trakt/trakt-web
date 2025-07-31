<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import GearIcon from "$lib/components/icons/GearIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { style = "flat" }: { style?: "flat" | "ghost" } = $props();
</script>

<ActionButton
  {style}
  href={UrlBuilder.settings()}
  label={m.button_label_settings()}
>
  <GearIcon />
</ActionButton>
